/**
 * Typisierter Zugang zur Wissensbasis.
 *
 * Leitentscheidung E2 aus dem Solution Design: Fachwissen liegt in `data/*.json`,
 * NICHT im Code. Dieses Modul ist der einzige Ort, an dem die JSON-Dateien
 * gelesen werden — der Rest der App spricht nur mit den Funktionen hier unten.
 *
 * Fachliche Änderungen sind damit Datenänderungen, keine Codeänderungen.
 */
import methodsRaw from '@data/methods.json'
import variablesRaw from '@data/variables.json'
import diagnosticsRaw from '@data/diagnostics.json'
import originsRaw from '@data/origins.json'
import grindersRaw from '@data/grinders.json'
import glossaryRaw from '@data/glossary.json'
import formulasRaw from '@data/formulas.json'
import type { BrewMethod, RoastLevel, Process } from '@domain'

// ── Methoden ──────────────────────────────────────────────────────────

export interface MethodDefaults {
  doseG: number
  ratio: number
  timeS?: number
  waterTempC: number
  pressureBar?: number
  preinfusionS?: number
  bloomRatio?: number
  bloomTimeS?: number
  pourCount?: number
  steepS?: number
  stirCount?: number
  inverted?: boolean
}

export interface MethodProfile {
  id: BrewMethod
  label: string
  physics: string
  grindSensitivity: number
  timeSensitivity: number
  agitationRelevant: boolean
  channelingPossible: boolean
  lrr: number | null
  targetGrindMicron: [number, number]
  timeIsResult: boolean
  defaults: Record<RoastLevel, MethodDefaults>
  targetTimeByDose?: { doseG: number; timeS: [number, number]; grindOffset: number }[]
  basketDoseMap?: Record<string, { typical: [number, number]; max: number; areaCm2: number }>
  shotStyles?: Record<
    string,
    { ratio: [number, number]; grindOffset: number; note?: string; pressureBar?: number }
  >
  correctionOrder?: Record<string, string[]>
  recipeVariants?: RecipeVariant[]
  maxChamberWaterG?: number
}

export interface RecipeVariant {
  id: string
  label: string
  doseG: number
  waterG?: number
  waterTempC: number
  grindOffset?: number
  inverted?: boolean
  bypassG?: number
  warning?: string
  steps?: {
    index: number
    type: string
    startAtS?: number
    durationS?: number
    targetMassG?: number
    pourStyle?: string
    note?: string
  }[]
}

const methods = methodsRaw.methods as unknown as MethodProfile[]

export const METHODS = methods
export const METHOD_IDS = methods.map((m) => m.id)

export function getMethod(id: BrewMethod): MethodProfile {
  const m = methods.find((x) => x.id === id)
  if (!m) throw new Error(`Unbekannte Methode: ${id}`)
  return m
}

export function getMethodDefaults(id: BrewMethod, roast: RoastLevel): MethodDefaults {
  return getMethod(id).defaults[roast] ?? getMethod(id).defaults['medium']
}

/**
 * Zielzeit hängt beim V60 von der Dosis ab (kb/03 §2, Anti-Regel D-66).
 * Eine feste Zielzeit für alle Mengen ist der häufigste Fehler in V60-Apps.
 */
export function targetTimeRange(
  method: BrewMethod,
  doseG: number,
  roast: RoastLevel = 'medium',
): [number, number] | null {
  const m = getMethod(method)

  // V60: Die Zielzeit skaliert mit der Dosis. Eine feste Zeit für alle
  // Mengen ist der häufigste Fehler in V60-Apps (Anti-Regel D-66).
  if (m.targetTimeByDose?.length) {
    const table = m.targetTimeByDose
    let best = table[0]!
    for (const row of table) {
      if (Math.abs(row.doseG - doseG) < Math.abs(best.doseG - doseG)) best = row
    }
    return best.timeS
  }

  // Espresso / AeroPress: Zielzeit hängt am Röstgrad, nicht an der Dosis.
  const t = m.defaults[roast]?.timeS ?? m.defaults['medium']?.timeS
  if (t) return [Math.round(t - 2), Math.round(t + 2)]
  return null
}

