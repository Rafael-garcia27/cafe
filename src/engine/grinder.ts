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
import { getGrinderCatalogEntry, referenceMicron } from '@/kb'

export function micronFor(setting: number, grinder?: Grinder): number | null {
  if (!grinder) return null
  return settingToMicron(setting, grinder)
}

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

  const micronDelta = currentMicron * (factor - 1)
  const hasSteps = !!grinder
  const steps = hasSteps ? stepsFromFactor(currentMicron, factor, grinder.micronPerStep) : 0
  // Wenn gerundet 0 Schritte herauskommen, wenigstens einen ganzen Schritt gehen.
  const finalSteps = hasSteps && steps === 0 ? (factor > 1 ? 1 : -1) : steps

  const newMicron = hasSteps
    ? currentMicron + finalSteps * grinder.micronPerStep
    : currentMicron + micronDelta

  return {
    steps: finalSteps,
    percent,
    micronDelta: hasSteps ? finalSteps * grinder.micronPerStep : micronDelta,
    expectedTimeS: Math.round(expectedTimeAfterGrindChange(actualTimeS, currentMicron, newMicron)),
    hasSteps,
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
