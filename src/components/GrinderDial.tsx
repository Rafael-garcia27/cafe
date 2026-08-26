/**
 * Mahlgrad-Ring — der Verstellring der Mylo SG2, nachgebildet.
 *
 * Aufbau wie am Gerät, von oben nach unten:
 *   1. gerändelter Ringkörper
 *   2. weiße Zahlenskala mit Feinstrichen (0 links … 10 rechts)
 *   3. dünne Trennlinie
 *   4. aufgedruckte Methodenbezeichnungen (ESPRESSO 2-3 …)
 *   5. weißes Dreieck als fester Index, zeigt nach oben auf die Skala
 *   6. Mühlenkörper mit Rändelung und Schriftzug
 *
 * Zahlen und Aufdruck laufen mit dem Ring, das Dreieck steht still —
 * genau wie an der echten Mühle. Gerechnet wird intern in Klicks
 * (10 Klicks je Skalenzahl).
 */
import { useCallback, useRef, useState } from 'react'

export interface RingLabel {
  text: string
  range: [number, number]
}

interface Props {
  clicks: number
  onChange: (clicks: number) => void
  clicksPerNumber: number
  maxNumber: number
  ringLabels?: RingLabel[]
  /** Empfehlung für die gerade gewählte Methode, in Klicks */
  highlight?: { range: [number, number]; label: string; derived?: boolean }
  wordmark?: string
  disabled?: boolean
}

/** Wie viel der Skala gleichzeitig sichtbar ist (in Skalenzahlen) */
const VISIBLE_NUMBERS = 3.2

