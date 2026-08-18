/**
 * Mühle: Skalenumrechnung, Korrektur aus Zeitabweichung, Selbstkalibrierung.
 *
 * Briefing C1: Ohne Mühlenkenntnis ist „wie stark verändern" nicht
 * beantwortbar. „12 % gröber" nützt niemandem — „3 Klicks" schon.
 */
import {
  grindScaleFactor,
  grindSteps as stepsFromFactor,
  expectedTimeAfterGrindChange,
  settingToMicron,
  canUseTimeForGrind,
} from '@domain'
import type { Grinder, BrewMethod, FlowState } from '@domain'
import { getGrinderCatalogEntry, referenceMicron, GRIND_TARGETS } from '@/kb'

export function micronFor(setting: number, grinder?: Grinder): number | null {
  if (!grinder) return null
  return settingToMicron(setting, grinder)
}

/**
 * Obergrenze je Durchgang. Wer 19 Klicks auf einmal springt, verlässt den
 * Bereich, in dem das Durchflussgesetz überhaupt gilt — und kann das Ergebnis
 * nicht mehr zuordnen. Lieber zwei kontrollierte Runden als ein Sprung.
 */
export const MAX_STEPS_PER_ROUND = 5

export interface GrindCorrection {
  /** Schritte auf der Mühlenskala. Negativ = feiner. */
  steps: number
  /** Relative Änderung der Partikelgröße in Prozent */
  percent: number
  micronDelta: number | null
  /** Überprüfbare Vorhersage (Solution Design §6.2) */
  expectedTimeS: number | null
  /** Wenn keine Mühle kalibriert ist, gibt es nur Prozent statt Klicks */
  hasSteps: boolean
  /** true, wenn die volle Korrektur gedeckelt wurde und eine zweite Runde folgt */
  capped: boolean
  fullSteps: number
  math: string
}

/**
 * Kernfunktion: Aus Ist- und Zielzeit die Mahlgradkorrektur berechnen.
 *
 * Grundlage ist das Durchflussgesetz (Darcy + Kozeny-Carman, kb/02 F-22):
 * Der Durchfluss skaliert mit dem Quadrat der Partikelgröße, also
 *   d_neu / d_alt = sqrt(t_alt / t_neu)
 */
export function correctionFromTime(
  actualTimeS: number,
  targetTimeS: number,
  method: BrewMethod,
  grinder?: Grinder,
  currentSetting?: number,
): GrindCorrection | null {
  if (actualTimeS <= 0 || targetTimeS <= 0) return null

  const factor = grindScaleFactor(actualTimeS, targetTimeS)
  const percent = (factor - 1) * 100
  // Unter 4 % ist die Änderung kleiner als die Streuung der Zubereitung.
  if (Math.abs(percent) < 4) return null

  const currentMicron =
    grinder && currentSetting !== undefined
      ? settingToMicron(currentSetting, grinder)
      : referenceMicron(method)

  const hasSteps = !!grinder
  const raw = hasSteps ? stepsFromFactor(currentMicron, factor, grinder.micronPerStep) : 0
  // Gerundet 0 Schritte wäre kein Vorschlag — wenigstens einen ganzen gehen.
  const fullSteps = hasSteps && raw === 0 ? (factor > 1 ? 1 : -1) : raw
  const finalSteps = hasSteps
    ? Math.max(-MAX_STEPS_PER_ROUND, Math.min(MAX_STEPS_PER_ROUND, fullSteps))
    : 0
  const capped = hasSteps && Math.abs(fullSteps) > MAX_STEPS_PER_ROUND

  // Auch die Prozentangabe deckeln, wenn keine Mühle bekannt ist.
  const cappedPercent = hasSteps ? percent : Math.max(-35, Math.min(35, percent))

  const newMicron = hasSteps
    ? currentMicron + finalSteps * grinder.micronPerStep
    : currentMicron * (1 + cappedPercent / 100)

  return {
    steps: finalSteps,
    percent: cappedPercent,
    micronDelta: hasSteps ? finalSteps * grinder.micronPerStep : newMicron - currentMicron,
    expectedTimeS: Math.round(expectedTimeAfterGrindChange(actualTimeS, currentMicron, newMicron)),
    hasSteps,
    capped: capped || (!hasSteps && Math.abs(percent) > 35),
    fullSteps,
    math: `√(${actualTimeS}/${targetTimeS}) = ${factor.toFixed(3)} → ${percent > 0 ? '+' : ''}${percent.toFixed(0)} %`,
  }
}

/** Formulierung für die Empfehlung */
export function describeCorrection(c: GrindCorrection): string {
  const richtung = c.steps > 0 || c.percent > 0 ? 'gröber' : 'feiner'
  if (c.hasSteps) {
    const n = Math.abs(c.steps)
    const um = c.micronDelta ? ` (≈ ${c.micronDelta > 0 ? '+' : ''}${Math.round(c.micronDelta)} µm)` : ''
    return `${n} Klick${n === 1 ? '' : 's'} ${richtung}${um}`
  }
  return `${Math.abs(c.percent).toFixed(0)} % ${richtung}`
}

/** Zusatz, wenn die volle Korrektur zu groß für einen Durchgang war */
export function cappedNote(c: GrindCorrection): string | undefined {
  if (!c.capped) return undefined
  if (c.hasSteps) {
    return `Rechnerisch wären ${Math.abs(c.fullSteps)} Klicks nötig. So große Sprünge lassen sich nicht mehr zuordnen — geh erst diese ${Math.abs(c.steps)}, dann sehen wir weiter.`
  }
  return 'Die rechnerische Korrektur ist sehr groß — geh sie in zwei Runden an.'
}

