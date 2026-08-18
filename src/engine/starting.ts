/**
 * Startpunkt-Engine.
 *
 * Briefing A5/A7: Das Kaffeeprofil fließt IMMER ein, und der Nutzer sieht,
 * woher der Vorschlag kommt. Ohne sichtbare Begründung entsteht kein
 * Vertrauen — und ohne Vertrauen folgt niemand einer Empfehlung.
 */
import formulas from '@data/formulas.json'
import type { BrewMethod, Brew, Bean, RoastLevel } from '@domain'
import { targetYield } from '@domain'
import type { EngineContext } from '@/domain'
import { beanKey, daysOffRoast } from '@/domain'
import { getMethodDefaults, targetTimeRange, doseGrindOffset, getProcess, getOrigin } from '@/kb'
import { assessFreshness, driftCorrection } from './freshness'
import { suggestedSetting } from './grinder'
import { LEARN_THRESHOLDS } from '@/config'

type Mods = { grindSteps?: number; waterTempC?: number; ratio?: number }
const ROAST_MODS = formulas.roastModifiers as unknown as Record<RoastLevel, Mods>
const BEAN_MODS = formulas.beanModifiers as unknown as Record<string, Mods>

export type StartingSource = 'personal' | 'transfer' | 'roaster' | 'default'

export interface Proposal {
  method: BrewMethod
  doseG: number
  ratio: number
  yieldG: number
  waterG?: number
  waterTempC: number
  grindSetting?: number
  targetTimeS?: [number, number]
  bloomWaterG?: number
  bloomTimeS?: number
  pourCount?: number
  steepS?: number
  stirCount?: number
  inverted?: boolean
}

export interface RationaleLine {
  text: string
  kind: 'source' | 'modifier' | 'warning' | 'learning'
}

export interface StartingPoint {
  proposal: Proposal
  source: StartingSource
  headline: string
  rationale: RationaleLine[]
  warning?: string
  /** Wie viele gute Brews noch fehlen, bis personalisiert wird */
  brewsUntilPersonal?: number
}

// ── Ähnlichkeit zwischen Bohnen (Solution Design §6.1) ────────────────

const ROAST_ORDER: RoastLevel[] = ['light', 'medium-light', 'medium', 'medium-dark', 'dark']

function roastDistance(a: RoastLevel, b: RoastLevel): number {
  return Math.abs(ROAST_ORDER.indexOf(a) - ROAST_ORDER.indexOf(b))
}

function processFamily(p: string): string {
  if (p.startsWith('honey')) return 'honey'
  if (p === 'anaerobic' || p === 'carbonic-maceration') return 'fermented'
  return p
}

export function similarity(a: Bean, b: Bean): number {
  let s = 0
  const rd = roastDistance(a.roastLevel, b.roastLevel)
  s += rd === 0 ? 3 : rd === 1 ? 1.5 : 0
  if (a.process === b.process) s += 2
  else if (processFamily(a.process) === processFamily(b.process)) s += 1

  const ac = new Set(a.origins.map((o) => o.country))
  if (b.origins.some((o) => ac.has(o.country))) s += 2

  if (a.altitudeMasl && b.altitudeMasl) {
    const am = (a.altitudeMasl[0] + a.altitudeMasl[1]) / 2
    const bm = (b.altitudeMasl[0] + b.altitudeMasl[1]) / 2
    if (Math.abs(am - bm) < 300) s += 1
  }
  if (a.densityGL && b.densityGL && Math.abs(a.densityGL - b.densityGL) < 30) s += 1
  if (!!a.isDecaf === !!b.isDecaf) s += 0.5
  return s
}

// ── Modifikatoren ─────────────────────────────────────────────────────

