/**
 * Regressionstest für den Rechenkern.
 *
 * Prüft jedes in kb/ dokumentierte Rechenbeispiel gegen die Implementierung
 * in domain.ts. Wenn hier etwas rot wird, sind Dokumentation und Code
 * auseinandergelaufen — dann gilt kb/02-formelsammlung.md.
 *
 * Ausführen:  npm test
 */
import { describe, it, expect } from 'vitest'
import * as D from './domain'

const near = (label: string, actual: number, expected: number, tol: number) => {
  it(label, () => {
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol)
  })
}

describe('Rechenkern — jedes Beispiel aus kb/', () => {

// kb/02 F-06 Filterbeispiel: 18 g, 300 g Wasser, TDS 1,38 % -> EY 20,2 %
const bev = D.beverageMass(300, 18, 2.0)
near('F-05 Getraenkemasse Filter', bev, 264, 0.01)
near('F-06 EY Filter', D.extractionYield(1.38, bev, 18), 20.2, 0.05)

// kb/02 F-06 Espressobeispiel: 18 g in, 36 g out, TDS 9,8 % -> 19,6 %
near('F-06 EY Espresso', D.extractionYield(9.8, 36, 18), 19.6, 0.05)

// kb/02 F-08 Espresso: EY 20, ratio 2 -> TDS 10
near('F-08 TDS Espresso', D.expectedTds(20, 2, 0), 10, 0.01)
// F-08 Filter: EY 20, ratio 16, lrr 2 -> 1,43
near('F-08 TDS Filter', D.expectedTds(20, 16, 2), 1.43, 0.01)
// kb/02: 1:18, lrr 2, EY 18 -> 1,125 (unter Golden-Cup-Minimum)
near('F-08 Warnfall 1:18 @18%EY', D.expectedTds(18, 18, 2), 1.125, 0.01)

// kb/12 F-12/F-13 Americano: 36 g @10% + 120 g -> 2,31 %
near('F-12 Americano TDS', D.blendTds([{ massG: 36, tdsPct: 10 }, { massG: 120, tdsPct: 0 }]), 2.31, 0.01)
near('F-13 Wasser fuer Filterstaerke', D.waterForTargetTds(36, 10, 1.35), 231, 1)

// kb/02 F-17 Flash Chill: 200 g @80 °C auf 5 °C, Eis -18 °C -> 157 g
near('F-17 Eismenge 200g/80C->5C', D.iceForTargetTemp(200, 80, 5, -18), 157, 1)
// kb/13 Kontrollrechnung: 140 g @80 °C -> ~110 g
near('F-17 Eismenge 140g/80C->5C', D.iceForTargetTemp(140, 80, 5, -18), 110, 1)

// kb/02 F-19 Milch: 4 -> 60 °C -> 9,0 %
near('F-19 Dampfkondensat', D.steamCondensateRatio(4, 60) * 100, 9.0, 0.1)
near('F-19 auf 150 g Milch', 150 * D.steamCondensateRatio(4, 60), 13.5, 0.2)

// kb/12 §4.3 Flat White: 124 g finale Milch, 15 % Overrun -> ~100 g einfuellen
near('F-41 Milch einfuellen Flat White', D.milkToPour(124, 15), 99, 2)

// kb/02 F-22: 35 s ist, 28 s Ziel -> Faktor 1,118 -> 3 Klicks bei 12 um/step, 300 um
const f = D.grindScaleFactor(35, 28)
near('F-22 Faktor', f, 1.118, 0.002)
near('F-23 Schritte (300um, 12um/step)', D.grindSteps(300, f, 12), 3, 0.01)
near('F-22r erwartete Zeit nach +40um', D.expectedTimeAfterGrindChange(35, 300, 340), 27.3, 0.3)

// kb/07 §5.3 Selbstkalibrierung: t1=34, t2=24 -> 1,190; 4 Schritte -> 14,3 um/step
const cal = D.grindScaleFactor(34, 24)
near('kb/07 Kalibrier-Faktor', cal, 1.190, 0.002)
near('kb/07 micronPerStep', (300 * (cal - 1)) / 4, 14.3, 0.2)

// kb/02 F-25 Korbflaechen
near('F-25 Flaeche 58mm', D.basketAreaCm2(58), 26.42, 0.01)
near('F-25 Flaeche 54mm', D.basketAreaCm2(54), 22.90, 0.01)
near('F-25 Dosisdichte 18g/58mm', D.doseDensity(18, 58), 0.681, 0.002)
near('F-25 Aequivalent 54mm', D.doseForBasket(D.doseDensity(18, 58), 54), 15.6, 0.1)

// kb/12 Intensitaeten
near('I Flat White', D.drinkIntensity(10, 36, 160), 2.25, 0.01)
near('I Latte', D.drinkIntensity(10, 36, 280), 1.29, 0.01)
near('I Cortado', D.drinkIntensity(10, 36, 96), 3.75, 0.01)
near('I Pour Over', D.drinkIntensity(1.38, 264, 264), 1.38, 0.01)

// kb/13 Japanese Iced Endwerte
const hot = 180 - 2.0 * 20            // 140 g Fluessigkeit
near('kb/13 Fluessigkeit in der Kanne', hot, 140, 0.01)
near('kb/13 Gesamtmasse', hot + 120, 260, 0.01)
near('kb/13 effektive Ratio', 260 / 20, 13, 0.01)
near('kb/13 TDS bei 20% EY', (20 * 20) / 260, 1.538, 0.005)

// kb/02 F-33 Koffein Doppio
const [lo, hi] = D.caffeineEstimateMg(18, 'espresso')
near('F-33 Koffein Doppio min', lo, 76, 1)
near('F-33 Koffein Doppio max', hi, 119, 1)

  // Sperren und Klassifikationen
  it('F-22 gesperrt bei Kanalbildung', () => {
    expect(D.canUseTimeForGrind('uneven')).toBe(false)
    expect(D.canUseTimeForGrind('spritzing')).toBe(false)
    expect(D.canUseTimeForGrind('normal')).toBe(true)
  })
  it('Drawdown-Klassifikation', () => {
    expect(D.classifyDrawdown(40, 170)).toBe('normal')
    expect(D.classifyDrawdown(90, 180)).toBe('stalled')
  })
  it('unplausible Messung wird erkannt', () => {
    expect(D.isMeasurementPlausible(28, 10)).toBe(false)
    expect(D.isMeasurementPlausible(20, 10)).toBe(true)
  })
})
