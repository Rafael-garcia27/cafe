/**
 * Brüh-Animation.
 *
 * Neu konzipiert gegenüber `barista-pwa`. Dort füllte sich ein Becher linear
 * mit `timer / target` — hübsch, aber ohne Aussage. Hier trägt die Grafik
 * Information:
 *
 *   · Der Strahl wird heller, je näher der Shot ans Blonding kommt.
 *     Damit lernt man beiläufig, was Blonding ist.
 *   · Das Zielfenster (ASC-Toleranz ±3 s) ist als Bogen sichtbar —
 *     man sieht, ob man drin liegt, ohne die Zahl zu lesen.
 *   · Beim V60 zeigt die Grafik die Gussphase, nicht nur den Füllstand.
 *   · Farben kommen aus den Theme-Variablen, nicht als feste Hexwerte.
 *
 * Bewusst ohne Bibliothek: reines SVG, keine Animationsframework-Abhängigkeit.
 */
import type { BrewMethod } from '@domain'
import type { AeropressPhases } from '@/kb'

interface Props {
  method: BrewMethod
  elapsedS: number
  target?: [number, number]
  /** Zielausbringung — beim Espresso wird der Füllstand daran gemessen */
  targetYieldG?: number
  /** Phasengrenzen der AeroPress (Bloom · Ziehen · Wenden · Pressen) */
  apPhases?: AeropressPhases
  /** AeroPress steht auf dem Kolben — Standard in den Rezepten der App */
  inverted?: boolean
}

type Zone = 'early' | 'window' | 'late'

function zoneOf(elapsed: number, target?: [number, number]): Zone {
  if (!target) return 'window'
  if (elapsed < target[0]) return 'early'
  if (elapsed > target[1]) return 'late'
  return 'window'
}

/** Die Farbe des Getränks selbst — in beiden Modi dasselbe Kaffeebraun. */
const COFFEE = '#4a2c1c'

const ZONE_COLOR: Record<Zone, string> = {
  early: 'var(--c-mute)',
  window: 'var(--c-ok)',
  late: 'var(--c-bad)',
}

export default function BrewAnimation({ method, elapsedS, target, targetYieldG, apPhases, inverted }: Props) {
  const mid = target ? (target[0] + target[1]) / 2 : 30
  const progress = Math.min(1.15, elapsedS / mid)
  const zone = zoneOf(elapsedS, target)

  return (
    <div className="relative mx-auto" style={{ width: 190, height: 218 }}>
      <svg viewBox="0 0 100 122" className="h-full w-full" aria-hidden>
        {method === 'espresso' && <Espresso p={progress} zone={zone} yieldG={targetYieldG} />}
        {method === 'v60' && <V60 p={progress} zone={zone} />}
        {method === 'aeropress' && <AeroPress elapsedS={elapsedS} zone={zone} phases={apPhases} inverted={inverted !== false} />}
      </svg>
    </div>
  )
}

// ══ Espresso ════════════════════════════════════════════════════════

