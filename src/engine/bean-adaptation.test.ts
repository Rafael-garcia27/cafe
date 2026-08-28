/**
 * Aufgabe 1 + 2: Phasenmodell der AeroPress und bohnenabhängige Rezepte.
 *
 * Der Kern von Aufgabe 2 ist nicht „irgendetwas ändert sich", sondern:
 * dasselbe Bohnenmerkmal muss je Brühmethode UNTERSCHIEDLICH wirken.
 * Genau das prüfen die Tests hier.
 */
import { describe, it, expect } from 'vitest'
import type { Bean, Bag, Grinder } from '@domain'
import type { EngineContext } from '@/domain'
import { DEFAULT_SETTINGS, EMPTY_LEARNED } from '@/domain'
import { startingPoint } from './starting'
import { diagnose } from './diagnose'
import { targetTimeRange, aeropressPhases } from '@/kb'

const TODAY = new Date('2026-08-18T08:00:00Z')
const daysAgo = (n: number) => new Date(TODAY.getTime() - n * 86_400_000).toISOString()

const bean = (over: Partial<Bean> = {}): Bean => ({
  id: 'b1',
  name: 'Testbohne',
  origins: [{ country: 'Kolumbien' }],
  process: 'washed',
  roastLevel: 'medium',
  createdAt: daysAgo(30),
  ...over,
})
const bag = (over: Partial<Bag> = {}): Bag => ({
  id: 'g1', beanId: 'b1', roastDate: daysAgo(12), depleted: false, createdAt: daysAgo(12), ...over,
})
const grinder: Grinder = {
  id: 'gr1', name: 'Test', burrType: 'conical', scaleType: 'stepped',
  micronPerStep: 12.5, zeroPointOffsetMicron: 0, confidence: 'vendor',
}
const ctx = (over: Partial<EngineContext> = {}): EngineContext => ({
  bean: bean(), bag: bag(), method: 'espresso', grinder,
  settings: { ...DEFAULT_SETTINGS }, learned: { ...EMPTY_LEARNED },
  beanHistory: [], methodHistory: [], allBeans: [bean()], today: TODAY, ...over,
})

// ══ Aufgabe 1: AeroPress-Phasen ═════════════════════════════════════

describe('AeroPress: Phasenmodell', () => {
  it('liefert überhaupt eine Zielzeit (vorher null → Animation fiel auf 30 s)', () => {
    const t = targetTimeRange('aeropress', 16, 'medium')
    expect(t).not.toBeNull()
    expect(t![0]).toBeGreaterThan(90)
  })

  it('„Pressen" beginnt erst nach der Ziehzeit, nicht nach 24 s', () => {
    const ph = aeropressPhases(90)
    expect(ph.steepEnd).toBe(90)
    // Der ursprüngliche Fehler: bei Sekunde 24 stand „Pressen" auf dem Schirm.
    expect(24).toBeLessThan(ph.transferEnd)
    expect(ph.total).toBeGreaterThan(ph.transferEnd)
  })

  it('Phasen sind lückenlos und aufsteigend', () => {
    for (const steep of [45, 75, 90, 105, 120]) {
      const ph = aeropressPhases(steep)
      expect(ph.bloomEnd).toBeGreaterThan(0)
      expect(ph.bloomEnd).toBeLessThan(ph.steepEnd)
      expect(ph.steepEnd).toBeLessThan(ph.transferEnd)
      expect(ph.transferEnd).toBeLessThan(ph.total)
    }
  })

  it('Bloom ist gedeckelt — auch eine 4-Minuten-Ziehzeit rührt nicht 96 s', () => {
    expect(aeropressPhases(240).bloomEnd).toBeLessThanOrEqual(35)
  })

  it('Ziehzeiten der Röstgrade liegen im Bereich gängiger Rezepte (45–150 s)', () => {
    for (const roast of ['light', 'medium', 'dark'] as const) {
      const p = startingPoint(ctx({ method: 'aeropress', bean: bean({ roastLevel: roast }) })).proposal
      expect(p.steepS).toBeGreaterThanOrEqual(45)
      expect(p.steepS).toBeLessThanOrEqual(150)
    }
  })

  it('Zielzeit folgt der bohnenspezifischen Ziehzeit', () => {
    const kurz = targetTimeRange('aeropress', 16, 'medium', undefined, 60)
    const lang = targetTimeRange('aeropress', 16, 'medium', undefined, 120)
    expect(lang![0] - kurz![0]).toBe(60)
  })

  it('lange Gesamtzeit erzeugt KEINE Mahlgradkorrektur (Zeit ist gewählt, nicht Ergebnis)', () => {
    const c = ctx({ method: 'aeropress' })
    const p = startingPoint(c).proposal
    const d = diagnose({
      ctx: c,
      actual: {
        doseG: p.doseG, waterG: p.waterG, timeS: (p.targetTimeS?.[1] ?? 120) + 60,
        waterTempC: p.waterTempC, grindSetting: { equipmentId: 'gr1', value: 45, unit: 'clicks' },
      },
    })
    expect(JSON.stringify(d)).not.toMatch(/Mahlgrad.*(feiner|gröber)/i)
  })
})

