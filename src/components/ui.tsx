/**
 * UI-Grundbausteine.
 *
 * Keine Fremdbibliothek (Leitentscheidung E7). Natives iOS-Gefühl entsteht
 * durch Systemschrift, Safe Areas und großzügige Touchziele — nicht durch
 * ein importiertes Designsystem.
 */
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { getTerm } from '@/kb'
import { useStore } from '@/store'
import { levelForMode } from '@/domain'

// ── Layout ────────────────────────────────────────────────────────────

export function Screen({ children }: { children: ReactNode }) {
  return <div className="min-h-full pb-28">{children}</div>
}

export function Header({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  onBack?: () => void
}) {
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-xl">
      {/* Feste Höhe: Der Kopf darf nicht springen, wenn ein Untertitel
          fehlt oder eine Schaltfläche dazukommt. */}
      <div className="flex h-[58px] items-center gap-3 px-4">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Zurück"
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-crema active:bg-raised"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] leading-tight font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-[13px] text-mute">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}

export function Section({
  title,
  action,
  children,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="px-4 pt-6">
      {title && (
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h2 className="text-[13px] font-semibold tracking-wide text-mute uppercase">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Card({
  children,
  onClick,
  className = '',
  tone = 'default',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  tone?: 'default' | 'accent' | 'warn' | 'bad'
}) {
  const tones = {
    default: 'bg-card border-line',
    accent: 'bg-card border-crema/40',
    warn: 'bg-card border-warn/40',
    bad: 'bg-card border-bad/40',
  }
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`w-full rounded-2xl border ${tones[tone]} p-4 text-left ${onClick ? 'active:scale-[0.99] transition-transform' : ''} ${className}`}
    >
      {children}
    </Comp>
  )
}

// ── Aktionen ──────────────────────────────────────────────────────────

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const variants = {
    primary: 'bg-crema text-on-crema font-semibold active:bg-crema/85',
    secondary: 'bg-raised text-ink border border-line active:bg-line',
    ghost: 'text-crema active:bg-raised',
    danger: 'bg-bad/15 text-bad border border-bad/30 active:bg-bad/25',
  }
  const sizes = {
    sm: 'h-9 px-3 text-[14px] rounded-xl',
    md: 'h-12 px-5 text-[16px] rounded-2xl',
    lg: 'h-14 px-6 text-[17px] rounded-2xl',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Chip({
  label,
  active,
  onClick,
  tone = 'neutral',
}: {
  label: string
  active?: boolean
  onClick?: () => void
  tone?: 'neutral' | 'bad' | 'good'
}) {
  const base = 'min-h-11 rounded-full px-3.5 text-[15px] transition-colors border'
  const off = 'bg-raised border-line text-mute active:bg-line'
  const on =
    tone === 'bad'
      ? 'bg-bad/20 border-bad/50 text-bad font-medium'
      : tone === 'good'
        ? 'bg-ok/20 border-ok/50 text-ok font-medium'
        : 'bg-crema/20 border-crema/50 text-crema font-medium'
  return (
    <button type="button" onClick={onClick} className={`${base} ${active ? on : off}`}>
      {label}
    </button>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 rounded-2xl bg-raised p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`h-11 flex-1 rounded-xl text-[15px] transition-colors ${
            value === o.value ? 'bg-crema font-semibold text-on-crema' : 'text-mute active:bg-line'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── Eingaben ──────────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  term,
  children,
}: {
  label: string
  hint?: string
  term?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[13px] font-medium text-mute">{label}</span>
        {term && <InfoDot termId={term} />}
      </div>
      {children}
      {hint && <p className="mt-1 text-[12px] text-faint">{hint}</p>}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-line bg-raised px-3.5 py-3 text-ink outline-none focus:border-crema/60'

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  )
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`${inputCls} appearance-none`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/** Große Touchziele — bedienbar mit nassen Händen (Briefing C9). */
/**
 * Zahleneingabe mit großen Touchzielen.
 *
 * Gedrückthalten beschleunigt — bei 0,1-g-Schritten wäre Einzeltippen sonst
 * unzumutbar (36 g aus 10 g heraus wären 260 Taps).
 */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  unit,
  decimals = 0,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string
  decimals?: number
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100))
  const hold = useRef<{ timer?: number; interval?: number }>({})
  const valueRef = useRef(value)
  valueRef.current = value

  const startHold = (dir: 1 | -1) => {
    stopHold()
    hold.current.timer = window.setTimeout(() => {
      let speed = 120
      const tick = () => {
        valueRef.current = clamp(valueRef.current + dir * step)
        onChange(valueRef.current)
        speed = Math.max(30, speed * 0.85)
        hold.current.interval = window.setTimeout(tick, speed)
      }
      tick()
    }, 400)
  }
  const stopHold = () => {
    if (hold.current.timer) clearTimeout(hold.current.timer)
    if (hold.current.interval) clearTimeout(hold.current.interval)
    hold.current = {}
  }
  useEffect(() => stopHold, [])

  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        aria-label="weniger"
        onPointerDown={() => startHold(-1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onClick={() => onChange(clamp(value - step))}
        className="h-14 w-14 shrink-0 rounded-2xl border border-line bg-raised text-2xl text-crema active:bg-line"
      >
        −
      </button>
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-line bg-raised">
        <span className="tnum text-[22px] font-semibold">{value.toFixed(decimals)}</span>
        {unit && <span className="ml-1 text-[14px] text-mute">{unit}</span>}
      </div>
      <button
        type="button"
        aria-label="mehr"
        onPointerDown={() => startHold(1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onClick={() => onChange(clamp(value + step))}
        className="h-14 w-14 shrink-0 rounded-2xl border border-line bg-raised text-2xl text-crema active:bg-line"
      >
        +
      </button>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex min-h-12 w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-[16px]">{label}</span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-crema' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </span>
    </button>
  )
}

// ── Glossar-Tooltip ───────────────────────────────────────────────────

/**
 * Briefing: Wer „Overrun“ nicht kennt, versteht auch keine Empfehlung, die
 * das Wort benutzt. Jeder Fachbegriff bekommt deshalb ein Info-Icon.
 */
export function InfoDot({ termId }: { termId: string }) {
  const [open, setOpen] = useState(false)
  const term = getTerm(termId)
  const level = levelForMode(useStore((s) => s.settings.mode))
  if (!term) return null
  const order = { basis: 0, advanced: 1, expert: 2 }
  if (order[term.level] > order[level] + 1) return null

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        aria-label={`Was ist ${term.term}?`}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[11px] font-semibold text-mute"
      >
        ?
      </button>
      {open && (
        <Sheet onClose={() => setOpen(false)} title={term.term}>
          <p className="text-[17px] leading-snug">{term.short}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-mute">{term.long}</p>
          {term.warning && (
            <p className="mt-3 rounded-xl border border-warn/40 bg-warn/10 p-3 text-[14px] text-warn">
              {term.warning}
            </p>
          )}
        </Sheet>
      )}
    </>
  )
}

// ── Overlay ───────────────────────────────────────────────────────────

/**
 * Modales Blatt von unten.
 *
 * Wird per Portal direkt an `document.body` gehängt. Das ist keine Kosmetik:
 * Ein Sheet, das innerhalb eines `<label>` gerendert wird (z. B. das
 * Glossar-Popup in einem `Field`), bekommt seine Klicks vom Label an das
 * zugehörige Formularfeld weitergereicht — die Schließen-Schaltfläche
 * reagiert dann nicht mehr. Der Portal löst das Blatt aus jedem
 * Eltern-Kontext heraus.
 *
 * Verschachtelte Blätter funktionieren dadurch ebenfalls: Portale werden in
 * Einhängereihenfolge angehängt, das zuletzt geöffnete liegt oben.
 */
export function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // Zähler statt Flag: Beim Schließen eines verschachtelten Blattes darf
    // die Sperre nicht aufgehoben werden, solange das äußere noch offen ist.
    lockScroll()
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="scroll-area relative max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-card">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-card px-4 py-3">
          <h3 className="text-[17px] font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-mute active:bg-raised"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer && <div className="pb-safe sticky bottom-0 border-t border-line bg-card px-4 py-3">{footer}</div>}
        <div className="h-safe-bottom" />
      </div>
    </div>,
    document.body,
  )
}

let scrollLocks = 0
function lockScroll() {
  scrollLocks++
  document.body.style.overflow = 'hidden'
}
function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1)
  if (scrollLocks === 0) document.body.style.overflow = ''
}

// ── Anzeige ───────────────────────────────────────────────────────────

export function Stat({
  label,
  value,
  unit,
  term,
  tone,
}: {
  label: string
  value: string | number
  unit?: string
  term?: string
  tone?: 'ok' | 'warn' | 'bad'
}) {
  const c = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-warn' : tone === 'bad' ? 'text-bad' : 'text-ink'
  return (
    <div>
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-mute">{label}</span>
        {term && <InfoDot termId={term} />}
      </div>
      <div className={`tnum text-[20px] leading-tight font-semibold ${c}`}>
        {value}
        {unit && <span className="ml-0.5 text-[13px] font-normal text-mute">{unit}</span>}
      </div>
    </div>
  )
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-[17px] font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-[34ch] text-[15px] leading-relaxed text-mute">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

/** Frische-Ring: Zustand einer Tüte auf einen Blick */
export function FreshnessRing({
  score,
  size = 36,
  label,
}: {
  score: number
  size?: number
  label?: string
}) {
  const r = (size - 5) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, score))
  const color = pct > 65 ? 'var(--c-ok)' : pct > 35 ? 'var(--c-warn)' : 'var(--c-bad)'
  const style: CSSProperties = { transform: 'rotate(-90deg)' }
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={style} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-line)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      {label && (
        <span className="tnum absolute inset-0 flex items-center justify-center text-[11px] font-semibold">
          {label}
        </span>
      )}
    </div>
  )
}

export function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  const r = Math.round(s % 60)
  return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`
}
