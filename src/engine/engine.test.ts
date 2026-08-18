/**
 * Abnahmeszenarien G1–G12 aus dem Briefing (docs/01-briefing.md, Teil G).
 *
 * Diese Tests sind der Beleg, dass die App tut, was zugesagt wurde —
 * insbesondere die Fälle, in denen sie NICHT das Naheliegende tun darf.
 */
import { describe, it, expect } from 'vitest'
import type { Bean, Bag, Brew, Grinder, BrewMethod } from '@domain'
import type { EngineContext } from '@/domain'
import { DEFAULT_SETTINGS, EMPTY_LEARNED } from '@/domain'
import { startingPoint } from './starting'
import { diagnose } from './diagnose'
import { assessFreshness, driftCorrection, restWindow } from './freshness'
import { correctionFromTime, calibrate, suggestedSetting, timeIsTrustworthy } from './grinder'
import { recompute } from './learn'

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
  id: 'g1',
  beanId: 'b1',
  roastDate: daysAgo(12),
  depleted: false,
  createdAt: daysAgo(12),
  ...over,
})

const grinder: Grinder = {
  id: 'gr1',
  name: 'Test JX-Pro',
  burrType: 'conical',
  scaleType: 'stepped',
  micronPerStep: 12.5,
  zeroPointOffsetMicron: 0,
  confidence: 'vendor',
}

const ctx = (over: Partial<EngineContext> = {}): EngineContext => ({
  bean: bean(),
  bag: bag(),
  method: 'espresso',
  grinder,
  settings: { ...DEFAULT_SETTINGS },
  learned: { ...EMPTY_LEARNED },
  beanHistory: [],
  methodHistory: [],
  allBeans: [bean()],
  today: TODAY,
  ...over,
})

const brew = (over: Partial<Brew> = {}): Brew => ({
  id: 'x' + Math.random().toString(36).slice(2),
  bagId: 'g1',
  beanId: 'b1',
  method: 'espresso',
  actual: { doseG: 18, yieldG: 36, timeS: 28, waterTempC: 93, grindSetting: { equipmentId: 'gr1', value: 24, unit: 'clicks' } },
  isBest: false,
  createdAt: daysAgo(5),
  ...over,
})

// ══════════════════════════════════════════════════════════════════════

describe('G1 — Startpunkt für eine neue Bohne', () => {
  it('leitet aus Röstgrad, Herkunft und Höhe ab und begründet sichtbar', () => {
    const sp = startingPoint(ctx())
    expect(sp.source).toBe('default')
    expect(sp.proposal.doseG).toBeGreaterThan(15)
    expect(sp.proposal.ratio).toBeGreaterThan(1.5)
    expect(sp.rationale.length).toBeGreaterThan(0)
    expect(sp.rationale[0]!.kind).toBe('source')
  })

  it('mahlt bei hoher Anbauhöhe feiner und brüht heißer', () => {
    const low = startingPoint(ctx({ bean: bean({ altitudeMasl: [1000, 1200] }) }))
    const high = startingPoint(ctx({ bean: bean({ altitudeMasl: [1900, 2100] }) }))
    expect(high.proposal.grindSetting!).toBeLessThan(low.proposal.grindSetting!)
    expect(high.proposal.waterTempC).toBeGreaterThan(low.proposal.waterTempC)
  })

  it('helle Röstung: feiner, heißer, weitere Ratio als dunkle', () => {
    const light = startingPoint(ctx({ bean: bean({ roastLevel: 'light' }) }))
    const dark = startingPoint(ctx({ bean: bean({ roastLevel: 'dark' }) }))
    expect(light.proposal.grindSetting!).toBeLessThan(dark.proposal.grindSetting!)
    expect(light.proposal.waterTempC).toBeGreaterThan(dark.proposal.waterTempC)
    expect(light.proposal.ratio).toBeGreaterThan(dark.proposal.ratio)
  })

  it('Decaf wird gröber und kühler gefahren', () => {
    const normal = startingPoint(ctx())
    const decaf = startingPoint(ctx({ bean: bean({ isDecaf: true }) }))
    expect(decaf.proposal.grindSetting!).toBeGreaterThan(normal.proposal.grindSetting!)
    expect(decaf.proposal.waterTempC).toBeLessThan(normal.proposal.waterTempC)
  })
})

