/**
 * Frische: Ruhefenster, Score und die Frische-Drift.
 *
 * Briefing C4: Die Frische ändert sich täglich, ohne dass jemand etwas tut.
 * Ohne Korrektur wandert jedes gespeicherte Rezept mit der Zeit aus dem
 * Fenster — und der Nutzer sucht den Fehler bei sich.
 */
import formulas from '@data/formulas.json'
import { freshnessScore as gaussScore, ageGrindDrift } from '@domain'
import type { BrewMethod, RoastLevel, Bag, Process } from '@domain'
import { daysOffRoast, daysSince } from '@/domain'

type RestTable = Record<BrewMethod, Record<RoastLevel, [number, number]>>

const REST: RestTable = formulas.restWindows as unknown as RestTable
const DECAF_FACTOR = formulas.restWindows.decafFactor as number
const STALE_AFTER = formulas.restWindows.staleAfterDays as number
const PROCESS_OFFSET = formulas.restWindows.processOffsetDays as unknown as Record<string, number>
const FRESHNESS_PARAMS = (
  formulas.formulas.find((f) => f.id === 'F-31') as unknown as {
    params: Record<BrewMethod, Record<RoastLevel, { tPeak: number; sigma: number }>>
  }
).params

export interface RestWindow {
  min: number
  max: number
}

/**
 * Ruhefenster in Tagen nach Röstung.
 *
 * Decaf altert schneller (kb/05 §6). Die Aufbereitung verschiebt das Fenster
 * zusätzlich: Naturals gasen schneller aus und sind früher trinkreif als
 * Washed — Übernahme aus der alten PWA (docs/03 §2.2).
 */
export function restWindow(
  method: BrewMethod,
  roast: RoastLevel,
  isDecaf = false,
  process?: Process,
): RestWindow {
  const [min, max] = REST[method]?.[roast] ?? [5, 21]
  const f = isDecaf ? DECAF_FACTOR : 1
  const off = process ? (PROCESS_OFFSET[process] ?? 0) : 0
  return {
    min: Math.max(1, Math.round(min * f + off)),
    max: Math.max(2, Math.round(max * f + off)),
  }
}

export type FreshnessState =
  | 'unknown'
  | 'too-fresh'
  | 'approaching'
  | 'peak'
  | 'past-peak'
  | 'stale'

export interface Freshness {
  state: FreshnessState
  days: number | null
  score: number
  window: RestWindow
  label: string
  hint?: string
}

export function assessFreshness(
  bag: Bag | undefined,
  method: BrewMethod,
  roast: RoastLevel,
  isDecaf: boolean,
  today: Date,
  process?: Process,
): Freshness {
  const win = restWindow(method, roast, isDecaf, process)
  const days = daysOffRoast(bag, today)

  if (days === null) {
    return {
      state: 'unknown',
      days: null,
      score: 50,
      window: win,
      label: 'Röstdatum unbekannt',
      hint: 'Trag das Röstdatum ein — dann kann ich den Mahlgrad mit dem Alter mitführen.',
    }
  }

  const p = FRESHNESS_PARAMS[method]?.[roast] ?? { tPeak: 10, sigma: 7 }
  const openedDays = daysSince(bag?.openedDate, today) ?? 0
  const score = Math.round(gaussScore(days, p.tPeak, p.sigma, openedDays))

  let state: FreshnessState
  let label: string
  let hint: string | undefined

  if (days >= STALE_AFTER) {
    state = 'stale'
    label = `${days} Tage — überaltert`
    hint = 'Aromaverlust lässt sich durch keine Einstellung reparieren. Neue Tüte.'
  } else if (days < win.min) {
    state = 'too-fresh'
    label = `${days} Tage — noch zu frisch`
    hint = `Das CO₂ stört noch. Ab Tag ${win.min} sind die Ergebnisse stabil.`
  } else if (days <= win.min + 2) {
    state = 'approaching'
    label = `${days} Tage — wird gerade gut`
  } else if (days <= win.max) {
    state = 'peak'
    label = `${days} Tage — im Fenster`
  } else {
    state = 'past-peak'
    label = `${days} Tage — über dem Optimum`
    hint = 'Etwas feiner mahlen, das Bett bietet weniger Widerstand.'
  }

  return { state, days, score, window: win, label, hint }
}

/**
 * Frische-Drift: Wie viele Mahlschritte muss ein gespeicherter Referenz-Shot
 * korrigiert werden, weil die Bohne inzwischen älter ist?
 *
 * Negativ = feiner. Nur Espresso — beim Filter ist der Effekt sensorisch,
 * nicht hydraulisch (kb/02 F-32).
 */
export function driftCorrection(
  method: BrewMethod,
  refDaysOffRoast: number | null,
  nowDaysOffRoast: number | null,
): { steps: number; drift: number; reason?: string } {
  if (method !== 'espresso' || refDaysOffRoast === null || nowDaysOffRoast === null) {
    return { steps: 0, drift: 0 }
  }
  const drift = nowDaysOffRoast - refDaysOffRoast
  if (Math.abs(drift) < 6) return { steps: 0, drift }

  const steps = Math.round(ageGrindDrift(nowDaysOffRoast, refDaysOffRoast))
  if (steps === 0) return { steps: 0, drift }

  const richtung = steps < 0 ? 'feiner' : 'gröber'
  const alter = drift > 0 ? 'älter' : 'jünger'
  return {
    steps,
    drift,
    reason: `Die Bohne ist ${Math.abs(drift)} Tage ${alter} als bei deinem Referenz-Shot — ${Math.abs(steps)} Klick${Math.abs(steps) === 1 ? '' : 's'} ${richtung}.`,
  }
}