/**
 * Sperre aus Briefing C3: Bei Kanalbildung ist die gemessene Zeit
 * physikalisch bedeutungslos — ein Teil des Wassers ist gar nicht durch den
 * Kaffee gelaufen. Jede Mahlgradempfehlung wäre geraten.
 */
export function timeIsTrustworthy(flow?: FlowState): boolean {
  return canUseTimeForGrind(flow)
}

// ── Selbstkalibrierung (kb/07 §5.3) ───────────────────────────────────

export interface CalibrationInput {
  time1S: number
  setting1: number
  time2S: number
  setting2: number
  method: BrewMethod
}

export interface CalibrationResult {
  micronPerStep: number
  factor: number
  stepDelta: number
  confidence: 'measured'
  explanation: string
}

export function calibrate(input: CalibrationInput): CalibrationResult | { error: string } {
  const stepDelta = input.setting2 - input.setting1
  if (stepDelta === 0) return { error: 'Die beiden Einstellungen sind identisch.' }
  if (input.time1S <= 0 || input.time2S <= 0) return { error: 'Beide Zeiten müssen größer als 0 sein.' }
  if (input.time1S === input.time2S)
    return { error: 'Beide Shots liefen gleich lang — daraus lässt sich nichts ableiten.' }

  // Der gröber gestellte Shot muss der schnellere sein, sonst stimmt die
  // Zuordnung nicht (oder es lag Kanalbildung vor).
  const coarserIsFaster = stepDelta > 0 ? input.time2S < input.time1S : input.time1S < input.time2S
  if (!coarserIsFaster)
    return {
      error:
        'Der gröber eingestellte Shot lief nicht schneller. Sehr wahrscheinlich lag Kanalbildung vor — bitte beide Shots wiederholen.',
    }

  const factor = grindScaleFactor(input.time1S, input.time2S)
  const ref = referenceMicron(input.method)
  const micronPerStep = Math.abs((ref * (factor - 1)) / stepDelta)

  if (micronPerStep < 2 || micronPerStep > 120)
    return {
      error: `Ergebnis unplausibel (${micronPerStep.toFixed(1)} µm/Schritt). Prüf, ob beide Shots mit identischer Dosis und ohne Kanalbildung liefen.`,
    }

  return {
    micronPerStep: Math.round(micronPerStep * 10) / 10,
    factor,
    stepDelta,
    confidence: 'measured',
    explanation:
      `${Math.abs(stepDelta)} Schritte haben die Zeit von ${input.time1S} s auf ${input.time2S} s verändert. ` +
      `Das entspricht ${((factor - 1) * 100).toFixed(1)} % Partikelgröße, ` +
      `also ${(micronPerStep).toFixed(1)} µm pro Schritt.`,
  }
}

/** Neue Mühle aus dem Katalog anlegen */
export function grinderFromCatalog(catalogId: string, id: string): Grinder | null {
  const e = getGrinderCatalogEntry(catalogId)
  if (!e) return null
  return {
    id,
    name: e.name,
    burrType: e.burrType,
    scaleType: e.scaleType,
    clicksPerRotation: e.clicksPerRotation,
    micronPerStep: e.micronPerStep,
    zeroPointOffsetMicron: e.zeroPointOffsetMicron,
    usableRange: e.usableRange ?? e.dialRange,
    confidence: e.confidence,
  }
}

/** Startwert für den Mahlgrad einer Methode auf einer konkreten Mühle */
export function suggestedSetting(grinder: Grinder | undefined, method: BrewMethod): number | null {
  if (!grinder) return null
  const target = referenceMicron(method)
  const raw = (target - grinder.zeroPointOffsetMicron) / grinder.micronPerStep
  return Math.max(0, Math.round(raw))
}

// ── Plausibilitätsprüfung (Übernahme aus barista-pwa, docs/03 §2.4) ───

/**
 * Meldet, wenn die eingetragene Einstellung für die Methode weit außerhalb
 * des Sinnvollen liegt. Mühlenunabhängig, weil in Mikrometern gerechnet.
 */
export function grindPlausibility(
  setting: number,
  method: BrewMethod,
  grinder?: Grinder,
): { ok: boolean; message?: string; suggestion?: number } {
  if (!grinder) return { ok: true }
  const micron = settingToMicron(setting, grinder)
  const [lo, hi] = GRIND_TARGETS[method] ?? [200, 900]
  const tol = 0.45 // 45 % Toleranz — Mahlwerke streuen erheblich

  if (micron < lo * (1 - tol)) {
    return {
      ok: false,
      message: `Einstellung ${setting} entspricht ~${Math.round(micron)} µm — sehr fein für ${method === 'v60' ? 'Filter' : method === 'espresso' ? 'Espresso' : 'AeroPress'} (üblich ${lo}–${hi} µm).`,
      suggestion: suggestedSetting(grinder, method) ?? undefined,
    }
  }
  if (micron > hi * (1 + tol)) {
    return {
      ok: false,
      message: `Einstellung ${setting} entspricht ~${Math.round(micron)} µm — sehr grob (üblich ${lo}–${hi} µm).`,
      suggestion: suggestedSetting(grinder, method) ?? undefined,
    }
  }
  return { ok: true }
}

/**
 * Anzeige der Mühlenskala (Übernahme docs/03 §2.5): viele Mühlen tragen die
 * Zahl als Dezimalwert auf dem Rädchen — 24 Klicks lesen sich dort als „2.4".
 */
export function formatSetting(setting: number, grinder?: Grinder): string {
  if (!grinder) return String(setting)
  if (grinder.scaleType === 'stepless') return setting.toFixed(1)
  const rev = grinder.clicksPerRotation
  if (rev && rev >= 10) {
    const turns = Math.floor(setting / rev)
    const rest = setting % rev
    if (turns > 0) return `${setting} (${turns}×${rev} + ${rest})`
  }
  return String(setting)
}