// ══ Aufgabe 2: Bohne wirkt je Methode anders ════════════════════════

describe('Bohnenmerkmale wirken methodenspezifisch', () => {
  const hochland = bean({ altitudeMasl: [2000, 2200], roastLevel: 'light' })

  it('Espresso reagiert stärker im Mahlgrad als die AeroPress', () => {
    const flach = bean({ altitudeMasl: [900, 1100], roastLevel: 'light' })
    const dE = startingPoint(ctx({ method: 'espresso', bean: hochland })).proposal.grindSetting!
      - startingPoint(ctx({ method: 'espresso', bean: flach })).proposal.grindSetting!
    const dA = startingPoint(ctx({ method: 'aeropress', bean: hochland })).proposal.grindSetting!
      - startingPoint(ctx({ method: 'aeropress', bean: flach })).proposal.grindSetting!
    expect(Math.abs(dE)).toBeGreaterThan(Math.abs(dA))
  })

  it('AeroPress leitet die Höhenlage stattdessen in die Ziehzeit', () => {
    const flach = bean({ altitudeMasl: [900, 1100], roastLevel: 'light' })
    const hoch = startingPoint(ctx({ method: 'aeropress', bean: hochland })).proposal
    const tief = startingPoint(ctx({ method: 'aeropress', bean: flach })).proposal
    expect(hoch.steepS!).toBeGreaterThan(tief.steepS!)
  })

  it('Höhe wirkt stetig — 1799 m und 1801 m springen nicht auseinander', () => {
    const a = startingPoint(ctx({ bean: bean({ altitudeMasl: [1799, 1799] }) })).proposal
    const b = startingPoint(ctx({ bean: bean({ altitudeMasl: [1801, 1801] }) })).proposal
    expect(Math.abs(a.grindSetting! - b.grindSetting!)).toBeLessThanOrEqual(1)
  })

  it('ohne Höhenangabe zieht die App die Herkunft heran', () => {
    const aeth = startingPoint(ctx({ bean: bean({ origins: [{ country: 'Äthiopien' }] }) }))
    const bras = startingPoint(ctx({ bean: bean({ origins: [{ country: 'Brasilien' }] }) }))
    expect(aeth.proposal.grindSetting!).toBeLessThan(bras.proposal.grindSetting!)
    expect(aeth.rationale.some((r) => /Herkunftstypisch/.test(r.text))).toBe(true)
  })

  it('anaerobe Aufbereitung verkürzt die Ziehzeit der AeroPress', () => {
    const an = startingPoint(ctx({ method: 'aeropress', bean: bean({ process: 'anaerobic' }) })).proposal
    const wa = startingPoint(ctx({ method: 'aeropress', bean: bean({ process: 'washed' }) })).proposal
    expect(an.steepS!).toBeLessThan(wa.steepS!)
  })

  it('Röstgrad verschiebt die V60-Zielzeit — hell länger, dunkel kürzer', () => {
    const hell = targetTimeRange('v60', 15, 'light')!
    const dunkel = targetTimeRange('v60', 15, 'dark')!
    expect(hell[0]).toBeGreaterThan(dunkel[0])
  })

  it('jede Methode gibt für dieselbe Bohne eine eigene Zielzeit aus', () => {
    const b = bean({ roastLevel: 'light', altitudeMasl: [1900, 2100] })
    const zeiten = (['espresso', 'v60', 'aeropress'] as const).map(
      (m) => startingPoint(ctx({ method: m, bean: b })).proposal.targetTimeS,
    )
    expect(zeiten.every((t) => t !== undefined)).toBe(true)
    expect(new Set(zeiten.map((t) => t![0])).size).toBe(3)
  })

  it('Vorschläge bleiben in physikalisch sinnvollen Grenzen', () => {
    for (const m of ['espresso', 'v60', 'aeropress'] as const) {
      for (const roast of ['light', 'medium', 'dark'] as const) {
        for (const proc of ['washed', 'natural', 'anaerobic'] as const) {
          const p = startingPoint(ctx({ method: m, bean: bean({ roastLevel: roast, process: proc, altitudeMasl: [2100, 2300] }) })).proposal
          expect(p.waterTempC).toBeGreaterThanOrEqual(85)
          expect(p.waterTempC).toBeLessThanOrEqual(100)
          expect(p.grindSetting!).toBeGreaterThan(0)
          expect(p.ratio).toBeGreaterThan(1)
        }
      }
    }
  })
})
