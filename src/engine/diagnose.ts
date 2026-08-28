/**
 * Diagnose-Engine — das Herzstück.
 *
 * Vier Stufen (Solution Design §6.2). Eine Stufe darf erst feuern, wenn alle
 * vorherigen leer sind. Ausgegeben wird GENAU EINE Korrektur.
 *
 * Aufteilung Code/Daten: Die Bedingungen stehen als Code hier, weil sich
 * Ausdrücke aus JSON nicht sicher auswerten lassen. Alles andere —
 * Erklärtexte, Schwellen, Technikschritte, Konfidenz — kommt aus
 * `data/diagnostics.json`. Fachliche Textänderungen brauchen keinen Codeeingriff.
 */
import type { BrewActual, Observation, Measurement, Tasting, Defect, Brew } from '@domain'
import { extractionYield, beverageMass, flowRate } from '@domain'
import type { EngineContext } from '@/domain'
import { daysOffRoast } from '@/domain'
import { getRule, lrrFor, TARGET_RANGES, HARD_LIMITS, tolerances, roastRuleFor } from '@/kb'
import { correctionFromTime, describeCorrection, cappedNote, timeIsTrustworthy } from './grinder'
import { restWindow } from './freshness'

export type Confidence = 'sicher' | 'wahrscheinlich' | 'Versuch'

export interface Suggestion {
  ruleId: string
  what: string
  why: string
  expectation: string
  confidence: Confidence
  alternative?: string
  variable: string
  direction: 'increase' | 'decrease' | 'adjust' | 'technique' | 'none'
  delta?: number
  /** Direkt anwendbarer neuer Wert, wenn berechenbar */
  newValue?: number
}

export interface Diagnosis {
  stage: 0 | 1 | 2 | 3
  blocked: boolean
  headline: string
  summary: string
  suggestions: Suggestion[]
  techniqueSteps?: string[]
  checklist?: string[]
  escalation?: string[]
  saveAsReference?: boolean
  /** Berechnete Kennzahlen zur Anzeige */
  metrics?: { ey?: number; tds?: number; flowRateGs?: number }
}

export interface DiagnoseInput {
  ctx: EngineContext
  actual: BrewActual
  observations?: Observation
  measurement?: Measurement
  tasting?: Tasting
  targetTimeS?: [number, number]
}

const CONF_MAP: Record<string, Confidence> = {
  high: 'sicher',
  medium: 'wahrscheinlich',
  low: 'Versuch',
}

function ruleText(id: string, fallback: string): string {
  return getRule(id)?.explanation ?? fallback
}
function ruleConf(id: string): Confidence {
  return CONF_MAP[getRule(id)?.confidence ?? 'medium'] ?? 'wahrscheinlich'
}
function has(d: Defect[] | undefined, ...want: Defect[]): boolean {
  if (!d) return false
  return want.every((w) => d.includes(w))
}
function hasAny(d: Defect[] | undefined, ...want: Defect[]): boolean {
  if (!d) return false
  return want.some((w) => d.includes(w))
}

function blocked(
  ruleId: string,
  headline: string,
  summary: string,
  extra: Partial<Diagnosis> = {},
): Diagnosis {
  const r = getRule(ruleId)
  return {
    stage: 0,
    blocked: true,
    headline,
    summary,
    suggestions: [],
    techniqueSteps: r?.techniqueSteps,
    checklist: r?.checklist,
    ...extra,
  }
}

/**
 * Jede Empfehlung braucht einen nächsten Schritt für den Fall, dass sie nicht
 * wirkt — sonst steht der Nutzer beim zweiten Versuch ohne Plan da.
 * Reihenfolge nach Wirkstärke (kb/03 §1): Mahlgrad → Ratio → Temperatur.
 */
