import { describe, it, expect } from 'vitest'
import { ratioTone, ratioLabel } from './ratio'

describe('Ampel für das Brühverhältnis', () => {
  it('1:2 und die übliche Streuung sind grün', () => {
    for (const r of [1.85, 1.9, 2.0, 2.1, 2.15]) expect(ratioTone(r)).toBe('ok')
    // 18 g → 36 g, der Standardshot
    expect(ratioTone(36 / 18)).toBe('ok')
  })

  it('spürbar daneben ist gelb', () => {
    for (const r of [1.7, 1.8, 2.25, 2.35]) expect(ratioTone(r)).toBe('warn')
  })

  it('weit weg ist rot', () => {
    for (const r of [1.2, 1.6, 2.5, 3.0]) expect(ratioTone(r)).toBe('bad')
  })

  it('sagt, in welche Richtung es abweicht', () => {
    expect(ratioLabel(2.0)).toBe('im Rahmen')
    expect(ratioLabel(1.5)).toBe('enger als 1:2')
    expect(ratioLabel(2.8)).toBe('weiter als 1:2')
  })

  it('die Schwellen sind stetig — kein Sprung mitten im grünen Bereich', () => {
    let vorher = ratioTone(1.0)
    const reihenfolge = ['bad', 'warn', 'ok', 'warn', 'bad']
    const gesehen = ['bad']
    for (let r = 1.0; r <= 3.0; r += 0.01) {
      const t = ratioTone(Math.round(r * 100) / 100)
      if (t !== vorher) { gesehen.push(t); vorher = t }
    }
    expect(gesehen).toEqual(reihenfolge)
  })
})
