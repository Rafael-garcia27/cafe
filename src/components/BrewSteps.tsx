/**
 * Der Ablauf, wie man ihn tatsächlich abarbeitet.
 *
 * Die Wissensbasis kennt für jede Methode die Schrittfolge (methods.json),
 * die App zeigte davon bisher nichts. Wer nur Dosis, Wasser und Zielzeit
 * sieht, weiß nicht, dass ein V60-Rezept mit 45 g Bloom beginnt und in
 * vier Aufgüssen weitergeht — das Rezept ließ sich mit der App gar nicht
 * so brühen, wie sie es berechnet.
 */
import { useState } from 'react'
import type { BrewMethod } from '@domain'
import { getMethod } from '@/kb'
import { num, fmtClock } from './ui'

export interface StepParams {
  doseG: number
  waterG?: number
  yieldG?: number
  waterTempC: number
  bloomWaterG?: number
  bloomTimeS?: number
  pourCount?: number
  steepS?: number
  stirCount?: number
  inverted?: boolean
  targetTimeS?: [number, number]
}

interface RawStep {
  index: number
  type: string
  note?: string
  warning?: string
  durationS?: number
}

/**
 * Dauer in der Schreibweise, die daneben im Zeitfeld steht: ab einer
 * Minute als m:ss. „125 s ziehen lassen" neben einem Feld mit „2:38"
 * zwingt sonst zum Umrechnen.
 */
function dauer(s: number): string {
  return s >= 60 ? fmtClock(s) : `${Math.round(s)} s`
}

/** Kurzfassung der Schritte, die die Methode ausmachen. */
export function stepSummary(method: BrewMethod, p: StepParams): string | null {
  if (method === 'v60') {
    const teile = []
    if (p.bloomWaterG && p.bloomTimeS) teile.push(`${p.bloomWaterG} g Bloom, ${dauer(p.bloomTimeS)}`)
    if (p.pourCount) teile.push(`${p.pourCount} Aufgüsse`)
    return teile.length ? teile.join(' · ') : null
  }
  if (method === 'aeropress') {
    const teile = []
    if (p.inverted) teile.push('invertiert')
    if (p.stirCount) teile.push(`${p.stirCount}× rühren`)
    if (p.steepS) teile.push(`${dauer(p.steepS)} ziehen`)
    teile.push('wenden, pressen')
    return teile.join(' · ')
  }
  return null
}

/**
 * Ein Schritt in Worten, mit den Zahlen dieses Rezepts.
 *
 * Wo die Wissensbasis eine konkrete Anweisung hinterlegt hat, gewinnt
 * sie — sie ist genauer als jede allgemeine Formulierung. Ersetzt werden
 * nur die Schritte, in denen die Zahlen dieses Rezepts stehen müssen.
 */
function textFor(s: RawStep, method: BrewMethod, p: StepParams, vorher: RawStep[]): string {
  const gesamt = p.waterG ?? p.yieldG
  switch (s.type) {
    case 'prepare':
      // Beim Espresso heizt die Maschine, nicht der Wasserkocher.
      if (method === 'espresso') return s.note ?? 'Maschine aufheizen'
      return `Wasser auf ${p.waterTempC} °C bringen`
    case 'rinse':
      return s.note ?? 'Filter spülen, Spülwasser weggießen'
    case 'assemble':
      return s.note ?? (p.inverted ? 'Presse umgedreht auf die Waage' : 'Presse auf die Tasse setzen')
    case 'weigh':
      // Das zweite Wiegen gilt dem gemahlenen Kaffee, nicht den Bohnen.
      return vorher.some((v) => v.type === 'grind')
        ? (s.note ?? `Auf ${num(p.doseG)} g auswiegen`)
        : `${num(p.doseG)} g Bohnen abwiegen`
    case 'rdt':
      return 'Ein bis zwei Tropfen Wasser auf die Bohnen'
    case 'grind':
      return 'Mahlen'
    case 'wdt':
      return s.note ? `Klumpen auflösen — ${s.note}` : 'Klumpen auflösen'
    case 'level':
      return 'Kaffeebett eben abziehen'
    case 'tamp':
      return s.note ? `Tampen: ${s.note}` : 'Tampen — eben ist wichtiger als fest'
    case 'flush':
      return 'Brühgruppe kurz spülen'
    case 'fill':
      return method === 'aeropress' ? 'Mehl einfüllen' : 'Mehl einfüllen, Bett flach klopfen'
    case 'tare':
      return 'Waage tarieren'
    case 'bloom':
      return p.bloomWaterG && p.bloomTimeS
        ? `${p.bloomWaterG} g aufgießen, ${dauer(p.bloomTimeS)} blühen lassen`
        : 'Blooming'
    case 'swirl':
      return s.note === 'Rao Spin' ? 'Kurz schwenken, damit das Bett eben bleibt' : 'Schwenken'
    case 'pour':
      if (method === 'aeropress') return gesamt ? `Auf ${gesamt} g aufgießen` : 'Aufgießen'
      return p.pourCount && gesamt
        ? `In ${p.pourCount - 1} weiteren Aufgüssen auf ${gesamt} g`
        : 'Weiter aufgießen'
    case 'stir':
      return p.stirCount ? `${p.stirCount}× rühren` : 'Rühren'
    case 'steep':
      return p.steepS ? `${dauer(p.steepS)} ziehen lassen` : 'Ziehen lassen'
    case 'cap':
      return s.note ?? 'Kappe aufsetzen und festdrehen'
    case 'invert':
      return 'Tasse aufsetzen und wenden'
    case 'press':
      return 'In etwa 25 s gleichmäßig durchdrücken'
    case 'drawdown':
      return 'Durchlaufen lassen'
    case 'brew':
      return p.yieldG ? `Bezug starten, Ziel ${num(p.yieldG)} g` : 'Bezug starten'
    case 'stop':
      return p.targetTimeS
        ? `Bei Zielgewicht stoppen (${dauer(p.targetTimeS[0])}–${dauer(p.targetTimeS[1])})`
        : 'Stoppen'
    case 'dilute':
      return 'Nach Geschmack mit heißem Wasser strecken'
    case 'record':
      return 'Werte eintragen'
    case 'taste':
      return 'Tasting'
    default:
      return s.note ?? s.type
  }
}

export default function BrewSteps({ method, params }: { method: BrewMethod; params: StepParams }) {
  const [offen, setOffen] = useState(false)
  const steps = ((getMethod(method) as unknown as { steps?: RawStep[] }).steps ?? [])
    // Aufnehmen und Verkosten sind eigene Bildschirme der App, keine Handgriffe.
    .filter((s) => s.type !== 'record' && s.type !== 'taste')

  if (!steps.length) return null
  const kurz = stepSummary(method, params)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left"
        aria-expanded={offen}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium">Ablauf</span>
          {kurz && !offen && <span className="mt-0.5 block text-[13px] text-mute">{kurz}</span>}
        </span>
        <span className="shrink-0 text-[13px] text-crema">{offen ? 'weniger' : `${steps.length} Schritte`}</span>
      </button>

      {offen && (
        <ol className="mt-1 space-y-2">
          {steps.map((s, i) => (
            <li key={s.index} className="flex gap-3">
              <span className="tnum mt-0.5 w-5 shrink-0 text-[13px] text-faint">{i + 1}.</span>
              <span className="text-[15px] leading-snug">
                {textFor(s, method, params, steps.slice(0, i))}
                {s.warning && (
                  <span className="mt-0.5 block text-[13px] text-warn">{s.warning}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