function applyBeanModifiers(
  base: Proposal,
  bean: Bean,
  ctx: EngineContext,
  lines: RationaleLine[],
): Proposal {
  const p = { ...base }
  let grindSteps = 0

  const rm = ROAST_MODS[bean.roastLevel] ?? {}
  if (rm.grindSteps) grindSteps += rm.grindSteps
  if (rm.waterTempC) p.waterTempC += rm.waterTempC
  if (rm.ratio) p.ratio += rm.ratio

  const alt = bean.altitudeMasl ? (bean.altitudeMasl[0] + bean.altitudeMasl[1]) / 2 : null
  if (alt !== null && alt > 1800) {
    const m = BEAN_MODS['altitudeAbove1800']!
    grindSteps += m.grindSteps ?? 0
    p.waterTempC += m.waterTempC ?? 0
    lines.push({
      text: `Über 1800 m gewachsen — dichtere Bohne, etwas feiner und heißer.`,
      kind: 'modifier',
    })
  }
  if (bean.densityGL && bean.densityGL > 400) {
    grindSteps += BEAN_MODS['densityAbove400']!.grindSteps ?? 0
    lines.push({ text: `Hohe Dichte (${bean.densityGL} g/L) — einen Schritt feiner.`, kind: 'modifier' })
  }

  const proc = getProcess(bean.process)
  if (proc?.modifiers?.grindSteps) {
    grindSteps += proc.modifiers.grindSteps
    lines.push({
      text: `${proc.label} löst sich leichter — etwas gröber.`,
      kind: 'modifier',
    })
  }
  if (proc?.modifiers?.waterTempC) p.waterTempC += proc.modifiers.waterTempC
  if (proc?.modifiers?.ratio) p.ratio += proc.modifiers.ratio

  if (bean.isDecaf) {
    const m = BEAN_MODS['decaf']!
    grindSteps += m.grindSteps ?? 0
    p.waterTempC += m.waterTempC ?? 0
    lines.push({
      text: `Entkoffeiniert — die Struktur ist poröser, deshalb gröber und kühler.`,
      kind: 'modifier',
    })
  }
  if (ctx.bag?.storage === 'frozen') {
    grindSteps += BEAN_MODS['frozen']!.grindSteps ?? 0
    lines.push({
      text: `Gefroren gemahlen — engere Partikelverteilung, deshalb gröber starten.`,
      kind: 'modifier',
    })
  }

  const origin = bean.origins[0] ? getOrigin(bean.origins[0].country) : undefined
  if (origin?.modifiers) {
    grindSteps += origin.modifiers.grindSteps ?? 0
    p.waterTempC += origin.modifiers.waterTempC ?? 0
    p.ratio += origin.modifiers.ratio ?? 0
  }

  grindSteps += doseGrindOffset(ctx.method, p.doseG)

  if (p.grindSetting !== undefined) {
    p.grindSetting = Math.max(0, Math.round(p.grindSetting + grindSteps))
  }
  p.waterTempC = Math.round(Math.min(100, Math.max(70, p.waterTempC)))
  p.ratio = Math.round(p.ratio * 10) / 10
  p.yieldG = Math.round(targetYield(p.doseG, p.ratio) * 10) / 10
  if (ctx.method !== 'espresso') p.waterG = Math.round(p.doseG * p.ratio)
  return p
}

function applyPreferenceBias(p: Proposal, ctx: EngineContext, lines: RationaleLine[]): Proposal {
  const pref = ctx.learned.preference[ctx.method]
  if (!pref || pref.sampleSize < LEARN_THRESHOLDS.bias) return p
  const out = { ...p }
  if (pref.ratioBias) out.ratio = Math.round((out.ratio + pref.ratioBias) * 10) / 10
  if (pref.tempBiasC) out.waterTempC = Math.round(out.waterTempC + pref.tempBiasC)
  if (pref.grindBiasSteps && out.grindSetting !== undefined)
    out.grindSetting = Math.max(0, Math.round(out.grindSetting + pref.grindBiasSteps))
  out.yieldG = Math.round(targetYield(out.doseG, out.ratio) * 10) / 10
  if (ctx.method !== 'espresso') out.waterG = Math.round(out.doseG * out.ratio)
  lines.push({
    text: pref.statement ?? 'An deine bisherigen Bewertungen angepasst.',
    kind: 'learning',
  })
  return out
}

// ── Basisvorschlag aus der Methode ────────────────────────────────────

function methodBase(ctx: EngineContext): Proposal {
  const d = getMethodDefaults(ctx.method, ctx.bean.roastLevel)
  const grind = suggestedSetting(ctx.grinder, ctx.method) ?? undefined
  const p: Proposal = {
    method: ctx.method,
    doseG: d.doseG,
    ratio: d.ratio,
    yieldG: Math.round(targetYield(d.doseG, d.ratio) * 10) / 10,
    waterTempC: d.waterTempC,
    grindSetting: grind,
    bloomWaterG: d.bloomRatio ? Math.round(d.doseG * d.bloomRatio) : undefined,
    bloomTimeS: d.bloomTimeS,
    pourCount: d.pourCount,
    steepS: d.steepS,
    stirCount: d.stirCount,
    inverted: d.inverted,
  }
  if (ctx.method !== 'espresso') p.waterG = Math.round(d.doseG * d.ratio)
  p.targetTimeS = targetTimeRange(ctx.method, d.doseG, ctx.bean.roastLevel) ?? undefined
  return p
}

