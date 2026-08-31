/**
 * French Press — die vierte Methode.
 *
 * Geprüft wird vor allem, was hier ANDERS ist als bei den drei anderen:
 * Immersion sperrt die Zeitkorrektur, der Grind ist der schwächste statt
 * der stärkste Hebel, und der einzige Fehler passiert nach dem Brühen.
 */
import { describe, it, expect } from 'vitest'
import type { Bean, Bag } from '@domain'
import type { EngineContext } from '@/domain'
import { DEFAULT_SETTINGS, EMPTY_LEARNED } from '@/domain'
import { startingPoint } from './starting'
import { diagnose } from './diagnose'
import { bestMethodFor, suitability } from './suitability'
import { grinderFromCatalog, suggestedSetting } from './grinder'
import { targetTimeRange, isImmersion, correctionOrder, getMethod, tempRange, beverageYield, ORIGINS } from '@/kb'
import { METHODS, METHOD_LABEL } from '@/labels'
import formulas from '@data/formulas.json'

const TODAY = new Date('2026-08-18T08:00:00Z')
const daysAgo = (n: number) => new Date(TODAY.getTime() - n * 86_400_000).toISOString()

const bean = (over: Partial<Bean> = {}): Bean => ({
  id: 'b1', name: 'Test', origins: [{ country: 'Brasilien' }],
  process: 'natural', roastLevel: 'medium-dark', createdAt: daysAgo(30), ...over,
})
const bag = (over: Partial<Bag> = {}): Bag => ({
  id: 'g1', beanId: 'b1', roastDate: daysAgo(12), depleted: false, createdAt: daysAgo(12), ...over,
})
const mylo = grinderFromCatalog('mylo-sg2', 'gr1')!
const ctx = (over: Partial<EngineContext> = {}): EngineContext => ({
  bean: bean(), bag: bag(), method: 'frenchpress', grinder: mylo,
  settings: { ...DEFAULT_SETTINGS }, learned: { ...EMPTY_LEARNED },
  beanHistory: [], methodHistory: [], allBeans: [bean()], today: TODAY, ...over,
})

describe('Vollständig angelegt', () => {
  it('steht in der Methodenliste und hat eine Beschriftung', () => {
    expect(METHODS).toContain('frenchpress')
    expect(METHOD_LABEL.frenchpress).toBe('French Press')
  })

  it('hat für jeden Röstgrad einen Startpunkt', () => {
    const m = getMethod('frenchpress')
    for (const r of ['light', 'medium-light', 'medium', 'medium-dark', 'dark'] as const) {
      expect(m.defaults[r]?.ratio).toBeGreaterThan(10)
      expect(m.defaults[r]?.steepS).toBeGreaterThan(120)
    }
  })

  it('kennt ein Frische- und ein Ruhefenster', () => {
    const F31 = formulas.formulas.find((f) => f.id === 'F-31') as unknown as {
      params: Record<string, Record<string, unknown>>
    }
    expect(F31.params.frenchpress).toBeDefined()
    expect((formulas as unknown as { restWindows: Record<string, unknown> }).restWindows.frenchpress).toBeDefined()
    expect((formulas as unknown as { methodSensitivity: Record<string, unknown> }).methodSensitivity.frenchpress).toBeDefined()
  })

  it('jede Herkunft sagt, wie gut sie sich eignet', () => {
    for (const o of ORIGINS) {
      const fit = o.methodSuitability?.frenchpress
      expect(fit, o.name).toBeGreaterThanOrEqual(1)
      expect(fit, o.name).toBeLessThanOrEqual(5)
    }
  })
})

describe('Immersion: die Zeit ist gewählt, nicht Ergebnis', () => {
  it('gilt als Immersion', () => {
    expect(isImmersion('frenchpress')).toBe(true)
    expect(isImmersion('aeropress')).toBe(true)
    expect(isImmersion('v60')).toBe(false)
    expect(isImmersion('espresso')).toBe(false)
  })

  it('liefert überhaupt eine Zielzeit', () => {
    const t = targetTimeRange('frenchpress', 30, 'medium')
    expect(t).not.toBeNull()
    // Vier Minuten ziehen plus Kruste und Pressen.
    expect(t![0]).toBeGreaterThan(200)
    expect(t![1]).toBeLessThan(400)
  })

  it('eine lange Gesamtzeit erzeugt KEINE Grind-Korrektur', () => {
    const c = ctx()
    const p = startingPoint(c).proposal
    const d = diagnose({
      ctx: c,
      actual: {
        doseG: p.doseG, waterG: p.waterG, timeS: (p.targetTimeS?.[1] ?? 300) + 240,
        waterTempC: p.waterTempC,
        grindSetting: { equipmentId: 'gr1', value: 85, unit: 'clicks' },
      },
      tasting: { rating: 3, defects: ['bitter'], characters: [], wouldRepeat: false },
      observations: { decantedImmediately: true },
    })
    expect(JSON.stringify(d)).not.toMatch(/Klicks (feiner|gröber)/)
  })
})

