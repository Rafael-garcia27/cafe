export const APP_NAME = 'Café'
export const APP_TAGLINE = 'Dein Dial-in, nicht irgendeins'
export const SCHEMA_VERSION = 1

/** Ab wie vielen guten Brews die Personalisierung greift (Solution Design §6.3) */
export const LEARN_THRESHOLDS = {
  /** (Bohne, Methode): persönlicher Startpunkt ersetzt den Default */
  perBean: 3,
  /** Methode gesamt: systematischer Bias wird berechnet */
  bias: 12,
  /** Bias wird dem Nutzer als Aussage gezeigt */
  biasStatement: 20,
} as const

/** Ab welchem Rating ein Brew als „gut" zählt */
export const GOOD_RATING = 4

/** Erinnerung an die Datensicherung nach so vielen Tagen (iOS-Eviction) */
export const BACKUP_REMINDER_DAYS = 14