describe('G2 — Zeitabweichung wird zu einer konkreten Klickzahl', () => {
  it('35 s statt 28 s ergibt rund 3 Klicks gröber mit Zeitvorhersage', () => {
    const c = correctionFromTime(35, 28, 'espresso', grinder, 24)
    expect(c).not.toBeNull()
    expect(c!.steps).toBe(3)
    expect(c!.hasSteps).toBe(true)
    expect(c!.expectedTimeS).toBeGreaterThanOrEqual(26)
    expect(c!.expectedTimeS).toBeLessThanOrEqual(30)
  })

  it('ohne Mühle gibt es Prozent statt Klicks — aber immer eine Zahl', () => {
    const c = correctionFromTime(35, 28, 'espresso', undefined, undefined)
    expect(c!.hasSteps).toBe(false)
    expect(Math.round(c!.percent)).toBe(12)
  })

  it('winzige Abweichungen erzeugen keinen Vorschlag', () => {
    expect(correctionFromTime(29, 28, 'espresso', grinder, 24)).toBeNull()
  })

  it('die Diagnose liefert alle fünf Pflichtteile', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 36, waterTempC: 93, grindSetting: { equipmentId: 'gr1', value: 24, unit: 'clicks' } },
      observations: { flowState: 'slow' },
      tasting: { rating: 2, defects: ['bitter', 'astringent'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(false)
    expect(d.suggestions).toHaveLength(1)
    const s = d.suggestions[0]!
    expect(s.what).toBeTruthy()
    expect(s.why).toBeTruthy()
    expect(s.expectation).toBeTruthy()
    expect(s.confidence).toBeTruthy()
    expect(s.variable).toBe('grindSetting')
    expect(s.delta!).toBeGreaterThan(0) // gröber
  })
})

describe('G3 — sauer UND bitter blockiert jede Parameterempfehlung', () => {
  it('gibt keine Mahlgradempfehlung, sondern Technikhinweise', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      tasting: { rating: 2, defects: ['sour', 'bitter'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(true)
    expect(d.suggestions).toHaveLength(0)
    expect(d.techniqueSteps?.length).toBeGreaterThan(0)
  })

  it('gilt auch für sauer + adstringierend', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      tasting: { rating: 2, defects: ['sour', 'astringent'], characters: [], wouldRepeat: false },
    })
    expect(d.blocked).toBe(true)
  })

  it('bei Kanalbildung ist die Zeit gesperrt', () => {
    expect(timeIsTrustworthy('uneven')).toBe(false)
    expect(timeIsTrustworthy('spritzing')).toBe(false)
    expect(timeIsTrustworthy('normal')).toBe(true)

    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 19 },
      observations: { flowState: 'spritzing' },
      tasting: { rating: 2, defects: ['sour'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(true)
    expect(d.headline).toContain('Kanalbildung')
  })

  it('AeroPress verweist bei diesem Muster NICHT auf Kanalbildung', () => {
    const d = diagnose({
      ctx: ctx({ method: 'aeropress' }),
      actual: { doseG: 16, waterG: 240, timeS: 90 },
      tasting: { rating: 2, defects: ['sour', 'bitter'], characters: [], wouldRepeat: false },
    })
    expect(d.blocked).toBe(true)
    const txt = (d.techniqueSteps ?? []).join(' ')
    expect(txt).toMatch(/Mahlwerk|Röstung/)
  })
})

describe('G4 — Frische-Drift korrigiert den Referenzpunkt', () => {
  it('14 Tage älter ergibt etwa einen Klick feiner', () => {
    const d = driftCorrection('espresso', 8, 22)
    expect(d.steps).toBeLessThan(0)
    expect(Math.abs(d.steps)).toBe(1)
    expect(d.reason).toContain('älter')
  })

  it('kleine Altersunterschiede lösen nichts aus', () => {
    expect(driftCorrection('espresso', 10, 13).steps).toBe(0)
  })

  it('gilt nicht für Filtermethoden', () => {
    expect(driftCorrection('v60', 8, 30).steps).toBe(0)
  })

  it('wird im Startpunkt tatsächlich angewendet', () => {
    const history = [brew({ tasting: { rating: 5, defects: [], characters: [], wouldRepeat: true }, createdAt: daysAgo(20) })]
    const learned = {
      ...EMPTY_LEARNED,
      perBean: { 'b1:espresso': { bestBrewId: history[0]!.id, medianParams: {}, refDaysOffRoast: 6, sampleSize: 3, avgRating: 5 } },
    }
    const sp = startingPoint(ctx({ beanHistory: history, learned, bag: bag({ roastDate: daysAgo(26) }) }))
    expect(sp.source).toBe('personal')
    expect(sp.rationale.some((r) => r.text.includes('älter'))).toBe(true)
  })
})