describe('Der Grind ist hier der schwächste Hebel', () => {
  it('die Korrekturreihenfolge kommt aus der Wissensbasis, nicht aus dem Code', () => {
    const unter = correctionOrder('frenchpress', 'underextracted')!
    expect(unter[0]).toBe('ratio')
    expect(unter.indexOf('grindSetting')).toBeGreaterThan(unter.indexOf('ratio'))
    // Beim Espresso ist es genau umgekehrt: dort führt der Grind.
    expect(correctionOrder('espresso', 'underextracted')).toBeNull()
  })

  it('trifft den groben Zielbereich von 900–1200 µm', () => {
    const v = suggestedSetting(mylo, 'frenchpress')!
    const µm = mylo.zeroPointOffsetMicron + v * mylo.micronPerStep
    expect(µm).toBeGreaterThanOrEqual(900)
    expect(µm).toBeLessThanOrEqual(1200)
  })

  it('ist gröber als alle anderen Methoden', () => {
    const µm = (m: 'espresso' | 'v60' | 'aeropress' | 'frenchpress') =>
      mylo.zeroPointOffsetMicron + suggestedSetting(mylo, m)! * mylo.micronPerStep
    expect(µm('frenchpress')).toBeGreaterThan(µm('v60'))
    expect(µm('frenchpress')).toBeGreaterThan(µm('aeropress'))
    expect(µm('frenchpress')).toBeGreaterThan(µm('espresso'))
  })
})

describe('Der einzige Fehler passiert nach dem Brühen', () => {
  const bitter = (decantedImmediately?: boolean) => {
    const c = ctx()
    const p = startingPoint(c).proposal
    return diagnose({
      ctx: c,
      actual: {
        doseG: p.doseG, waterG: p.waterG, timeS: 240, waterTempC: p.waterTempC,
        grindSetting: { equipmentId: 'gr1', value: 85, unit: 'clicks' },
      },
      observations: { decantedImmediately },
      tasting: { rating: 2, defects: ['bitter'], characters: [], wouldRepeat: false },
    })
  }

  it('stand der Kaffee auf dem Satz, ist die Bitterkeit erklärt', () => {
    const d = bitter(false)
    expect(d.blocked).toBe(true)
    expect(d.headline).toContain('auf dem Satz')
    // Keine Empfehlung — an einem intakten Brew wird nichts gedreht.
    expect(d.suggestions).toHaveLength(0)
  })

  it('wurde sofort umgefüllt, wird normal diagnostiziert', () => {
    const d = bitter(true)
    expect(d.blocked).toBeFalsy()
    expect(d.suggestions.length).toBeGreaterThan(0)
    // Und zwar nicht über den Grind.
    expect(d.suggestions[0]!.variable).not.toBe('grindSetting')
  })

  it('ohne Angabe wird nicht geraten', () => {
    expect(bitter(undefined).blocked).toBeFalsy()
  })
})

describe('Eignung: Körper ja, Klarheit nein', () => {
  it('brasilianische Natural ist ideal', () => {
    expect(suitability(bean(), 'frenchpress').score).toBeGreaterThanOrEqual(4.5)
  })

  it('helle Äthiopierin wird nicht zur French Press geraten', () => {
    const b = bean({ origins: [{ country: 'Äthiopien' }], process: 'washed', roastLevel: 'light' })
    expect(bestMethodFor(b).method).toBe('v60')
  })

  it('bleibt in physikalisch sinnvollen Grenzen', () => {
    const tr = tempRange('frenchpress')
    for (const roast of ['light', 'medium', 'dark'] as const) {
      for (const proc of ['washed', 'natural', 'anaerobic'] as const) {
        const p = startingPoint(ctx({ bean: bean({ roastLevel: roast, process: proc }) })).proposal
        expect(p.waterTempC).toBeGreaterThanOrEqual(tr.min)
        expect(p.waterTempC).toBeLessThanOrEqual(tr.max)
        expect(p.steepS!).toBeGreaterThan(90)
        expect(p.steepS!).toBeLessThan(420)
        expect(p.ratio).toBeGreaterThan(12)
        expect(p.ratio).toBeLessThan(20)
      }
    }
  })
})

describe('Eine Tasse, nicht eine Kanne', () => {
  it('die Standarddosis ergibt rund 250 g in der Tasse', () => {
    const p = startingPoint(ctx()).proposal
    const inDerTasse = beverageYield('frenchpress', p.doseG, p.waterG!)
    expect(inDerTasse).toBeGreaterThanOrEqual(230)
    expect(inDerTasse).toBeLessThanOrEqual(300)
  })

  it('der Satz behält das Doppelte seines Gewichts', () => {
    // 18 g Kaffee halten ~36 g Wasser zurück (kb/10b §5).
    expect(beverageYield('frenchpress', 18, 288)).toBe(252)
  })

  it('beim Espresso gibt es keine Retention', () => {
    expect(beverageYield('espresso', 18, 36)).toBe(36)
  })

  it('gilt auch für die anderen Aufgussmethoden', () => {
    expect(beverageYield('v60', 18, 300)).toBeLessThan(300)
    expect(beverageYield('aeropress', 16, 230)).toBeLessThan(230)
  })
})