function fallbackAlternative(
  primary: Suggestion,
  actual: BrewActual,
  defects: Defect[] | undefined,
  method: string,
): string {
  const tooMuch = hasAny(defects, 'bitter', 'astringent', 'harsh', 'ashy')
  const temp = actual.waterTempC ?? 93
  const ratio = actual.yieldG ? actual.yieldG / actual.doseG : actual.waterG ? actual.waterG / actual.doseG : 2

  if (primary.variable === 'grindSetting') {
    const t = tooMuch ? temp - 2 : temp + 2
    return `Falls das nicht hilft: Temperatur auf ${t} °C.`
  }
  if (primary.variable === 'waterTempC') {
    return method === 'aeropress'
      ? `Falls das nicht hilft: ${tooMuch ? 'gröber' : 'feiner'} mahlen.`
      : `Falls das nicht hilft: Verhältnis auf 1:${(ratio + (tooMuch ? -0.2 : 0.2)).toFixed(1)}.`
  }
  if (primary.variable === 'ratio') {
    return `Falls das nicht hilft: ${tooMuch ? 'gröber' : 'feiner'} mahlen.`
  }
  if (primary.variable === 'stirCount') {
    return `Falls das nicht hilft: Temperatur auf ${temp + 3} °C.`
  }
  return 'Falls das nicht hilft: eine Größe zurück und in halben Schritten weiter.'
}

// ── Schleifenerkennung (Briefing D, kb/14 §7) ─────────────────────────

interface LoopInfo {
  stuck: boolean
  oscillating: boolean
  direction?: 'finer' | 'coarser'
  lastTwoSettings?: [number, number]
}

export function detectLoop(history: Brew[]): LoopInfo {
  const withGrind = history
    .filter((b) => b.actual.grindSetting?.value !== undefined)
    .slice(0, 4)
  if (withGrind.length < 3) return { stuck: false, oscillating: false }

  const settings = withGrind.map((b) => b.actual.grindSetting!.value)
  const ratings = withGrind.map((b) => b.tasting?.rating ?? 0)
  const deltas: number[] = []
  for (let i = 0; i < settings.length - 1; i++) deltas.push(settings[i]! - settings[i + 1]!)

  const last3 = deltas.slice(0, 3).filter((d) => d !== 0)
  if (last3.length < 2) return { stuck: false, oscillating: false }

  const allFiner = last3.every((d) => d < 0)
  const allCoarser = last3.every((d) => d > 0)
  const improved = ratings[0]! > Math.max(...ratings.slice(1))

  if (last3.length >= 2 && !last3.every((d) => Math.sign(d) === Math.sign(last3[0]!))) {
    return {
      stuck: false,
      oscillating: true,
      lastTwoSettings: [settings[0]!, settings[1]!],
    }
  }
  if ((allFiner || allCoarser) && last3.length >= 3 && !improved) {
    return { stuck: true, oscillating: false, direction: allFiner ? 'finer' : 'coarser' }
  }
  return { stuck: false, oscillating: false }
}

// ── Hauptfunktion ─────────────────────────────────────────────────────

