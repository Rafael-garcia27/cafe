/**
 * Bewertung des Brühverhältnisses beim Espresso.
 *
 * Anker ist 1:2 — das klassische Verhältnis, an dem sich ein Espresso
 * messen lässt. Die Ampel beantwortet eine Frage im Vorbeigehen: Ist das
 * noch ein Espresso, oder bin ich abgedriftet?
 *
 * Achtung, eine Einschränkung: Für helle Röstungen empfiehlt die App
 * selbst 1:2,5 bis 1:3 (kb/03 §6). Solche Shots liegen bewusst außerhalb
 * des grünen Bereichs. Deshalb nennt die Oberfläche zusätzlich die
 * Empfehlung für die konkrete Bohne, wenn sie von 1:2 abweicht — die
 * Ampel misst gegen den Standard, nicht gegen das Rezept.
 */

/** Das Verhältnis, gegen das gemessen wird. */
export const RATIO_ANCHOR = 2

/** Grün bis hierhin: ein normaler, gut sitzender Espresso. */
export const RATIO_GREEN = 0.15

/** Gelb bis hierhin: noch brauchbar, aber erkennbar daneben. */
export const RATIO_YELLOW = 0.35

export type RatioTone = 'ok' | 'warn' | 'bad'

export function ratioTone(ratio: number, anchor = RATIO_ANCHOR): RatioTone {
  // Auf zwei Stellen runden, bevor verglichen wird: |2,35 − 2| ergibt in
  // Gleitkomma 0,35000000000000009 und fiele sonst aus dem gelben Bereich,
  // obwohl der Wert genau auf der Grenze liegt.
  const ab = Math.round(Math.abs(ratio - anchor) * 100) / 100
  if (ab <= RATIO_GREEN) return 'ok'
  if (ab <= RATIO_YELLOW) return 'warn'
  return 'bad'
}

/** Ein Wort dazu, warum die Ampel so steht. */
export function ratioLabel(ratio: number, anchor = RATIO_ANCHOR): string {
  const t = ratioTone(ratio, anchor)
  if (t === 'ok') return 'im Rahmen'
  return ratio < anchor ? 'enger als 1:2' : 'weiter als 1:2'
}