function Espresso({ p, zone, yieldG }: { p: number; zone: Zone; yieldG?: number }) {
  const cx = 50
  const cupTop = 52, cupBot = 100, topHW = 24, botHW = 18
  const cupH = cupBot - cupTop
  const fill = Math.min(1, p)
  const fillH = fill * cupH
  const fillY = cupBot - fillH
  const cremaH = fill > 0.1 ? Math.min(5, fillH * 0.13) : 0

  // Blonding: Der Strahl hellt auf, je weiter der Shot läuft.
  // Genau das sieht man am bodenlosen Siebträger — hier ohne Erklärtext.
  const blond = Math.max(0, Math.min(1, (p - 0.55) / 0.55))
  const streamCol = `color-mix(in srgb, var(--c-crema) ${25 + blond * 65}%, #33200f)`
  const flowing = p > 0.02 && p < 1.12

  return (
    <>
      <defs>
        <clipPath id="cup">
          <path d={`M ${cx - topHW},${cupTop} L ${cx + topHW},${cupTop} L ${cx + botHW},${cupBot} L ${cx - botHW},${cupBot} Z`} />
        </clipPath>
      </defs>

      {/* Siebträger */}
      <rect x={cx - 30} y={10} width={60} height={14} rx="4"
        fill="var(--c-raised)" stroke="var(--c-line)" strokeWidth="1.2" />
      <rect x={cx + 28} y={13} width={18} height={6} rx="3" fill="var(--c-raised)" />
      <rect x={cx - 26} y={21} width={52} height={4} rx="2" fill="var(--c-line)" />

      {/* Zwei Ausläufe */}
      <path d={`M ${cx - 6},25 L ${cx - 8},32`} stroke="var(--c-line)" strokeWidth="3" strokeLinecap="round" />
      <path d={`M ${cx + 6},25 L ${cx + 8},32`} stroke="var(--c-line)" strokeWidth="3" strokeLinecap="round" />

      {/* Strahlen — laufen zusammen, wie bei gutem Puck-Prep */}
      {flowing && (
        <g opacity={0.95}>
          <path d={`M ${cx - 8},32 Q ${cx - 5},44 ${cx - 1.5},${cupTop + 2}`}
            stroke={streamCol} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 8},32 Q ${cx + 5},44 ${cx + 1.5},${cupTop + 2}`}
            stroke={streamCol} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Tasse */}
      <path d={`M ${cx - topHW},${cupTop} L ${cx + topHW},${cupTop} L ${cx + botHW},${cupBot} L ${cx - botHW},${cupBot} Z`}
        fill="var(--c-card)" stroke="var(--c-line)" strokeWidth="1.6" />
      <path d={`M ${cx + topHW - 2},${cupTop + 8} q 12,6 0,18`}
        fill="none" stroke="var(--c-line)" strokeWidth="2.5" />

      {/* Inhalt */}
      <g clipPath="url(#cup)">
        <rect x={cx - topHW} y={fillY} width={topHW * 2} height={fillH} fill={COFFEE} />
        {cremaH > 0 && (
          <rect x={cx - topHW} y={fillY} width={topHW * 2} height={cremaH} fill="var(--c-crema)" opacity="0.9" />
        )}
      </g>

      {/* Zielfenster als Bogen unter der Tasse */}
      <ZoneArc zone={zone} p={p} />
      {yieldG && (
        <text x={cx} y={118} textAnchor="middle" fontSize="7" fill="var(--c-faint)">
          Ziel {yieldG.toFixed(0)} g
        </text>
      )}
    </>
  )
}

// ══ V60 ═════════════════════════════════════════════════════════════

function V60({ p, zone }: { p: number; zone: Zone }) {
  const cx = 50
  // Phasen: Bloom (0–25 %), Güsse (25–75 %), Drawdown (75–100 %)
  const phase = p < 0.25 ? 'bloom' : p < 0.75 ? 'pour' : 'drawdown'
  const bedRise = phase === 'bloom' ? Math.min(1, p / 0.25) : 1
  const carafe = Math.min(1, Math.max(0, (p - 0.2) / 0.75))
  const pouring = phase !== 'drawdown' && p > 0.02

  return (
    <>
      <defs>
        <clipPath id="carafe">
          <rect x={cx - 20} y={70} width={40} height={30} rx="3" />
        </clipPath>
      </defs>

      {/* Gießstrahl */}
      {pouring && (
        <path d={`M ${cx},6 L ${cx},${26}`} stroke="var(--c-crema)" strokeWidth="2.2"
          strokeLinecap="round" opacity="0.75" />
      )}

      {/* Dripper — 60°-Kegel */}
      <path d={`M ${cx - 26},28 L ${cx + 26},28 L ${cx + 5},62 L ${cx - 5},62 Z`}
        fill="var(--c-card)" stroke="var(--c-line)" strokeWidth="1.6" />
      {/* Spiralrippen angedeutet */}
      {[-16, -8, 0, 8, 16].map((o) => (
        <path key={o} d={`M ${cx + o},29 L ${cx + o * 0.25},60`}
          stroke="var(--c-line)" strokeWidth="0.8" opacity="0.6" />
      ))}

      {/* Kaffeebett — bläht sich beim Bloom auf */}
      <path
        d={`M ${cx - 20 + (1 - bedRise) * 3},${37 - bedRise * 4} L ${cx + 20 - (1 - bedRise) * 3},${37 - bedRise * 4} L ${cx + 6},58 L ${cx - 6},58 Z`}
        fill={COFFEE}
        opacity={0.9}
      />
      {phase === 'bloom' &&
        [-10, 0, 10].map((o, i) => (
          <circle key={o} cx={cx + o} cy={34 - bedRise * 4 - i} r={1.2 + bedRise} fill="var(--c-crema)" opacity={0.5 * bedRise} />
        ))}

      {/* Tropfen */}
      {p > 0.2 && p < 1.05 && <circle cx={cx} cy={66} r="1.6" fill={COFFEE} opacity="0.8" />}

      {/* Kanne */}
      <rect x={cx - 20} y={70} width={40} height={30} rx="3"
        fill="var(--c-card)" stroke="var(--c-line)" strokeWidth="1.6" />
      <g clipPath="url(#carafe)">
        <rect x={cx - 20} y={100 - carafe * 30} width={40} height={carafe * 30} fill={COFFEE} opacity="0.85" />
      </g>

      <text x={cx} y={118} textAnchor="middle" fontSize="7" fill="var(--c-faint)">
        {phase === 'bloom' ? 'Bloom' : phase === 'pour' ? 'Aufgießen' : 'Drawdown'}
      </text>
      <ZoneArc zone={zone} p={p} y={107} />
    </>
  )
}

// ══ AeroPress ═══════════════════════════════════════════════════════

/** m:ss — dasselbe Format wie die laufende Uhr der AeroPress. */
function uhr(s: number): string {
  const g = Math.max(0, Math.round(s))
  return `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`
}

function AeroPress({
  elapsedS,
  zone,
  phases,
  inverted,
}: {
  elapsedS: number
  zone: Zone
  phases?: AeropressPhases
  inverted: boolean
}) {
  const cx = 50
  // Ohne Phasen (sollte nicht vorkommen) ein plausibler Standard: 90 s ziehen.
  const ph = phases ?? { bloomEnd: 35, steepEnd: 90, transferEnd: 98, total: 123 }

  type Phase = 'bloom' | 'steep' | 'transfer' | 'press' | 'done'
  const phase: Phase =
    elapsedS < ph.bloomEnd ? 'bloom'
    : elapsedS < ph.steepEnd ? 'steep'
    : elapsedS < ph.transferEnd ? 'transfer'
    : elapsedS < ph.total ? 'press'
    : 'done'

  const LABEL: Record<Phase, string> = {
    bloom: 'Bloom & Rühren',
    steep: 'Ziehen',
    transfer: 'Kappe & Wenden',
    press: 'Pressen',
    done: 'Fertig',
  }

  // Kolben senkt sich erst in der Pressphase
  const press = Math.max(0, Math.min(1, (elapsedS - ph.transferEnd) / (ph.total - ph.transferEnd)))
  const plungerY = 16 + press * 32

  // Invertiert steht die Presse bis zum Wenden auf dem Kolben: Kammer oben
  // offen, keine Tasse darunter. Erst nach dem Wenden wird gepresst. Wer
  // die Tasse vorher unterstellt, findet sie leer und den Tisch nass.
  const aufKolben = inverted && (phase === 'bloom' || phase === 'steep' || phase === 'transfer')

  // Bloom: viele lebhafte Bläschen, die mit der Zeit abklingen.
  // Steep: nur noch vereinzelte, langsame Bläschen.
  const bloomIntensity = phase === 'bloom' ? 1 - (elapsedS / Math.max(1, ph.bloomEnd)) * 0.6 : 0
  const bubbles =
    phase === 'bloom'
      ? [0, 1, 2, 3, 4, 5]
      : phase === 'steep'
        ? [0, 1]
        : []

  const fortschritt = Math.min(1.1, elapsedS / ph.total)

  return (
    <>
      <defs>
        <clipPath id="chamber">
          <rect x={cx - 17} y={20} width={34} height={52} rx="2" />
        </clipPath>
      </defs>

      {/* Kolben — oben beim Pressen, unten als Standfuß beim Invertieren */}
      {aufKolben ? (
        <>
          <rect x={cx - 18} y={72} width={36} height={7} rx="2"
            fill="var(--c-raised)" stroke="var(--c-line)" strokeWidth="1.2" />
          <rect x={cx - 4} y={79} width={8} height={14} rx="2" fill="var(--c-raised)" />
          <rect x={cx - 13} y={93} width={26} height={5} rx="2" fill="var(--c-raised)"
            stroke="var(--c-line)" strokeWidth="1" />
        </>
      ) : (
        <>
          <rect x={cx - 4} y={plungerY - 14} width={8} height={16} rx="2" fill="var(--c-raised)" />
          <rect x={cx - 18} y={plungerY} width={36} height={7} rx="2"
            fill="var(--c-raised)" stroke="var(--c-line)" strokeWidth="1.2" />
        </>
      )}

      {/* Kammer */}
      <rect x={cx - 17} y={20} width={34} height={52} rx="2"
        fill="var(--c-card)" stroke="var(--c-line)" strokeWidth="1.6" />
      {[30, 40, 50, 60].map((y) => (
        <line key={y} x1={cx + 10} y1={y} x2={cx + 16} y2={y} stroke="var(--c-line)" strokeWidth="0.8" />
      ))}

      {/* Aufguss */}
      <g clipPath="url(#chamber)">
        {(() => {
          // Oberkante der Flüssigkeit: invertiert steht sie in der nach oben
          // offenen Kammer, aufrecht hängt sie unter dem Kolben.
          const top = aufKolben ? 30 : plungerY + 7
          const bottom = 72
          return (
            <>
              <rect x={cx - 17} y={top} width={34} height={bottom - top} fill={COFFEE} opacity="0.85" />
              {phase === 'bloom' && (
                <rect x={cx - 17} y={top} width={34} height={3 + bloomIntensity * 3}
                  fill="var(--c-crema)" opacity={0.35 + bloomIntensity * 0.3} />
              )}
            </>
          )
        })()}

        {bubbles.map((i) => (
          <circle
            key={i}
            cx={cx - 12 + ((i * 5.3) % 24)}
            cy={40 + ((elapsedS * (phase === 'bloom' ? 14 : 5) + i * 11) % 26)}
            r={phase === 'bloom' ? 1.6 : 1.1}
            fill="var(--c-crema)"
            opacity={phase === 'bloom' ? 0.3 + bloomIntensity * 0.35 : 0.3}
          />
        ))}
      </g>

      {/* Rühr-Stab, nur während des Blooms */}
      {phase === 'bloom' && (
        <line
          x1={cx + Math.sin(elapsedS * 2.2) * 8} y1={12}
          x2={cx + Math.sin(elapsedS * 2.2) * 4} y2={40}
          stroke="var(--c-mute)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"
        />
      )}

      {/* Wende-Pfeil während des Transfers */}
      {phase === 'transfer' && (
        <path d={`M ${cx + 24},40 a 9 9 0 1 1 -3,-8`} fill="none"
          stroke="var(--c-mute)" strokeWidth="1.6" strokeLinecap="round"
          markerEnd="url(#flip-arrow)" />
      )}
      <defs>
        <marker id="flip-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="var(--c-mute)" />
        </marker>
      </defs>

      {/* Filterkappe: invertiert kommt sie erst beim Wenden auf die Kammer */}
      {aufKolben ? (
        phase === 'transfer' && (
          <rect x={cx - 18} y={16} width={36} height={5} rx="1.5" fill="var(--c-raised)"
            stroke="var(--c-line)" strokeWidth="1" />
        )
      ) : (
        <rect x={cx - 18} y={72} width={36} height={5} rx="1.5" fill="var(--c-raised)"
          stroke="var(--c-line)" strokeWidth="1" />
      )}

      {/* Tasse — steht erst unter der Presse, wenn wirklich gepresst wird */}
      {!aufKolben && (
        <>
          <path d={`M ${cx - 16},80 L ${cx + 16},80 L ${cx + 12},99 L ${cx - 12},99 Z`}
            fill="var(--c-card)" stroke="var(--c-line)" strokeWidth="1.5" />
          {press > 0 && (
            <rect x={cx - 15} y={99 - press * 17} width={30} height={press * 17} fill={COFFEE} opacity="0.85" />
          )}
        </>
      )}

      {/* Phasenname + nächste Grenze, damit man weiß, worauf man wartet */}
      <text x={cx} y={118} textAnchor="middle" fontSize="7" fill="var(--c-faint)">
        {LABEL[phase]}
        {/* Dieselbe Uhr wie im Timer darüber — sonst muss man zwischen
            zwei Zahlenformaten hin- und herrechnen. */}
        {phase === 'bloom' ? ` · bis ${uhr(ph.bloomEnd)}` : ''}
        {phase === 'steep' ? ` · bis ${uhr(ph.steepEnd)}` : ''}
      </text>
      <ZoneArc zone={zone} p={fortschritt} y={107} />
    </>
  )
}

// ══ Zielfenster-Bogen ═══════════════════════════════════════════════

/** Zeigt ohne Zahlen, ob man vor, im oder hinter dem Zielfenster liegt. */
function ZoneArc({ zone, p, y = 107 }: { zone: Zone; p: number; y?: number }) {
  const w = 56
  const x0 = 50 - w / 2
  const pos = Math.min(1, p) * w
  return (
    <g>
      <rect x={x0} y={y} width={w} height={2.5} rx="1.25" fill="var(--c-line)" />
      {/* Zielband liegt um p = 1 */}
      <rect x={x0 + w * 0.86} y={y} width={w * 0.14} height={2.5} rx="1.25"
        fill="var(--c-ok)" opacity="0.55" />
      <circle cx={x0 + pos} cy={y + 1.25} r="3.2" fill={ZONE_COLOR[zone]} />
    </g>
  )
}
