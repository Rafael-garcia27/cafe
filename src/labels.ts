/**
 * Beschriftungen für alle Enums. Ein Ort, keine Streuung.
 *
 * Wo die Kaffeewelt einen eigenen Begriff hat, steht der da — auch wenn
 * er englisch ist. „Gusher", „Choked", „Channeling" und „Puck" sagt jeder
 * Barista so, auch auf Deutsch; eine Übersetzung wäre eine Erfindung.
 * Wo es keinen Fachbegriff gibt, bleibt es bei klarem Deutsch.
 */
import type {
  BrewMethod,
  RoastLevel,
  Process,
  Defect,
  Character,
  FlowState,
  PuckState,
  BloomBehavior,
} from '@domain'

export const METHOD_LABEL: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  v60: 'V60',
  aeropress: 'AeroPress',
}

export const ROAST_LABEL: Record<RoastLevel, string> = {
  light: 'Light',
  'medium-light': 'Medium-Light',
  medium: 'Medium',
  'medium-dark': 'Medium-Dark',
  dark: 'Dark',
}

export const PROCESS_LABEL: Record<Process, string> = {
  washed: 'Washed',
  natural: 'Natural',
  'honey-yellow': 'Yellow Honey',
  'honey-red': 'Red Honey',
  'honey-black': 'Black Honey',
  anaerobic: 'Anaerobic',
  'carbonic-maceration': 'Carbonic Maceration',
  'wet-hulled': 'Wet Hulled',
  experimental: 'Experimental',
}

/** Fehlerachse — löst Korrekturen aus (kb/16 §2.1) */
export const DEFECT_LABEL: Record<Defect, string> = {
  sour: 'sauer',
  salty: 'salzig',
  thin: 'dünn',
  shortFinish: 'kurzer Abgang',
  bitter: 'bitter',
  astringent: 'trocken/pelzig',
  harsh: 'kratzig',
  ashy: 'aschig',
  flat: 'flach',
  hollow: 'hohl',
  papery: 'papierig',
  rancid: 'ranzig',
  fermented: 'gärig',
  cooked: 'gekocht',
}

/** Die Fehler, die im Basis-Modus angeboten werden */
export const COMMON_DEFECTS: Defect[] = [
  'sour',
  'bitter',
  'salty',
  'astringent',
  'thin',
  'flat',
  'harsh',
  'shortFinish',
]

/** Charakterachse — beschreibend, löst NIE eine Korrektur aus (kb/16 §2.2) */
export const CHARACTER_LABEL: Partial<Record<Character, string>> = {
  citrus: 'Zitrus',
  stoneFruit: 'Steinobst',
  berry: 'Beere',
  tropical: 'Tropisch',
  applePear: 'Apfel/Birne',
  driedFruit: 'Trockenfrucht',
  floral: 'Blumig',
  jasmine: 'Jasmin',
  tea: 'Teeartig',
  caramel: 'Karamell',
  honey: 'Honig',
  brownSugar: 'Brauner Zucker',
  vanilla: 'Vanille',
  chocolate: 'Schokolade',
  darkChocolate: 'Zartbitter',
  nutty: 'Nussig',
  malt: 'Malz',
  spice: 'Würzig',
  earthy: 'Erdig',
  woody: 'Holzig',
  bright: 'Lebendig',
  juicy: 'Saftig',
  winey: 'Weinig',
  complex: 'Komplex',
  clean: 'Klar',
  balanced: 'Ausgewogen',
  syrupy: 'Sirupös',
  creamy: 'Cremig',
  silky: 'Seidig',
  full: 'Vollmundig',
  light: 'Leicht',
}

export const COMMON_CHARACTERS: Character[] = [
  'balanced',
  'chocolate',
  'caramel',
  'nutty',
  'berry',
  'citrus',
  'floral',
  'juicy',
  'creamy',
  'clean',
  'bright',
  'complex',
]

export const FLOW_LABEL: Record<FlowState, string> = {
  choked: 'Choked',
  slow: 'Zu langsam',
  normal: 'Normal',
  fast: 'Zu schnell',
  gusher: 'Gusher',
  uneven: 'Uneven',
  spritzing: 'Spritzing',
}

/** Die Zustände, die im Brüh-Screen angeboten werden */
export const FLOW_CHOICES: FlowState[] = ['normal', 'uneven', 'spritzing', 'choked', 'gusher']

export const PUCK_LABEL: Record<PuckState, string> = {
  even: 'Sauber',
  'wet-soupy': 'Soupy',
  'dry-cracked': 'Rissig',
  crater: 'Crater',
  sideChannel: 'Side Channel',
}

export const PUCK_CHOICES: PuckState[] = ['even', 'crater', 'sideChannel', 'wet-soupy']

export const BLOOM_LABEL: Record<BloomBehavior, string> = {
  vigorous: 'Kräftig aufgebläht',
  moderate: 'Gleichmäßig',
  flat: 'Kaum Reaktion',
  uneven: 'Trockene Stellen',
}

export const BLOOM_CHOICES: BloomBehavior[] = ['moderate', 'vigorous', 'flat', 'uneven']
