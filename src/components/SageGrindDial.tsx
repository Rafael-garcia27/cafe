/**
 * Mahlgradregler der Sage Barista Express — der runde Drehknopf an der
 * linken Gehäuseseite, nachgebildet.
 *
 * Bewusst anders aufgebaut als die Mylo SG2: Dort schiebt man einen
 * gerändelten Zylinderring waagerecht, hier dreht man einen Knopf in
 * gebürstetem Edelstahl. Der Knopf sitzt in einer Blende, um ihn herum
 * läuft die Skala von FEINER nach GRÖBER; der eingekerbte Zeiger dreht
 * sich mit. Die Skala ist stufenlos — es gibt keine Rastung, nur einen
 * durchgehenden Verstellweg.
 */
import { useCallback, useRef, useState } from 'react'

interface Props {
  /** Skalenwert 0–max, stufenlos */
  value: number
  onChange: (value: number) => void
  max: number
  /** Anzeigeschritt, z. B. 0,5 */
  step: number
  /** Empfehlung für die gewählte Methode */
  highlight?: { range: [number, number]; label: string }
  disabled?: boolean
}

/**
 * Verstellweg: 0 links unten, Maximum rechts unten, aufsteigend im
 * Uhrzeigersinn über die Zwölf. So liest sich jeder Drehregler — die
 * kleinste Zahl links, die größte rechts.
 */
const SWEEP = 280
const START = -140 // Grad ab „12 Uhr", im Uhrzeigersinn

const R = 100 // SVG-Einheiten, Mittelpunkt bei 110/110
const CX = 110
const CY = 110

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180
const pt = (deg: number, r: number) => ({
  x: CX + Math.cos(rad(deg)) * r,
  y: CY + Math.sin(rad(deg)) * r,
})