function proposalFromBrew(b: Brew, ctx: EngineContext): Proposal {
  const a = b.actual
  const ratio = a.yieldG ? a.yieldG / a.doseG : a.waterG ? a.waterG / a.doseG : 2
  return {
    method: ctx.method,
    doseG: a.doseG,
    ratio: Math.round(ratio * 10) / 10,
    yieldG: a.yieldG ?? Math.round(a.doseG * ratio * 10) / 10,
    waterG: a.waterG,
    waterTempC: a.waterTempC ?? getMethodDefaults(ctx.method, ctx.bean.roastLevel).waterTempC,
    grindSetting: a.grindSetting?.value,
    targetTimeS:
      targetTimeRange(ctx.method, a.doseG, ctx.bean.roastLevel) ??
      [Math.round(b.actual.timeS * 0.93), Math.round(b.actual.timeS * 1.07)],
    stirCount: a.stirCount,
    pourCount: a.pourCount,
    inverted: a.inverted,
  }
}

// ── Hauptfunktion ─────────────────────────────────────────────────────

export function startingPoint(ctx: EngineContext): StartingPoint {
  const lines: RationaleLine[] = []
  const fresh = assessFreshness(
    ctx.bag,
    ctx.method,
    ctx.bean.roastLevel,
    !!ctx.bean.isDecaf,
    ctx.today,
  )
  const nowDays = daysOffRoast(ctx.bag, ctx.today)

  // 1 — Eigene Referenz für genau diese Bohne
  const own = ctx.beanHistory
    .filter((b) => (b.tasting?.rating ?? 0) >= 4)
    .sort((a, b) => (b.tasting!.rating - a.tasting!.rating) || (b.createdAt > a.createdAt ? 1 : -1))

  if (own.length > 0) {
    const ref = own[0]!
    let p = proposalFromBrew(ref, ctx)
    const refDate = new Date(ref.createdAt).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
    })
    lines.push({
      text: `Aus deinem besten Shot vom ${refDate} (${ref.tasting!.rating}★).`,
      kind: 'source',
    })

    const learned = ctx.learned.perBean[beanKey(ctx.bean.id, ctx.method)]
    const drift = driftCorrection(ctx.method, learned?.refDaysOffRoast ?? null, nowDays)
    if (drift.steps !== 0 && p.grindSetting !== undefined) {
      p = { ...p, grindSetting: Math.max(0, p.grindSetting + drift.steps) }
      lines.push({ text: drift.reason!, kind: 'modifier' })
    }

    if (fresh.hint) lines.push({ text: fresh.hint, kind: 'warning' })

    return {
      proposal: p,
      source: 'personal',
      headline: 'Dein Referenzpunkt',
      rationale: lines,
      warning: fresh.state === 'too-fresh' || fresh.state === 'stale' ? fresh.label : undefined,
    }
  }

  // 2 — Transfer von einer ähnlichen Bohne
  const candidates = ctx.methodHistory
    .filter((b) => (b.tasting?.rating ?? 0) >= 4 && b.beanId !== ctx.bean.id)
    .map((b) => ({ brew: b, bean: b.beanId }))

  const scored: { brew: Brew; score: number; bean: Bean }[] = []
  for (const c of candidates) {
    const other = ctx.allBeans?.find((x) => x.id === c.bean)
    if (!other) continue
    const s = similarity(ctx.bean, other)
    if (s >= 5) scored.push({ brew: c.brew, score: s, bean: other })
  }
  scored.sort((a, b) => b.score - a.score)

  if (scored.length > 0) {
    const best = scored[0]!
    let p = proposalFromBrew(best.brew, ctx)
    lines.push({
      text: `Übertragen von „${best.bean.name}" — ähnlicher Röstgrad und ähnliche Aufbereitung.`,
      kind: 'source',
    })
    p = applyBeanModifiers({ ...p, grindSetting: p.grindSetting }, ctx.bean, ctx, lines)
    if (fresh.hint) lines.push({ text: fresh.hint, kind: 'warning' })
    return {
      proposal: p,
      source: 'transfer',
      headline: 'Von einer ähnlichen Bohne',
      rationale: lines,
      warning: fresh.state === 'too-fresh' ? fresh.label : undefined,
      brewsUntilPersonal: LEARN_THRESHOLDS.perBean,
    }
  }

  // 3/4 — Methodendefault, angereichert mit Bohnenprofil
  let p = methodBase(ctx)
  lines.push({
    text: `Standard für ${ctx.bean.roastLevel === 'light' ? 'helle' : ctx.bean.roastLevel === 'dark' ? 'dunkle' : 'mittlere'} Röstung.`,
    kind: 'source',
  })
  p = applyBeanModifiers(p, ctx.bean, ctx, lines)
  p = applyPreferenceBias(p, ctx, lines)
  if (fresh.hint) lines.push({ text: fresh.hint, kind: 'warning' })

  return {
    proposal: p,
    source: 'default',
    headline: 'Startpunkt',
    rationale: lines,
    warning:
      fresh.state === 'too-fresh' || fresh.state === 'stale' ? fresh.label : undefined,
    brewsUntilPersonal: LEARN_THRESHOLDS.perBean,
  }
}
