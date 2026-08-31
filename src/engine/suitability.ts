/**
 * Bohnen-Eignung je Methode.
 *
 * Übernommen aus der alten `barista-pwa` (docs/03 §2.1) — dort die beste Idee,
 * die im Briefing nicht vorkam: Manche Bohnen passen schlicht nicht zu manchen
 * Methoden. Das vorher zu sagen erspart aussichtslose Dial-in-Schleifen
 * (kb/15 §6).
 *
 * Bewusst anders als im Altbestand: dort erfundene Prozentzahlen (95, 92, 74),
 * die eine Präzision suggerieren, die es nicht gibt. Hier fünf Stufen aus
 * `data/methods.json` plus Herkunftsprofil.
 */
import type { Bean, BrewMethod, Process } from '@domain'
import { METHODS } from '@/labels'
import { getMethod, getOrigin } from '@/kb'

export type SuitabilityLevel = 'ideal' | 'gut' | 'machbar' | 'anspruchsvoll' | 'schwierig'

export interface Suitability {
  score: number // 1–5, eine Nachkommastelle
  level: SuitabilityLevel
  reason: string
  isWarning: boolean
}

const LEVELS: [number, SuitabilityLevel][] = [
  [4.5, 'ideal'],
  [3.5, 'gut'],
  [2.5, 'machbar'],
  [1.5, 'anspruchsvoll'],
  [0, 'schwierig'],
]

/** Aufbereitungen auf die vier Familien der Eignungsmatrix abbilden */
function family(p: Process): 'washed' | 'natural' | 'honey' | 'fermented' {
  if (p.startsWith('honey')) return 'honey'
  if (p === 'anaerobic' || p === 'carbonic-maceration' || p === 'experimental') return 'fermented'
  if (p === 'wet-hulled') return 'natural'
  if (p === 'natural') return 'natural'
  return 'washed'
}

function levelOf(score: number): SuitabilityLevel {
  for (const [min, lvl] of LEVELS) if (score >= min) return lvl
  return 'schwierig'
}

export function suitability(bean: Bean, method: BrewMethod): Suitability {
  const m = getMethod(method) as unknown as {
    suitability?: Record<string, Record<string, number>>
  }
  const base = m.suitability?.[bean.roastLevel]?.[family(bean.process)] ?? 3

  // Herkunftsprofil aus origins.json (1–5) als sanfte Korrektur, nicht als
  // zweite Meinung: maximal ±0,6 Stufen.
  const origin = bean.origins[0] ? getOrigin(bean.origins[0].country) : undefined
  const originFit = origin?.methodSuitability?.[method]
  const delta = originFit !== undefined ? (originFit - 3) * 0.3 : 0

  const score = Math.max(1, Math.min(5, Math.round((base + delta) * 10) / 10))
  const level = levelOf(score)

  return {
    score,
    level,
    reason: reasonFor(bean, method, level, origin?.name),
    isWarning: score < 2.5,
  }
}

function reasonFor(
  bean: Bean,
  method: BrewMethod,
  level: SuitabilityLevel,
  originName?: string,
): string {
  const o = originName ? `${originName}, ` : ''
  const roastWord =
    bean.roastLevel === 'light' || bean.roastLevel === 'medium-light'
      ? 'helle Röstung'
      : bean.roastLevel === 'dark' || bean.roastLevel === 'medium-dark'
        ? 'dunkle Röstung'
        : 'mittlere Röstung'

  if (method === 'espresso') {
    if (level === 'schwierig' || level === 'anspruchsvoll')
      return `${o}${roastWord}: dicht und säurebetont. Im Druckformat wird die Säure schnell dominant — weite Ratio (1:2,5–1:3), hohe Temperatur, feiner Mahlgrad. Als V60 spielt diese Bohne ihre Stärken besser aus.`
    if (level === 'ideal')
      return `${o}${roastWord}: löst sich leicht, trägt Körper und Süße — das klassische Espressoprofil.`
    return `${o}${roastWord}: funktioniert im Espresso solide.`
  }

  if (method === 'v60') {
    if (level === 'schwierig' || level === 'anspruchsvoll')
      return `${o}${roastWord}: wenig Säure und viel Röstaroma. Im V60 wirkt das schnell flach und bitter — AeroPress oder Espresso passen besser.`
    if (level === 'ideal')
      return `${o}${roastWord}: genau das Profil, das der V60 zeigen kann — Klarheit, Säurestruktur, Aromatik.`
    return `${o}${roastWord}: im V60 gut machbar.`
  }

  if (level === 'ideal') return `${o}${roastWord}: die AeroPress holt hier Süße und Körper heraus.`
  return `${o}${roastWord}: die AeroPress verzeiht viel — funktioniert.`
}

/** Beste Methode für eine Bohne */
/**
 * Welche Methode diese Bohne am besten zeigt.
 *
 * Bewusst NICHT `suitability`: Die misst, wie leicht etwas schiefgeht, und
 * die AeroPress ist nun einmal die fehlerverzeihendste Methode. Sie gewann
 * dadurch fast immer — auch bei einer brasilianischen Natural, die jeder
 * Röster als Espressobohne verkauft.
 *
 * Empfohlen wird deshalb nach dem Herkunftsprofil (origins.json), das die
 * Frage „wo spielt diese Bohne ihre Stärken aus?" beantwortet. Die
 * Schwierigkeit kommt nur noch als Sperre dazu: Was für die Bohne
 * ausgesprochen schwierig ist, wird nicht empfohlen, egal wie gut es
 * theoretisch passt. Ohne Herkunftsangabe (Blend) bleibt die Eignung.
 */
export function bestMethodFor(bean: Bean): { method: BrewMethod; suitability: Suitability } {
  const methods = METHODS
  const origin = bean.origins[0] ? getOrigin(bean.origins[0].country) : undefined

  const scored = methods.map((m) => {
    const suit = suitability(bean, m)
    const fit = origin?.methodSuitability?.[m]
    // Ohne Herkunftsprofil trägt die Eignung die Entscheidung allein.
    const basis = fit ?? suit.score
    // Anspruchsvoll heißt nicht ausgeschlossen, aber es kostet.
    return { method: m, suitability: suit, rang: basis - (suit.score < 3.5 ? 0.75 : 0) }
  })

  // Was die App selbst „schwierig" nennt, empfiehlt sie nicht — auch wenn
  // die Herkunft dafür spricht. Eine hell geröstete Brasilianerin ist im
  // Espresso schwierig, egal wie sehr Brasilien für Espresso steht.
  // Nur wenn keine einzige Methode über der Schwelle liegt, gewinnt die
  // am wenigsten schwierige.
  const brauchbar = scored.filter((x) => x.suitability.score >= 2.5)
  const feld = brauchbar.length ? brauchbar : scored
  if (!brauchbar.length) feld.sort((a, b) => b.suitability.score - a.suitability.score)
  else feld.sort((a, b) => b.rang - a.rang)

  return { method: feld[0]!.method, suitability: feld[0]!.suitability }
}

export const SUITABILITY_LABEL: Record<SuitabilityLevel, string> = {
  ideal: 'ideal',
  gut: 'gut geeignet',
  machbar: 'machbar',
  anspruchsvoll: 'anspruchsvoll',
  schwierig: 'schwierig',
}