export default function GrinderDial({
  clicks,
  onChange,
  clicksPerNumber,
  maxNumber,
  ringLabels,
  highlight,
  wordmark,
  disabled,
}: Props) {
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null)
  const [active, setActive] = useState(false)
  const [w, setW] = useState(340)

  const maxClicks = maxNumber * clicksPerNumber
  const span = VISIBLE_NUMBERS * clicksPerNumber
  const pxPerClick = w / span

  const measure = useCallback((el: HTMLDivElement | null) => {
    if (el) setW(el.clientWidth || 340)
  }, [])

  const clamp = (c: number) => Math.max(0, Math.min(maxClicks, Math.round(c)))

  const onDown = (e: React.PointerEvent) => {
    if (disabled) return
    // Zeigererfassung ist eine Verbesserung, keine Voraussetzung: Schlägt sie
    // fehl (abgebrochene Geste, synthetisches Ereignis), muss das Schieben
    // trotzdem funktionieren.
    try {
      ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    } catch {
      /* ohne Erfassung weitermachen */
    }
    drag.current = { x: e.clientX, start: clicks, moved: false }
    setActive(true)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 2) drag.current.moved = true
    // Der Ring folgt dem Finger: nach rechts schieben bringt kleinere
    // Zahlen unter den Index — wie am echten Gerät.
    onChange(clamp(drag.current.start - dx / pxPerClick))
  }
  const onUp = () => {
    drag.current = null
    setActive(false)
  }

  /** Zylinderprojektion: zu den Rändern hin stauchen und abdunkeln */
  const project = (c: number) => {
    const off = (c - clicks) / (span / 2)
    if (Math.abs(off) > 1.06) return null
    const theta = (off * Math.PI) / 2
    const cos = Math.cos(theta)
    return {
      x: w / 2 + Math.sin(theta) * (w / 2),
      opacity: Math.max(0.08, cos ** 1.3),
      scale: 0.5 + 0.5 * cos,
    }
  }

  const numbers = Array.from({ length: maxNumber + 1 }, (_, i) => i)
  const ticks = Array.from({ length: maxClicks + 1 }, (_, i) => i)
  const value = (clicks / clicksPerNumber).toFixed(1).replace('.', ',')
  const inRange = highlight && clicks >= highlight.range[0] && clicks <= highlight.range[1]

  const KNURL =
    'repeating-linear-gradient(90deg, rgba(255,255,255,.09) 0 1px, transparent 1px 4px)'
  const GRID =
    'repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 7px),' +
    'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 7px)'
  const CURVE =
    'linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.15) 18%, transparent 42%, transparent 58%, rgba(0,0,0,.15) 82%, rgba(0,0,0,.85) 100%)'

  return (
    <div className="select-none">
      {/* Ablesewert */}
      <div className="mb-2 flex items-baseline justify-center gap-2">
        <span className="tnum text-[42px] leading-none font-semibold">{value}</span>
        {highlight && (
          <span className={`text-[13px] ${inRange ? 'text-ok' : 'text-mute'}`}>
            {highlight.label} {(highlight.range[0] / clicksPerNumber).toFixed(0)}–
            {(highlight.range[1] / clicksPerNumber).toFixed(0)}
            {highlight.derived ? ' (abgeleitet)' : ''}
          </span>
        )}
      </div>

      {/* ══ Die Mühle ══ */}
      <div
        ref={measure}
        className="relative touch-none overflow-hidden rounded-[20px]"
        style={{ background: '#0f0f10', border: '1px solid var(--c-line)' }}
      >
        {/* ── Verstellring ── */}
        <div
          className="relative"
          style={{ height: 126, cursor: disabled ? 'default' : active ? 'grabbing' : 'grab' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="slider"
          aria-label="Mahlgrad"
          aria-valuemin={0}
          aria-valuemax={maxNumber}
          aria-valuenow={Number((clicks / clicksPerNumber).toFixed(1))}
          aria-valuetext={`Skala ${value}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onChange(clamp(clicks - 1))
            if (e.key === 'ArrowRight') onChange(clamp(clicks + 1))
          }}
        >
          {/* Rändelung oben */}
          <div
            className="absolute inset-x-0 top-0"
            style={{ height: 26, background: `${KNURL}, linear-gradient(180deg,#26262a,#171719)` }}
          />

          {/* Zahlenskala */}
          <div className="absolute inset-x-0" style={{ top: 26, height: 44 }}>
            {numbers.map((n) => {
              const p = project(n * clicksPerNumber)
              if (!p) return null
              return (
                <span
                  key={`n${n}`}
                  className="tnum absolute"
                  style={{
                    left: p.x,
                    top: 2,
                    transform: `translateX(-50%) scale(${p.scale})`,
                    opacity: p.opacity,
                    fontSize: 24,
                    fontWeight: 500,
                    color: '#f2f0ec',
                  }}
                >
                  {n}
                </span>
              )
            })}
            {/* Feinstriche: jeder Klick */}
            {ticks.map((c) => {
              const p = project(c)
              if (!p) return null
              const major = c % clicksPerNumber === 0
              const half = c % (clicksPerNumber / 2) === 0
              return (
                <div
                  key={`t${c}`}
                  className="absolute"
                  style={{
                    left: p.x,
                    bottom: 2,
                    width: 1,
                    height: major ? 11 : half ? 8 : 5,
                    background: '#f2f0ec',
                    opacity: p.opacity * (major ? 0.95 : 0.5),
                  }}
                />
              )
            })}
          </div>

          {/* Trennlinie unter der Skala */}
          <div
            className="absolute inset-x-0"
            style={{ top: 70, height: 1, background: '#f2f0ec', opacity: 0.55 }}
          />

          {/* Aufdruck: Methodenbezeichnungen */}
          <div className="absolute inset-x-0 overflow-hidden" style={{ top: 84, height: 22 }}>
            {ringLabels?.map((l) => {
              const mid = (l.range[0] + l.range[1]) / 2
              const p = project(mid)
              if (!p) return null
              return (
                <span
                  key={l.text}
                  className="absolute whitespace-nowrap"
                  style={{
                    left: p.x,
                    top: 4,
                    transform: `translateX(-50%) scaleX(${Math.max(0.4, p.scale)})`,
                    opacity: p.opacity * 0.9,
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: '#f2f0ec',
                  }}
                >
                  {l.text}
                </span>
              )
            })}
          </div>

          {/* Rändelung unten */}
          <div
            className="absolute inset-x-0"
            style={{ top: 106, height: 20, background: `${KNURL}, linear-gradient(180deg,#1d1d20,#141416)` }}
          />

          {/* Zylinderwölbung über allem */}
          <div className="pointer-events-none absolute inset-0" style={{ background: CURVE }} />

          {/* Fester Index: weißes Dreieck, zeigt nach oben auf die Skala */}
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              top: 72,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '9px solid #ffffff',
              filter: 'drop-shadow(0 0 3px rgba(0,0,0,.9))',
            }}
          />
        </div>

        {/* ── Mühlenkörper ── */}
        <div
          className="relative"
          style={{ height: 58, background: `${GRID}, linear-gradient(180deg,#161618,#0e0e0f)` }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: CURVE }} />
          <span
            className="absolute inset-x-0 text-center"
            style={{ top: 26, fontSize: 12, letterSpacing: '0.34em', color: '#8d8a85' }}
          >
            {wordmark ?? ''}
          </span>
        </div>
      </div>

      {/* Übersicht über die ganze Skala + Feinkorrektur */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          aria-label="ein Klick feiner"
          disabled={disabled}
          onClick={() => onChange(clamp(clicks - 1))}
          className="h-11 w-11 shrink-0 rounded-xl border border-line bg-raised text-xl text-crema active:bg-line disabled:opacity-40"
        >
          −
        </button>
        <div className="relative h-1.5 flex-1 rounded-full bg-line">
          {highlight && (
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                left: `${(highlight.range[0] / maxClicks) * 100}%`,
                width: `${((highlight.range[1] - highlight.range[0]) / maxClicks) * 100}%`,
                background: 'var(--c-ok)',
                opacity: 0.55,
              }}
            />
          )}
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-crema"
            style={{ left: `${(clicks / maxClicks) * 100}%` }}
          />
          <span className="absolute -bottom-5 left-0 text-[11px] text-faint">0</span>
          <span className="absolute -bottom-5 right-0 text-[11px] text-faint">{maxNumber}</span>
        </div>
        <button
          type="button"
          aria-label="ein Klick gröber"
          disabled={disabled}
          onClick={() => onChange(clamp(clicks + 1))}
          className="h-11 w-11 shrink-0 rounded-xl border border-line bg-raised text-xl text-crema active:bg-line disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div className="h-4" />
    </div>
  )
}
