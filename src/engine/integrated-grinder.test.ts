/**
 * Aufgabe 3: Die im Siebträger verbaute Mühle (Sage Barista Express).
 *
 * Zwei Zusagen werden hier geprüft: Sie ist ausschließlich unter Espresso
 * wählbar, und ihre Skala ist stufenlos statt gerastet.
 */
import { describe, it, expect } from 'vitest'
import { grinderFor } from '@/store'
import { startingPoint } from './starting'
import { DEFAULT_SETTINGS, emptyState } from '@/domain'
import { grinderFromCatalog, formatSetting, roundToStep, suggestedSetting, vendorRange, settingUnitLabel } from './grinder'
import { grindersForMethod, GRINDER_CATALOG } from '@/kb'
import { migrate } from '@/store/migrate'
import { INTEGRATED_GRINDER_ID, SCHEMA_VERSION } from '@/config'
import type { Grinder } from '@domain'

const sage = grinderFromCatalog(INTEGRATED_GRINDER_ID, 'g-sage')!
const mylo = grinderFromCatalog('mylo-sg2', 'g-mylo')!

describe('verbaute Mühle: nur unter Espresso', () => {
  it('steht im Katalog und ist auf Espresso beschränkt', () => {
    const e = GRINDER_CATALOG.find((g) => g.id === INTEGRATED_GRINDER_ID)!
    expect(e.methods).toEqual(['espresso'])
    expect(e.kind).toBe('integrated')
  })

  it('taucht in der Auswahl für V60 und AeroPress nicht auf', () => {
    for (const m of ['v60', 'aeropress'] as const) {
      expect(grindersForMethod(m).map((g) => g.id)).not.toContain(INTEGRATED_GRINDER_ID)
    }
    expect(grindersForMethod('espresso').map((g) => g.id)).toContain(INTEGRATED_GRINDER_ID)
  })

  it('greift für Espresso, sobald sie dort gewählt ist — sonst nie', () => {
    const s = {
      grinders: [mylo, sage] as Grinder[],
      settings: { ...DEFAULT_SETTINGS, activeGrinderId: 'g-mylo', espressoGrinderId: 'g-sage' },
    }
    expect(grinderFor(s, 'espresso')?.id).toBe('g-sage')
    expect(grinderFor(s, 'v60')?.id).toBe('g-mylo')
    expect(grinderFor(s, 'aeropress')?.id).toBe('g-mylo')
  })

  it('wird sie versehentlich als Hauptmühle gesetzt, fällt Filter auf eine gültige zurück', () => {
    const s = {
      grinders: [mylo, sage] as Grinder[],
      settings: { ...DEFAULT_SETTINGS, activeGrinderId: 'g-sage' },
    }
    expect(grinderFor(s, 'v60')?.id).toBe('g-mylo')
  })
})

describe('verbaute Mühle: stufenlose Skala', () => {
  it('läuft von 0 bis 18 und rastet nicht', () => {
    expect(sage.scaleType).toBe('stepless')
    expect(sage.usableRange).toEqual([0, 18])
    expect(sage.clicksPerNumber).toBeUndefined()
  })

  it('hält Zwischenwerte fest, statt auf ganze Zahlen zu runden', () => {
    expect(roundToStep(6.5, sage)).toBe(6.5)
    expect(roundToStep(6.4, sage)).toBe(6.5)
    // Zum Vergleich: die gerastete Handmühle kennt nur ganze Klicks.
    expect(roundToStep(6.5, mylo)).toBe(7)
  })

  it('zeigt den Wert als Skalennummer an, nicht als Klicks', () => {
    expect(formatSetting(6.5, sage)).toBe('6,5')
    expect(settingUnitLabel(sage)).toBe('Skala')
  })

  it('schlägt für Espresso einen Wert im tatsächlich genutzten Bereich vor', () => {
    const v = suggestedSetting(sage, 'espresso')!
    expect(v).toBeGreaterThanOrEqual(4)
    expect(v).toBeLessThanOrEqual(9)
    // Empfohlen wird das physikalisch hergeleitete Band 4–9. Die vom
    // Nutzer genannten 5–8 liegen darin — sie sind Erfahrungswert, keine
    // Herstellerangabe, und werden deshalb nicht als solche geführt.
    expect(vendorRange(sage, 'espresso')?.clicks).toEqual([4, 9])
    expect(v).toBeCloseTo(6.5, 1)
  })

  it('die abgeleitete Skala trifft den Espresso-Standard 200–400 µm', () => {
    const µm = (n: number) => sage.zeroPointOffsetMicron + n * sage.micronPerStep
    expect(µm(5)).toBeGreaterThanOrEqual(200)
    expect(µm(8)).toBeLessThanOrEqual(400)
  })
})