export default function SageGrindDial({ value, onChange, max, step, highlight, disabled }: Props) {
  const box = useRef<HTMLDivElement | null>(null)
  const drag = useRef<{ lastAngle: number; acc: number } | null>(null)
  const [active, setActive] = useState(false)

  const angleOf = (v: number) => START + (v / max) * SWEEP
  const clamp = (v: number) => Math.max(0, Math.min(max, v))
  /** Auf den Anzeigeschritt runden — die Mühle selbst rastet nicht. */
  const snap = (v: number) => Math.round(clamp(v) / step) * step

  /** Winkel des Fingers relativ zur Knopfmitte, in Grad ab „12 Uhr". */
  const pointerAngle = useCallback((clientX: number, clientY: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return null
    const dx = clientX - (r.left + r.width / 2)
    const dy = clientY - (r.top + r.height / 2)
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90
  }, [])

  const onDown = (e: React.PointerEvent) => {
    if (disabled) return
    const a = pointerAngle(e.clientX, e.clientY)
    if (a === null) return
    try {
      ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    } catch {
      /* ohne Zeigererfassung weitermachen */
    }
    drag.current = { lastAngle: a, acc: value }
    setActive(true)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const a = pointerAngle(e.clientX, e.clientY)
    if (a === null) return
    // Kürzeste Winkeldifferenz — sonst springt der Wert beim Überschreiten
    // von 180°/−180° über den ganzen Verstellweg.
    let d = a - drag.current.lastAngle
    if (d > 180) d -= 360
    if (d < -180) d += 360
    drag.current.lastAngle = a
    drag.current.acc = clamp(drag.current.acc + (d / SWEEP) * max)
    onChange(Math.round(drag.current.acc * 100) / 100)
  }

  const onUp = () => {
    if (drag.current) onChange(snap(drag.current.acc))
    drag.current = null
    setActive(false)
  }

  const nudge = (dir: 1 | -1) => onChange(snap(clamp(value + dir * step)))

  const inRange = highlight && value >= highlight.range[0] && value <= highlight.range[1]
  const display = snap(value).toFixed(step >= 1 ? 0 : 1).replace('.', ',')

  // Ganze Zahlen bekommen einen langen Strich mit Ziffer, halbe einen kurzen.
  const majors = Array.from({ length: max + 1 }, (_, i) => i)
  const minors = Array.from({ length: max * 2 + 1 }, (_, i) => i / 2).filter((v) => v % 1 !== 0)

  const arcPath = (from: number, to: number, r: number) => {
    const a = pt(angleOf(from), r)
    const b = pt(angleOf(to), r)
    const large = ((to - from) / max) * SWEEP > 180 ? 1 : 0
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
  }

  return (
    <div className="select-none">
      {/* Ablesewert */}
      <div className="mb-2 flex items-baseline justify-center gap-2">
        <span className="tnum text-[42px] leading-none font-semibold">{display}</span>
        {highlight && (
          <span className={`text-[13px] ${inRange ? 'text-ok' : 'text-mute'}`}>
            {highlight.label} {highlight.range[0]}–{highlight.range[1]}
          </span>
        )}
      </div>

      {/* ══ Die Blende mit dem Drehknopf ══ */}
      <div
        className="relative mx-auto rounded-[20px]"
        style={{
          background: 'linear-gradient(155deg, #3a3a3d 0%, #232326 55%, #17171a 100%)',
          border: '1px solid var(--c-line)',
          padding: 12,
          maxWidth: 300,
        }}
      >
        {/* Typenbezeichnung wie auf dem Gehäuse */}
        <div
          className="absolute top-3 left-4 text-[9px] tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,.42)' }}
        >
          GRIND SIZE
        </div>
        <div
          className="absolute top-3 right-4 text-[9px] tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,.30)' }}
        >
          SAGE
        </div>

        <div
          ref={box}
          className="relative mx-auto touch-none"
          style={{ width: 220, height: 220, cursor: disabled ? 'default' : active ? 'grabbing' : 'grab' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <svg viewBox="0 0 220 220" className="h-full w-full">
            <defs>
              {/* gebürsteter Edelstahl */}
              <radialGradient id="sg-knob" cx="38%" cy="30%">
                <stop offset="0%" stopColor="#e6e4e0" />
                <stop offset="52%" stopColor="#b9b6b1" />
                <stop offset="100%" stopColor="#7d7a76" />
              </radialGradient>
              <linearGradient id="sg-bevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
                <stop offset="100%" stopColor="rgba(0,0,0,.45)" />
              </linearGradient>
              <radialGradient id="sg-well" cx="50%" cy="42%">
                <stop offset="0%" stopColor="#2b2b2e" />
                <stop offset="100%" stopColor="#131315" />
              </radialGradient>
            </defs>

            {/* Vertiefung im Gehäuse */}
            <circle cx={CX} cy={CY} r={R + 6} fill="url(#sg-well)" />

            {/* Skalenbogen */}
            <path d={arcPath(0, max, R - 4)} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="1.2" />

            {/* Empfohlener Bereich, direkt auf der Skala */}
            {highlight && (
              <path
                d={arcPath(highlight.range[0], highlight.range[1], R - 4)}
                fill="none"
                stroke="var(--c-ok)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {/* Feinstriche */}
            {minors.map((v) => {
              const a = angleOf(v)
              const p1 = pt(a, R - 9)
              const p2 = pt(a, R - 14)
              return <line key={`m${v}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="rgba(255,255,255,.28)" strokeWidth="1" />
            })}

            {/* Hauptstriche mit Ziffern */}
            {majors.map((v) => {
              const a = angleOf(v)
              const p1 = pt(a, R - 8)
              const p2 = pt(a, R - 17)
              const t = pt(a, R - 29)
              return (
                <g key={v}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke="rgba(255,255,255,.72)" strokeWidth="1.6" />
                  <text x={t.x} y={t.y + 3.4} textAnchor="middle" fontSize="10"
                    fill="rgba(255,255,255,.82)" fontWeight="500">
                    {v}
                  </text>
                </g>
              )
            })}

            {/* Der Knopf selbst */}
            <circle cx={CX} cy={CY} r={R - 40} fill="url(#sg-knob)" />
            <circle cx={CX} cy={CY} r={R - 40} fill="none" stroke="url(#sg-bevel)" strokeWidth="2" />

            {/* Griffmulden am Rand des Knopfs */}
            {Array.from({ length: 24 }, (_, i) => i * 15).map((a) => {
              const p1 = pt(a, R - 42)
              const p2 = pt(a, R - 48)
              return <line key={`k${a}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="rgba(0,0,0,.20)" strokeWidth="1.4" strokeLinecap="round" />
            })}

            {/* Zeiger — die eingefräste Kerbe im Knopfrand, dreht mit */}
            <g transform={`rotate(${angleOf(value)} ${CX} ${CY})`}>
              <rect x={CX - 2.6} y={CY - (R - 40)} width="5.2" height="20" rx="2.6"
                fill="#17171a" />
              <circle cx={CX} cy={CY - (R - 48)} r="2.2" fill="var(--c-crema)" />
            </g>

            {/* Laufrichtung — außerhalb der Skala, an den beiden Enden */}
            <text x={26} y={212} textAnchor="start" fontSize="8.5"
              fill="rgba(255,255,255,.45)" letterSpacing="1.4">
              FEINER
            </text>
            <text x={194} y={212} textAnchor="end" fontSize="8.5"
              fill="rgba(255,255,255,.45)" letterSpacing="1.4">
              GRÖBER
            </text>
          </svg>
        </div>

        {/* Genaues Nachstellen ohne Drehen */}
        <div className="mt-1 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={disabled || value <= 0}
            className="h-11 w-16 rounded-xl text-[15px] disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,.09)', color: 'rgba(255,255,255,.85)' }}
            aria-label={`Feiner, ${step} Schritte`}
          >
            −{String(step).replace('.', ',')}
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={disabled || value >= max}
            className="h-11 w-16 rounded-xl text-[15px] disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,.09)', color: 'rgba(255,255,255,.85)' }}
            aria-label={`Gröber, ${step} Schritte`}
          >
            +{String(step).replace('.', ',')}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[13px] text-faint">
        Knopf drehen — die Skala läuft stufenlos.
      </p>
    </div>
  )
}
