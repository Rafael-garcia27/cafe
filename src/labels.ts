/** Deutsche Beschriftungen für alle Enums. Ein Ort, keine Streuung. */
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
  light: 'Hell',
  'medium-light': 'Mittel-hell',
  medium: 'Mittel',
  'medium-dark': 'Mittel-dunkel',
  dark: 'Dunkel',
}

export const PROCESS_LABEL: Record<Process, string> = {
  washed: 'Gewaschen',
  natural: 'Natural',
  'honey-yellow': 'Yellow Honey',
  'honey-red': 'Red Honey',
  'honey-black': 'Black Honey',
  anaerobic: 'Anaerob',
  'carbonic-maceration': 'Carbonic Maceration',
  'wet-hulled': 'Wet Hulled',
  experimental: 'Experimentell',
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
  choked: 'Verstopft',
  slow: 'Zu langsam',
  normal: 'Normal',
  fast: 'Zu schnell',
  gusher: 'Durchgerauscht',
  uneven: 'Ungleichmäßig',
  spritzing: 'Spritzt seitlich',
}

/** Die Zustände, die im Brüh-Screen angeboten werden */
export const FLOW_CHOICES: FlowState[] = ['normal', 'uneven', 'spritzing', 'choked', 'gusher']

export const PUCK_LABEL: Record<PuckState, string> = {
  even: 'Gleichmäßig',
  'wet-soupy': 'Matschig',
  'dry-cracked': 'Trocken/rissig',
  crater: 'Krater',
  sideChannel: 'Rinne am Rand',
}

export const PUCK_CHOICES: PuckState[] = ['even', 'crater', 'sideChannel', 'wet-soupy']

export const BLOOM_LABEL: Record<BloomBehavior, string> = {
  vigorous: 'Stark aufgebläht',
  moderate: 'Gleichmäßig',
  flat: 'Kaum Reaktion',
  uneven: 'Trockene Stellen',
}

export const BLOOM_CHOICES: BloomBehavior[] = ['moderate', 'vigorous', 'flat', 'uneven']