describe('G5 — zu frische Bohne wird nicht eingemessen', () => {
  it('blockiert bei 3 Tagen nach Röstung', () => {
    const d = diagnose({
      ctx: ctx({ bag: bag({ roastDate: daysAgo(3) }) }),
      actual: { doseG: 18, yieldG: 36, timeS: 22 },
      tasting: { rating: 2, defects: ['sour'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(true)
    expect(d.headline).toContain('frisch')
  })

  it('Ruhefenster: Espresso braucht länger als V60', () => {
    expect(restWindow('espresso', 'medium').min).toBeGreaterThan(restWindow('v60', 'medium').min)
  })

  it('Decaf altert schneller', () => {
    expect(restWindow('espresso', 'medium', true).max).toBeLessThan(restWindow('espresso', 'medium', false).max)
  })

  it('überalterte Bohne wird als unreparierbar gemeldet', () => {
    const d = diagnose({
      ctx: ctx({ bag: bag({ roastDate: daysAgo(90) }) }),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      tasting: { rating: 2, defects: ['flat'], characters: [], wouldRepeat: false },
    })
    expect(d.blocked).toBe(true)
    expect(d.headline).toContain('überaltert')
  })

  it('Frische-Score ist im Fenster hoch und außerhalb niedrig', () => {
    const good = assessFreshness(bag({ roastDate: daysAgo(12) }), 'espresso', 'medium', false, TODAY)
    const bad = assessFreshness(bag({ roastDate: daysAgo(45) }), 'espresso', 'medium', false, TODAY)
    expect(good.state).toBe('peak')
    expect(good.score).toBeGreaterThan(bad.score)
  })
})

describe('G6 — Schleifenerkennung bricht ergebnisloses Drehen ab', () => {
  it('erkennt drei Korrekturen in dieselbe Richtung ohne Besserung', () => {
    const hist = [
      brew({ actual: { doseG: 18, yieldG: 36, timeS: 30, grindSetting: { equipmentId: 'gr1', value: 18, unit: 'clicks' } }, tasting: { rating: 2, defects: ['sour', 'bitter'], characters: [], wouldRepeat: false }, createdAt: daysAgo(1) }),
      brew({ actual: { doseG: 18, yieldG: 36, timeS: 29, grindSetting: { equipmentId: 'gr1', value: 20, unit: 'clicks' } }, tasting: { rating: 2, defects: ['sour'], characters: [], wouldRepeat: false }, createdAt: daysAgo(2) }),
      brew({ actual: { doseG: 18, yieldG: 36, timeS: 28, grindSetting: { equipmentId: 'gr1', value: 22, unit: 'clicks' } }, tasting: { rating: 2, defects: ['sour'], characters: [], wouldRepeat: false }, createdAt: daysAgo(3) }),
      brew({ actual: { doseG: 18, yieldG: 36, timeS: 27, grindSetting: { equipmentId: 'gr1', value: 24, unit: 'clicks' } }, tasting: { rating: 2, defects: ['sour'], characters: [], wouldRepeat: false }, createdAt: daysAgo(4) }),
    ]
    const d = diagnose({
      ctx: ctx({ beanHistory: hist }),
      actual: { doseG: 18, yieldG: 36, timeS: 30, grindSetting: { equipmentId: 'gr1', value: 18, unit: 'clicks' } },
      tasting: { rating: 2, defects: ['sour', 'bitter'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(true)
    expect(d.suggestions).toHaveLength(0)
  })
})

describe('G7 — persönlicher Startpunkt ersetzt den Standard', () => {
  it('nutzt ab drei guten Durchgängen die eigene Referenz', () => {
    const good = [1, 2, 3].map((i) =>
      brew({
        actual: { doseG: 18.5, yieldG: 41, timeS: 30, waterTempC: 94, grindSetting: { equipmentId: 'gr1', value: 21, unit: 'clicks' } },
        tasting: { rating: 5, defects: [], characters: ['balanced'], wouldRepeat: true },
        createdAt: daysAgo(i),
      }),
    )
    const sp = startingPoint(ctx({ beanHistory: good }))
    expect(sp.source).toBe('personal')
    expect(sp.proposal.doseG).toBe(18.5)
    expect(sp.proposal.grindSetting).toBe(21)
    expect(sp.headline).toContain('Referenz')
  })

  it('überträgt von einer ähnlichen Bohne, wenn keine eigene existiert', () => {
    const other = bean({ id: 'b2', name: 'Nachbarbohne', roastLevel: 'medium', process: 'washed', origins: [{ country: 'Kolumbien' }] })
    const hist = [
      brew({ beanId: 'b2', actual: { doseG: 18, yieldG: 38, timeS: 29, waterTempC: 93, grindSetting: { equipmentId: 'gr1', value: 23, unit: 'clicks' } }, tasting: { rating: 5, defects: [], characters: [], wouldRepeat: true } }),
    ]
    const sp = startingPoint(ctx({ methodHistory: hist, allBeans: [bean(), other] }))
    expect(sp.source).toBe('transfer')
    expect(sp.rationale[0]!.text).toContain('Nachbarbohne')
  })
})

describe('G8 — persönliche Tendenz wird erkannt und benannt', () => {
  it('erkennt systematisch engere Verhältnisse', () => {
    const beans = [bean()]
    const bags = [bag()]
    const brews = Array.from({ length: 22 }, (_, i) =>
      brew({
        id: 'n' + i,
        actual: { doseG: 18, yieldG: 31, timeS: 28, waterTempC: 93 }, // 1:1,72 statt Standard 1:2,1
        tasting: { rating: 5, defects: [], characters: [], wouldRepeat: true },
        createdAt: daysAgo(i),
      }),
    )
    const learned = recompute(brews, beans, bags, TODAY)
    const pref = learned.preference.espresso!
    expect(pref.ratioBias).toBeLessThan(-0.15)
    expect(pref.statement).toBeTruthy()
    expect(pref.statement).toContain('enger')
  })

  it('schweigt bei zu dünner Datenlage', () => {
    const brews = [brew({ tasting: { rating: 5, defects: [], characters: [], wouldRepeat: true } })]
    const learned = recompute(brews, [bean()], [bag()], TODAY)
    expect(learned.preference.espresso?.statement).toBeUndefined()
  })

  it('merkt sich die beste Einstellung pro Bohne', () => {
    const brews = [1, 2, 3].map((i) =>
      brew({ id: 'p' + i, tasting: { rating: 5, defects: [], characters: [], wouldRepeat: true }, createdAt: daysAgo(i) }),
    )
    const learned = recompute(brews, [bean()], [bag()], TODAY)
    expect(learned.perBean['b1:espresso']).toBeDefined()
    expect(learned.perBean['b1:espresso']!.sampleSize).toBe(3)
  })
})

describe('Wasser-Notausgang (Briefing C6)', () => {
  it('meldet Wasserverdacht statt einer Mahlgradkorrektur', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      measurement: { tdsPct: 10, beverageMassG: 36 }, // ergibt EY 20 %
      tasting: { rating: 2, defects: ['flat'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.blocked).toBe(true)
    expect(d.headline).toContain('Wasser')
    expect(d.suggestions).toHaveLength(0)
  })
})

describe('Methodenspezifische Korrekturreihenfolge', () => {
  it('AeroPress: Rühren vor Mahlgrad bei Unterextraktion', () => {
    const d = diagnose({
      ctx: ctx({ method: 'aeropress' }),
      actual: { doseG: 16, waterG: 240, timeS: 90, stirCount: 2, waterTempC: 92 },
      tasting: { rating: 2, defects: ['sour', 'salty'], characters: [], wouldRepeat: false },
      targetTimeS: [85, 95],
    })
    expect(d.suggestions[0]!.variable).toBe('stirCount')
  })

  it('AeroPress: Temperatur vor Mahlgrad bei Bitterkeit', () => {
    const d = diagnose({
      ctx: ctx({ method: 'aeropress' }),
      actual: { doseG: 16, waterG: 240, timeS: 90, waterTempC: 95 },
      tasting: { rating: 2, defects: ['bitter'], characters: [], wouldRepeat: false },
      targetTimeS: [85, 95],
    })
    expect(d.suggestions[0]!.variable).toBe('waterTempC')
    expect(d.suggestions[0]!.delta).toBe(-5)
  })

  it('Espresso: Mahlgrad zuerst', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 37, waterTempC: 93, grindSetting: { equipmentId: 'gr1', value: 24, unit: 'clicks' } },
      tasting: { rating: 2, defects: ['bitter'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.suggestions[0]!.variable).toBe('grindSetting')
  })

  it('V60: Zielzeit skaliert mit der Dosis (Anti-Regel D-66)', async () => {
    const { targetTimeRange } = await import('@/kb')
    const small = targetTimeRange('v60', 12)!
    const large = targetTimeRange('v60', 30)!
    expect(large[0]).toBeGreaterThan(small[1])
  })
})

describe('Kardinalregel: genau eine Empfehlung', () => {
  it('gibt nie mehr als eine Korrektur aus', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 40, waterTempC: 96, grindSetting: { equipmentId: 'gr1', value: 24, unit: 'clicks' } },
      tasting: { rating: 1, defects: ['bitter', 'astringent', 'thin'], characters: [], wouldRepeat: false },
      targetTimeS: [26, 30],
    })
    expect(d.suggestions.length).toBeLessThanOrEqual(1)
    if (d.suggestions[0]) expect(d.suggestions[0].alternative).toBeTruthy()
  })

  it('guter Kaffee ohne Fehler wird als Referenz vorgeschlagen', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      tasting: { rating: 5, defects: [], characters: ['balanced'], wouldRepeat: true },
      targetTimeS: [26, 30],
    })
    expect(d.saveAsReference).toBe(true)
    expect(d.suggestions).toHaveLength(0)
  })
})