export function diagnose(input: DiagnoseInput): Diagnosis {
  const { ctx, actual, observations: obs, measurement: meas, tasting } = input
  const defects = tasting?.defects
  const method = ctx.method
  const isEspresso = method === 'espresso'

  // Kennzahlen
  const lrr = lrrFor(method, actual.inverted)
  const bevG =
    meas?.beverageMassG ??
    (isEspresso ? actual.yieldG : actual.waterG ? beverageMass(actual.waterG, actual.doseG, lrr) : undefined)
  const ey = meas && bevG ? extractionYield(meas.tdsPct, bevG, actual.doseG) : undefined
  const metrics = {
    ey: ey ? Math.round(ey * 10) / 10 : undefined,
    tds: meas?.tdsPct,
    flowRateGs:
      isEspresso && actual.yieldG ? Math.round(flowRate(actual.yieldG, actual.timeS) * 100) / 100 : undefined,
  }

  const targetT = input.targetTimeS
  const targetMid = targetT ? (targetT[0] + targetT[1]) / 2 : undefined
  const tol = tolerances(method)
  // Zielband plus Kurstoleranz — innerhalb davon gilt die Zeit als getroffen.
  const timeInTarget = targetMid !== undefined
    ? Math.abs(actual.timeS - targetMid) <= tol.timeS
    : true

  // ════ STUFE 0 — GATES ════════════════════════════════════════════════

  // D-05 Unplausible Messung
  if (ey !== undefined && (ey > (HARD_LIMITS.implausibleEyAbove as number) || ey < 12)) {
    return blocked(
      'D-05',
      'Messwert unplausibel',
      `${ey.toFixed(1)} % Extraktion liegt außerhalb des physikalisch Möglichen. ${ruleText('D-05', '')}`,
      { metrics },
    )
  }

  // D-01 Kanalbildung
  if (
    isEspresso &&
    (obs?.flowState === 'uneven' ||
      obs?.flowState === 'spritzing' ||
      obs?.puckState === 'crater' ||
      obs?.puckState === 'sideChannel')
  ) {
    return blocked(
      'D-01',
      'Kanalbildung — zuerst die Verteilung',
      ruleText(
        'D-01',
        'Ein Teil des Wassers hat den Kaffee umgangen. Die Zeit sagt deshalb nichts über deinen Mahlgrad aus.',
      ),
      { metrics },
    )
  }

  // D-02 Sauer UND bitter
  if (has(defects, 'sour', 'bitter') || has(defects, 'sour', 'astringent')) {
    const r = getRule('D-02')
    return blocked(
      'D-02',
      'Ungleichmäßige Extraktion',
      ruleText('D-02', 'Sauer und bitter gleichzeitig heißt: ein Teil zu viel, ein Teil zu wenig.'),
      { metrics, techniqueSteps: r?.techniqueByMethod?.[method] ?? r?.techniqueSteps },
    )
  }

  // D-03 / D-04 Frische
  const days = daysOffRoast(ctx.bag, ctx.today)
  if (days !== null) {
    const win = restWindow(method, ctx.bean.roastLevel, !!ctx.bean.isDecaf)
    if (days > 60) {
      return blocked(
        'D-04',
        'Bohne überaltert',
        `${days} Tage nach Röstung. Aromaverlust und oxidierte Fette lassen sich durch keine Einstellung reparieren.`,
        { metrics },
      )
    }
    if (days < win.min) {
      return blocked(
        'D-03',
        'Noch zu frisch',
        `Erst ${days} Tage nach Röstung. Bis Tag ${win.min} verdrängt das CO₂ das Wasser — die Ergebnisse sind nicht stabil. Warte noch ${win.min - days} Tag${win.min - days === 1 ? '' : 'e'}.`,
        { metrics },
      )
    }
  }

  // D-06 Wasserverdacht: Extraktion objektiv gut, schmeckt trotzdem flach
  if (
    ey !== undefined &&
    ey >= ctx.settings.targetEy[0] &&
    ey <= ctx.settings.targetEy[1] &&
    (tasting?.rating ?? 5) <= 2 &&
    hasAny(defects, 'flat') &&
    !hasAny(defects, 'sour', 'bitter')
  ) {
    return blocked(
      'D-06',
      'Das liegt vermutlich am Wasser',
      ruleText('D-06', 'Deine Extraktion ist korrekt, der Kaffee schmeckt trotzdem flach.'),
      { metrics },
    )
  }

  // D-07 Röstungsverdacht durch Schleifenerkennung
  const loop = detectLoop(ctx.beanHistory)
  if (loop.stuck && loop.direction === 'finer' && hasAny(defects, 'sour') && hasAny(defects, 'bitter')) {
    return blocked(
      'D-07',
      'Das ist die Röstung, nicht deine Einstellung',
      ruleText('D-07', ''),
      {
        metrics,
        escalation: [
          'Röstdatum und Röstgrad prüfen',
          'Mit weiterer Ratio und höherer Temperatur versuchen',
          'Bohne wechseln',
        ],
      },
    )
  }

  // ════ STUFE 1 — OBJEKTIV (nur mit Messung) ══════════════════════════

  if (ey !== undefined && meas) {
    const [eyMin, eyMax] = ctx.settings.targetEy
    const tdsRange = isEspresso
      ? (TARGET_RANGES.espressoClassic.tds as [number, number])
      : (TARGET_RANGES.goldenCup.tdsFilter as [number, number])
    const tdsLow = meas.tdsPct < tdsRange[0]
    const tdsHigh = meas.tdsPct > tdsRange[1]
    const eyLow = ey < eyMin
    const eyHigh = ey > eyMax

    if (!eyLow && !eyHigh && !tdsLow && !tdsHigh) {
      return {
        stage: 1,
        blocked: false,
        headline: 'Im Zielkorridor',
        summary: `Extraktion ${ey.toFixed(1)} % und Stärke ${meas.tdsPct.toFixed(2)} % liegen beide im Ziel. Als Referenz speichern?`,
        suggestions: [],
        saveAsReference: true,
        metrics,
      }
    }

    const sugg: Suggestion[] = []
    if (eyLow || eyHigh) {
      const dir = eyLow ? 'decrease' : 'increase'
      const corr =
        targetMid && timeIsTrustworthy(obs?.flowState)
          ? correctionFromTime(actual.timeS, targetMid, method, ctx.grinder, actual.grindSetting?.value)
          : null
      const what = corr
        ? describeCorrection(corr)
        : `${eyLow ? '2 Schritte feiner' : '2 Schritte gröber'}`
      sugg.push({
        ruleId: eyLow ? 'D-11' : 'D-17',
        what,
        why: `Deine Extraktion liegt bei ${ey.toFixed(1)} % — Ziel sind ${eyMin}–${eyMax} %.`,
        expectation: corr?.expectedTimeS
          ? `Erwartete Zeit danach: ${corr.expectedTimeS} s. Extraktion sollte Richtung ${((eyMin + eyMax) / 2).toFixed(0)} % gehen.`
          : `Die Extraktion sollte sich Richtung ${((eyMin + eyMax) / 2).toFixed(0)} % bewegen.`,
        confidence: 'sicher',
        variable: 'grindSetting',
        direction: dir,
        delta: corr?.steps ?? (eyLow ? -2 : 2),
        newValue:
          actual.grindSetting?.value !== undefined
            ? actual.grindSetting.value + (corr?.steps ?? (eyLow ? -2 : 2))
            : undefined,
      })
    }
    if (tdsLow || tdsHigh) {
      const delta = tdsLow ? -0.2 : 0.2
      const cur = actual.yieldG ? actual.yieldG / actual.doseG : actual.waterG! / actual.doseG
      sugg.push({
        ruleId: tdsLow ? 'D-13' : 'D-15',
        what: `Verhältnis auf 1:${(cur + delta).toFixed(1)} ${tdsLow ? 'enger' : 'weiter'}`,
        why: `Die Stärke liegt bei ${meas.tdsPct.toFixed(2)} % — Ziel sind ${tdsRange[0]}–${tdsRange[1]} %.`,
        expectation: `Das Getränk wird ${tdsLow ? 'dichter' : 'leichter'}, die Extraktion bleibt gleich.`,
        confidence: 'sicher',
        variable: 'ratio',
        direction: tdsLow ? 'decrease' : 'increase',
        delta,
        newValue: Math.round((cur + delta) * 10) / 10,
      })
    }
    return {
      stage: 1,
      blocked: false,
      headline: eyLow ? 'Unterextrahiert' : eyHigh ? 'Überextrahiert' : 'Stärke anpassen',
      summary: `Extraktion ${ey.toFixed(1)} %, Stärke ${meas.tdsPct.toFixed(2)} %.`,
      suggestions: sugg,
      metrics,
    }
  }

  // ════ STUFE 2 — SENSORISCH ═══════════════════════════════════════════

  const sugg: Suggestion[] = []
  // F-22 (√(t_ist/t_ziel)) ist Durchflussphysik und gilt nur für
  // Perkolation. Bei der AeroPress ist die Zeit GEWÄHLT, kein Ergebnis —
  // eine lange Gesamtzeit heißt dort nur, dass der Nutzer länger gewartet
  // hat, und darf nie in eine Mahlgradkorrektur übersetzt werden.
  const grindCorr =
    method !== 'aeropress' && targetMid && timeIsTrustworthy(obs?.flowState)
      ? correctionFromTime(actual.timeS, targetMid, method, ctx.grinder, actual.grindSetting?.value)
      : null

  const push = (s: Suggestion) => {
    if (!sugg.some((x) => x.variable === s.variable)) sugg.push(s)
  }
  const grindSuggestion = (
    ruleId: string,
    finer: boolean,
    why: string,
    fallbackSteps = 2,
  ): Suggestion => {
    const steps = grindCorr ? grindCorr.steps : finer ? -fallbackSteps : fallbackSteps
    const what = grindCorr
      ? describeCorrection(grindCorr)
      : `${fallbackSteps} Schritt${fallbackSteps === 1 ? '' : 'e'} ${finer ? 'feiner' : 'gröber'}`
    return {
      ruleId,
      what,
      why,
      expectation: [
        // Bei gedeckelter Korrektur wäre eine präzise Zeitprognose unehrlich —
        // wir gehen ja bewusst nicht den ganzen Weg.
        grindCorr?.capped
          ? `Der Shot wird deutlich langsamer, aber noch nicht am Ziel — ${finer ? 'weniger Säure' : 'weniger Bitterkeit'} sollte schon spürbar sein.`
          : grindCorr?.expectedTimeS
            ? `Erwartete Zeit danach: ${grindCorr.expectedTimeS} s. ${finer ? 'Weniger Säure, mehr Süße.' : 'Weniger Bitterkeit und Trockenheit.'}`
            : finer
              ? 'Der Kaffee sollte süßer und runder werden.'
              : 'Der Kaffee sollte klarer und weniger bitter werden.',
        grindCorr ? cappedNote(grindCorr) : undefined,
      ]
        .filter(Boolean)
        .join(' '),
      confidence: ruleConf(ruleId),
      variable: 'grindSetting',
      direction: finer ? 'decrease' : 'increase',
      delta: steps,
      newValue:
        actual.grindSetting?.value !== undefined ? actual.grindSetting.value + steps : undefined,
    }
  }

  // ── Espresso: Flusszustände zuerst ──
  if (isEspresso && (obs?.flowState === 'choked' || actual.timeS > 45)) {
    push(grindSuggestion('D-50', false, `Der Shot lief ${actual.timeS} s — das Bett ist deutlich zu dicht.`, 4))
  } else if (isEspresso && (obs?.flowState === 'gusher' || actual.timeS < 15)) {
    push(grindSuggestion('D-51', true, `Der Shot lief nur ${actual.timeS} s — viel zu wenig Widerstand.`, 4))
  }

  // ── Unterextraktion ──
  if (hasAny(defects, 'sour', 'salty', 'thin', 'shortFinish') && !hasAny(defects, 'bitter')) {
    const salty = has(defects, 'sour', 'salty')
    // AeroPress: Agitation vor Mahlgrad (D-26, kb/10 §5.2)
    if (method === 'aeropress') {
      push({
        ruleId: 'D-26',
        what: `Ein Rührvorgang mehr (${(actual.stirCount ?? 2) + 1}×)`,
        why: salty
          ? 'Salzig zusammen mit sauer ist das eindeutigste Zeichen für Unterextraktion.'
          : 'Der Kaffee ist unterextrahiert.',
        expectation: 'Rühren wirkt etwa wie 30–45 s mehr Ziehzeit — bei gleichmäßigerer Extraktion.',
        confidence: 'sicher',
        variable: 'stirCount',
        direction: 'increase',
        delta: 1,
        newValue: (actual.stirCount ?? 2) + 1,
      })
    } else if (!timeInTarget && grindCorr) {
      push(
        grindSuggestion(
          'D-22',
          true,
          `Der Shot lief ${actual.timeS} s statt ${targetT![0]}–${targetT![1]} s — zu wenig Kontakt.`,
        ),
      )
    } else if ((actual.waterTempC ?? 93) < 96) {
      push({
        ruleId: 'D-23',
        what: `Temperatur auf ${(actual.waterTempC ?? 93) + 2} °C`,
        why: salty
          ? 'Salzig und sauer ohne Süße heißt Unterextraktion — die Zeit stimmt aber schon.'
          : 'Die Zeit liegt im Ziel, es fehlt trotzdem Extraktion.',
        expectation: '+2 °C entsprechen etwa 0,5 Prozentpunkten mehr Extraktion. Mehr Süße, weniger Säure.',
        confidence: 'wahrscheinlich',
        variable: 'waterTempC',
        direction: 'increase',
        delta: 2,
        newValue: (actual.waterTempC ?? 93) + 2,
      })
    } else {
      push(grindSuggestion('D-20', true, 'Der Kaffee ist unterextrahiert.'))
    }
  }

  // ── Überextraktion ──
  if (hasAny(defects, 'bitter', 'astringent', 'harsh', 'ashy') && !hasAny(defects, 'sour')) {
    // AeroPress: Temperatur ist der stärkste Bitterkeitshebel (D-35)
    if (method === 'aeropress') {
      push({
        ruleId: 'D-35',
        what: `Temperatur auf ${(actual.waterTempC ?? 92) - 5} °C`,
        why: 'Bitterstoffe lösen sich stärker temperaturabhängig als Zucker und Säuren.',
        expectation: 'Weniger Bitterkeit bei gleicher Süße — die Extraktion wird selektiver, nicht nur geringer.',
        confidence: 'sicher',
        variable: 'waterTempC',
        direction: 'decrease',
        delta: -5,
        newValue: (actual.waterTempC ?? 92) - 5,
      })
    } else if (!timeInTarget && grindCorr) {
      push(
        grindSuggestion(
          'D-31',
          false,
          `Der Shot lief ${actual.timeS} s statt ${targetT![0]}–${targetT![1]} s — zu lange Kontaktzeit.`,
        ),
      )
    } else if ((ctx.bean.roastLevel === 'dark' || ctx.bean.roastLevel === 'medium-dark') && (actual.waterTempC ?? 93) > 88) {
      push({
        ruleId: 'D-36',
        what: `Temperatur auf ${(actual.waterTempC ?? 93) - 3} °C`,
        why: 'Dunkle Röstungen sind porös, extrahieren leicht und kippen schnell in die Bitterkeit.',
        expectation: 'Weniger Bitterkeit und Trockenheit im Abgang.',
        confidence: 'sicher',
        variable: 'waterTempC',
        direction: 'decrease',
        delta: -3,
        newValue: (actual.waterTempC ?? 93) - 3,
      })
    } else if ((actual.waterTempC ?? 93) > 90) {
      push({
        ruleId: 'D-32',
        what: `Temperatur auf ${(actual.waterTempC ?? 93) - 2} °C`,
        why: 'Die Zeit liegt im Ziel — dann ist die Temperatur der nächste Hebel.',
        expectation: 'Etwa 0,5 Prozentpunkte weniger Extraktion. Weniger Bitterkeit.',
        confidence: 'wahrscheinlich',
        variable: 'waterTempC',
        direction: 'decrease',
        delta: -2,
        newValue: (actual.waterTempC ?? 93) - 2,
      })
    } else {
      push(grindSuggestion('D-30', false, 'Der Kaffee ist überextrahiert.'))
    }
  }

  // ── Stärke ohne Extraktionsfehler ──
  if (hasAny(defects, 'thin') && !hasAny(defects, 'sour', 'bitter')) {
    const cur = actual.yieldG ? actual.yieldG / actual.doseG : actual.waterG! / actual.doseG
    const step = isEspresso ? 0.2 : 0.5
    push({
      ruleId: 'D-40',
      what: `Verhältnis auf 1:${(cur - step).toFixed(1)} enger`,
      why: 'Kein Extraktionsfehler — es ist schlicht zu wenig Kaffee pro Wasser.',
      expectation: 'Mehr Substanz und Körper, gleicher Geschmackscharakter.',
      confidence: 'sicher',
      variable: 'ratio',
      direction: 'decrease',
      delta: -step,
      newValue: Math.round((cur - step) * 10) / 10,
    })
  }

  // ── V60: Drawdown ──
  if (method === 'v60' && obs?.drawdownS && actual.timeS > 0) {
    const pct = (obs.drawdownS / actual.timeS) * 100
    if (pct > 45) {
      push(
        grindSuggestion(
          'D-60',
          false,
          `Der Drawdown dauerte ${obs.drawdownS} s — ${pct.toFixed(0)} % der Gesamtzeit. Das Bett setzt sich zu.`,
        ),
      )
    }
  }

  // ── Nichts gefunden ──
  if (sugg.length === 0) {
    const good = (tasting?.rating ?? 0) >= 4
    if (loop.oscillating && loop.lastTwoSettings) {
      const mid = Math.round((loop.lastTwoSettings[0] + loop.lastTwoSettings[1]) / 2)
      return {
        stage: 2,
        blocked: false,
        headline: 'Du kreist um das Optimum',
        summary: `Du bist zwischen ${loop.lastTwoSettings[1]} und ${loop.lastTwoSettings[0]} hin- und hergegangen. Du brauchst keine neue Richtung, sondern kleinere Schritte.`,
        suggestions: [
          {
            ruleId: 'loop-oscillation',
            what: `Mahlgrad ${mid} und ab jetzt in halben Schritten`,
            why: 'Das Optimum liegt zwischen deinen letzten beiden Einstellungen.',
            expectation: 'Ausgewogener als beide Vorgänger.',
            confidence: 'wahrscheinlich',
            variable: 'grindSetting',
            direction: 'adjust',
            newValue: mid,
          },
        ],
        metrics,
      }
    }
    return {
      stage: 3,
      blocked: false,
      headline: good ? 'Sitzt' : 'Keine klare Korrektur',
      summary: good
        ? 'Keine Fehler markiert und gut bewertet — als Referenz speichern?'
        : 'Aus deinen Angaben lässt sich keine eindeutige Richtung ableiten. Markier beim nächsten Mal, was konkret stört.',
      suggestions: [],
      saveAsReference: good,
      metrics,
    }
  }

  // ── Röstgradabhängige Lesart ──
  // Sie ändert die Reihenfolge der Kaskade und liefert die Begründung,
  // warum derselbe Fehler hier etwas anderes bedeutet als anderswo.
  const rr = roastRuleFor(ctx.bean.roastLevel, defects ?? [])

  // ── Kardinalregel: genau EINE Empfehlung ──
  // Reihenfolge: Mahlgrad → Ratio → Temperatur → Technik (kb/14 §6),
  // außer bei AeroPress, wo Agitation und Temperatur vorrücken.
  const order = rr
    ? // Röstgrad schlägt die Standardkaskade: bei dunkel+bitter zuerst die
      // Temperatur, bei dunkel+sauer zuerst die Technik.
      [...rr.order, 'grindSetting', 'ratio', 'waterTempC', 'stirCount', 'pourCount']
    : method === 'aeropress'
      ? ['stirCount', 'waterTempC', 'grindSetting', 'ratio', 'steepS']
      : ['grindSetting', 'ratio', 'waterTempC', 'stirCount', 'pourCount']
  const rank = (v: string) => {
    const i = order.indexOf(v)
    return i === -1 ? 99 : i
  }
  sugg.sort((a, b) => rank(a.variable) - rank(b.variable))

  const primary = sugg[0]!
  const secondary = sugg[1]
  primary.alternative = secondary
    ? `Falls das nicht hilft: ${secondary.what}.`
    : fallbackAlternative(primary, actual, defects, method)

  return {
    stage: 2,
    blocked: false,
    headline: headlineFor(primary, defects),
    summary: primary.why,
    suggestions: [primary],
    metrics,
  }
}

/**
 * Die Überschrift muss zur Empfehlung passen, nicht zu den Tags.
 * Sonst steht „Überextrahiert" über „feiner mahlen" — und der Nutzer glaubt
 * der App zu Recht nicht mehr.
 */
function headlineFor(s: Suggestion, defects: Defect[] | undefined): string {
  const finer = s.direction === 'decrease' && s.variable === 'grindSetting'
  const coarser = s.direction === 'increase' && s.variable === 'grindSetting'

  if (finer) return 'Zu wenig extrahiert'
  if (coarser) return 'Zu viel extrahiert'
  if (s.variable === 'ratio') return s.direction === 'decrease' ? 'Zu dünn' : 'Zu konzentriert'
  if (s.variable === 'waterTempC')
    return s.direction === 'decrease' ? 'Zu viel extrahiert' : 'Zu wenig extrahiert'
  if (s.variable === 'stirCount') return 'Zu wenig extrahiert'
  return hasAny(defects, 'bitter', 'astringent') ? 'Zu viel extrahiert' : 'Anpassung'
}