/** Mahlgrad-Offset, wenn die Dosis stark vom Referenzpunkt abweicht */
export function doseGrindOffset(method: BrewMethod, doseG: number): number {
  const m = getMethod(method)
  if (!m.targetTimeByDose?.length) return 0
  let best = m.targetTimeByDose[0]!
  for (const row of m.targetTimeByDose) {
    if (Math.abs(row.doseG - doseG) < Math.abs(best.doseG - doseG)) best = row
  }
  return best.grindOffset
}

// ── Variablen ─────────────────────────────────────────────────────────

export interface VariableDef {
  id: string
  label: string
  unit: string
  type: string
  scope?: string[]
  ranges?: Record<string, [number, number]>
  defaults?: Record<string, number | string | boolean>
  step?: Record<string, number>
  sensitivity?: number
  priority?: number | null
  isControl?: boolean
  isResult?: boolean
  tooltip?: string
  target?: number | [number, number]
  acceptable?: [number, number]
  warnings?: { when: string; message: string; severity?: string }[]
  derivedFrom?: string
  formulaRef?: string
  overrunMap?: Record<string, number>
  options?: string[]
}

const variables = variablesRaw.variables as unknown as VariableDef[]
export const VARIABLES = variables

export function getVariable(id: string): VariableDef | undefined {
  return variables.find((v) => v.id === id)
}

export function variableRange(id: string, scope: string): [number, number] | null {
  const v = getVariable(id)
  return (v?.ranges?.[scope] as [number, number] | undefined) ?? null
}

export const ROUNDING = variablesRaw.displayRounding as Record<string, number | string>

// ── Diagnose-Regelwerk ────────────────────────────────────────────────

export interface RuleAction {
  variable: string
  direction: 'increase' | 'decrease' | 'adjust' | 'technique' | 'none'
  delta?: number
  formulaRef?: string
  fallbackDelta?: number
  targetValue?: number | string
  secondary?: { variable: string; direction: string; delta?: number }
  alternative?: { variable: string; direction: string; formulaRef?: string }
  alternativeForMethod?: Record<string, { variable: string; direction: string; formulaRef?: string }>
}

export interface DiagnosticRuleDef {
  id: string
  stage: 0 | 1 | 2
  priority: number
  scope?: string[]
  when: string
  cause?: string
  action: RuleAction
  explanation?: string
  techniqueSteps?: string[]
  techniqueByMethod?: Record<string, string[]>
  checklist?: string[]
  alternative?: string
  reference?: string
  blocks?: string[]
  confidence: 'high' | 'medium' | 'low'
  isAntiRule?: boolean
  overridesCascade?: boolean
  suggestSaveAsReference?: boolean
  precondition?: string
}

export const RULES = diagnosticsRaw.rules as unknown as DiagnosticRuleDef[]
export const ENGINE_META = diagnosticsRaw.engine
export const LOOP_DETECTION = diagnosticsRaw.loopDetection
export const PROHIBITIONS = diagnosticsRaw.prohibitions as string[]

export function getRule(id: string): DiagnosticRuleDef | undefined {
  return RULES.find((r) => r.id === id)
}

// ── Herkunft, Aufbereitung, Varietät ──────────────────────────────────

export interface OriginProfile {
  id: string
  name: string
  flag?: string
  continent?: string
  regions?: string[]
  altitudeMasl?: [number, number]
  varieties?: string[]
  commonProcesses?: string[]
  flavorProfile?: string[]
  acidityLevel?: number
  bodyLevel?: number
  sweetnessLevel?: number
  methodSuitability?: Record<string, number>
  modifiers?: { grindSteps?: number; waterTempC?: number; ratio?: number }
  notes?: string
  warnings?: string[]
  highAcidityWarning?: boolean
  grading?: string
}

export interface ProcessProfile {
  id: Process
  label: string
  profile?: string[]
  bodyModifier?: number
  acidityModifier?: number
  modifiers?: { grindSteps?: number; ratio?: number; waterTempC?: number }
  notes?: string
  forgiving?: boolean
  solubilityHigh?: boolean
}