describe('Mahlgrad-Modifikatoren rechnen auf die Skala der Mühle um', () => {
  const beanLight = {
    id: 'b1', name: 'Hell', origins: [{ country: 'Äthiopien' }],
    process: 'washed' as const, roastLevel: 'light' as const, createdAt: '2026-07-01T00:00:00Z',
  }
  const mk = (g: Grinder) => startingPoint({
    bean: beanLight,
    bag: { id: 'g', beanId: 'b1', roastDate: '2026-08-07', depleted: false, createdAt: '2026-08-07' },
    method: 'espresso', grinder: g,
    settings: { ...DEFAULT_SETTINGS }, learned: emptyState(3).learned,
    beanHistory: [], methodHistory: [], allBeans: [beanLight],
    today: new Date('2026-08-18T08:00:00Z'),
  }).proposal.grindSetting!

  it('eine helle Hochlandbohne bleibt auf beiden Mühlen im Espressobereich', () => {
    // Der Fehler, den diese Umrechnung behebt: dieselben −6 Schritte
    // bedeuten auf 12,5 µm 75 µm, auf 40 µm aber 240 µm. Ohne Umrechnung
    // landete die Sage bei 0,5 statt bei rund 4,5.
    const aufSage = mk(sage)
    expect(aufSage).toBeGreaterThanOrEqual(4)
    expect(aufSage).toBeLessThanOrEqual(9)
  })

  it('beide Mühlen zielen auf dieselbe Partikelgröße', () => {
    const µmSage = sage.zeroPointOffsetMicron + mk(sage) * sage.micronPerStep
    const µmMylo = mylo.zeroPointOffsetMicron + mk(mylo) * mylo.micronPerStep
    // Zwei Skalen, ein Kaffee: die Zielgröße darf sich nicht unterscheiden.
    expect(Math.abs(µmSage - µmMylo)).toBeLessThan(45)
  })
})

describe('Migration rüstet die Mühle nach, ohne etwas zu verlieren', () => {
  it('bestehende Installation bekommt sie dazu — Handmühle bleibt aktiv', () => {
    const alt = {
      ...emptyState(2),
      grinders: [{ ...mylo, micronPerStep: 13.1, confidence: 'measured' as const }],
      settings: { ...DEFAULT_SETTINGS, activeGrinderId: 'g-mylo' },
    }
    const neu = migrate(alt)
    expect(neu.grinders).toHaveLength(2)
    // Die eigene Kalibrierung darf die Migration nicht anfassen.
    expect(neu.grinders.find((g) => g.id === 'g-mylo')?.micronPerStep).toBe(13.1)
    expect(neu.settings.activeGrinderId).toBe('g-mylo')
    // Espresso bleibt unvorbelegt — die Wahl trifft der Nutzer.
    expect(neu.settings.espressoGrinderId).toBeUndefined()
    expect(neu.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('legt sie nicht doppelt an', () => {
    const einmal = migrate({ ...emptyState(2), grinders: [mylo] })
    const zweimal = migrate({ ...einmal, schemaVersion: 2 })
    expect(zweimal.grinders.filter((g) => g.catalogId === INTEGRATED_GRINDER_ID)).toHaveLength(1)
  })
})