describe('Mühlen-Selbstkalibrierung', () => {
  it('berechnet die Schrittweite aus zwei Shots', () => {
    const r = calibrate({ time1S: 34, setting1: 20, time2S: 24, setting2: 24, method: 'espresso' })
    expect('micronPerStep' in r).toBe(true)
    if ('micronPerStep' in r) {
      expect(r.micronPerStep).toBeGreaterThan(10)
      expect(r.micronPerStep).toBeLessThan(20)
      expect(r.confidence).toBe('measured')
    }
  })

  it('weist unplausible Eingaben zurück statt Unsinn zu rechnen', () => {
    // Gröber gestellt, aber langsamer gelaufen -> physikalisch unmöglich
    const r = calibrate({ time1S: 24, setting1: 20, time2S: 34, setting2: 24, method: 'espresso' })
    expect('error' in r).toBe(true)
  })

  it('schlägt sinnvolle Startwerte je Methode vor', () => {
    const esp = suggestedSetting(grinder, 'espresso')!
    const v60 = suggestedSetting(grinder, 'v60')!
    expect(esp).toBeLessThan(v60)
  })
})

describe('Messungen', () => {
  it('unplausible Extraktion wird abgefangen statt interpretiert', () => {
    const d = diagnose({
      ctx: ctx(),
      actual: { doseG: 18, yieldG: 36, timeS: 28 },
      measurement: { tdsPct: 14, beverageMassG: 36 }, // EY 28 % -> unmöglich
      tasting: { rating: 3, defects: [], characters: [], wouldRepeat: false },
    })
    expect(d.blocked).toBe(true)
    expect(d.checklist?.length).toBeGreaterThan(0)
  })

  it('rechnet die Extraktion beim Filter mit Retentionswasser', () => {
    const d = diagnose({
      ctx: ctx({ method: 'v60' }),
      actual: { doseG: 18, waterG: 300, timeS: 165 },
      measurement: { tdsPct: 1.38, beverageMassG: 264 },
      tasting: { rating: 4, defects: [], characters: [], wouldRepeat: true },
    })
    expect(d.metrics?.ey).toBeCloseTo(20.2, 1)
  })
})