export const ORIGINS = originsRaw.origins as unknown as OriginProfile[]
export const PROCESSES = originsRaw.processes as unknown as ProcessProfile[]
export const VARIETIES = originsRaw.varieties as unknown as {
  id: string
  name: string
  profile?: string[]
  modifiers?: Record<string, number>
  preferMethod?: string
  acidityExpectation?: string
  warnUser?: string
  isLandrace?: boolean
}[]

export function getOrigin(id: string): OriginProfile | undefined {
  return ORIGINS.find((o) => o.id === id || o.name === id)
}

export function getProcess(id: Process): ProcessProfile | undefined {
  return PROCESSES.find((p) => p.id === id)
}

export const ORIGIN_NAMES = ORIGINS.map((o) => o.name)

// ── Mühlen ────────────────────────────────────────────────────────────

export interface GrinderCatalogEntry {
  id: string
  name: string
  burrType: 'flat' | 'conical'
  scaleType: 'stepped' | 'stepless'
  clicksPerRotation?: number
  micronPerStep: number
  zeroPointOffsetMicron: number
  usableRange?: [number, number]
  dialRange?: [number, number]
  presets?: Record<string, [number, number]>
  confidence: 'measured' | 'vendor' | 'estimated'
  espressoCapable?: boolean
  isFallback?: boolean
  note?: string
}

export const GRINDER_CATALOG = grindersRaw.grinders as unknown as GrinderCatalogEntry[]
export const GRIND_TARGETS = grindersRaw.targetMicronByMethod as unknown as Record<string, [number, number]>
export const CALIBRATION = grindersRaw.selfCalibration
export const GRIND_TECHNIQUES = grindersRaw.techniques as {
  id: string
  name: string
  when: string
  instruction: string
  effect?: string[]
  downside?: string
  warning?: string
}[]

export function getGrinderCatalogEntry(id: string): GrinderCatalogEntry | undefined {
  return GRINDER_CATALOG.find((g) => g.id === id)
}

/** Referenz-Mahlgrad in µm für eine Methode (Mitte des Zielbereichs) */
export function referenceMicron(method: BrewMethod): number {
  const range = GRIND_TARGETS[method] ?? GRIND_TARGETS['v60']!
  return (range[0] + range[1]) / 2
}

// ── Glossar ───────────────────────────────────────────────────────────

export interface GlossaryTerm {
  id: string
  term: string
  level: 'basis' | 'advanced' | 'expert'
  unit?: string
  short: string
  long: string
  seeAlso?: string[]
  formulaRef?: string
  showWhen?: string[]
  warning?: string
  productNote?: string
  isOwnTerm?: boolean
}

export const GLOSSARY = glossaryRaw.terms as unknown as GlossaryTerm[]

export function getTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id)
}

export function termsForLevel(level: 'basis' | 'advanced' | 'expert'): GlossaryTerm[] {
  const order = { basis: 0, advanced: 1, expert: 2 }
  return GLOSSARY.filter((t) => order[t.level] <= order[level])
}

// ── Formeln (Zielkorridore und Grenzen) ───────────────────────────────

export const TARGET_RANGES = formulasRaw.targetRanges
export const HARD_LIMITS = formulasRaw.hardLimits
export const LRR_DEFAULTS = formulasRaw.defaults.lrr as Record<string, number>
export const FRESHNESS_PARAMS = (
  formulasRaw.formulas.find((f) => f.id === 'F-31') as unknown as {
    params: Record<BrewMethod, Record<RoastLevel, { tPeak: number; sigma: number }>>
  }
).params

/** LRR = Retentionswasser je Gramm Kaffee. Ohne diesen Term ist jede EY falsch. */
export function lrrFor(method: BrewMethod, inverted = false): number {
  if (method === 'v60') return LRR_DEFAULTS['v60_paper'] ?? 2.0
  if (method === 'aeropress')
    return inverted
      ? (LRR_DEFAULTS['aeropress_inverted'] ?? 1.6)
      : (LRR_DEFAULTS['aeropress_standard'] ?? 1.5)
  return 0
}
