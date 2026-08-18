/**
 * Der Kernloop.
 *
 * Briefing G10: Von „Start“ bis „bewertet“ höchstens drei Pflichtinteraktionen.
 * Alles andere ist vorbelegt und optional.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Route } from '@/router'
import { useStore, selectActiveGrinder, selectActiveWater } from '@/store'
import type { BrewMethod, Defect, Character, FlowState, PuckState, BloomBehavior } from '@domain'
import type { EngineContext } from '@/domain'
import { startingPoint } from '@/engine/starting'
import { diagnose, type Diagnosis } from '@/engine/diagnose'
import { assessFreshness } from '@/engine/freshness'
import { consistencyWarning, brewsUntilPersonal } from '@/engine/learn'
import { METHOD_LABEL, DEFECT_LABEL, COMMON_DEFECTS, CHARACTER_LABEL, COMMON_CHARACTERS, FLOW_LABEL, FLOW_CHOICES, PUCK_LABEL, PUCK_CHOICES, BLOOM_LABEL, BLOOM_CHOICES } from '@/labels'
import {
  Screen, Header, Section, Card, Button, Chip, SegmentedControl, Stepper, Field,
  Empty, Stat, FreshnessRing, InfoDot, fmtTime,
} from '@/components/ui'

type Phase = 'select' | 'proposal' | 'timer' | 'record' | 'taste' | 'result'

interface Props {
  route: Route
  navigate: (r: Route) => void
  back: () => void
}

export default function BrewScreen({ navigate }: Props) {
  const s = useStore()
  const [phase, setPhase] = useState<Phase>('select')
  const [beanId, setBeanId] = useState<string | undefined>(s.settings.lastBeanId)
  const [method, setMethod] = useState<BrewMethod>(s.settings.lastMethod ?? 'espresso')

  const bean = s.beans.find((b) => b.id === beanId) ?? s.beans[0]
  const grinder = useStore(selectActiveGrinder)
  const water = useStore(selectActiveWater)

  // Abgeleitete Listen NIE im Selektor bilden — sonst neue Referenz pro
  // Render und damit eine Endlosschleife. Rohdaten abonnieren, hier filtern.
  const bag = useMemo(
    () =>
      bean
        ? s.bags
            .filter((b) => b.beanId === bean.id && !b.depleted)
            .sort((a, b) => (b.roastDate ?? '').localeCompare(a.roastDate ?? ''))[0]
        : undefined,
    [s.bags, bean],
  )
  const beanHistory = useMemo(
    () =>
      bean
        ? s.brews
            .filter((b) => b.beanId === bean.id && b.method === method)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [s.brews, bean, method],
  )
  const methodHistory = useMemo(
    () => s.brews.filter((b) => b.method === method).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [s.brews, method],
  )

  const ctx: EngineContext | null = useMemo(() => {
    if (!bean) return null
    return {
      bean, bag, method, grinder, water,
      settings: s.settings, learned: s.learned,
      beanHistory, methodHistory, allBeans: s.beans, today: new Date(),
    }
  }, [bean, bag, method, grinder, water, s.settings, s.learned, beanHistory, methodHistory, s.beans])

  const sp = useMemo(() => (ctx ? startingPoint(ctx) : null), [ctx])

  // Ist-Werte
  const [doseG, setDoseG] = useState(18)
  const [yieldG, setYieldG] = useState(36)
  const [waterG, setWaterG] = useState(300)
  const [tempC, setTempC] = useState(93)
  const [grindVal, setGrindVal] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [flow, setFlow] = useState<FlowState | undefined>()
  const [puck, setPuck] = useState<PuckState | undefined>()
  const [bloom, setBloom] = useState<BloomBehavior | undefined>()
  const [drawdown, setDrawdown] = useState(0)
  const [rating, setRating] = useState(0)
  const [defects, setDefects] = useState<Defect[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [result, setResult] = useState<Diagnosis | null>(null)

  // Vorschlag in die Ist-Felder übernehmen
  useEffect(() => {
    if (!sp) return
    setDoseG(sp.proposal.doseG)
    setYieldG(sp.proposal.yieldG)
    setWaterG(sp.proposal.waterG ?? Math.round(sp.proposal.doseG * sp.proposal.ratio))
    setTempC(sp.proposal.waterTempC)
    setGrindVal(sp.proposal.grindSetting ?? 0)
  }, [sp])

  if (s.beans.length === 0) {
    return (
      <Screen>
        <Header title="Brühen" />
        <Empty
          title="Noch keine Bohne im Regal"
          body="Leg zuerst eine Bohne an. Herkunft, Röstgrad und Röstdatum fließen direkt in den Vorschlag ein — ohne sie kann ich nur raten."
          action={<Button onClick={() => navigate({ tab: 'shelf', detail: 'new' })}>Bohne anlegen</Button>}
        />
      </Screen>
    )
  }
  if (!bean || !ctx || !sp) return null

  const fresh = assessFreshness(bag, method, bean.roastLevel, !!bean.isDecaf, new Date())
  const consistency = consistencyWarning(s.learned, method)
  const untilPersonal = brewsUntilPersonal(s.learned, bean.id, method)
  const isEspresso = method === 'espresso'
  const targetT = sp.proposal.targetTimeS

  const reset = () => {
    setPhase('select'); setElapsed(0); setRating(0)
    setDefects([]); setCharacters([]); setResult(null)
    setFlow(undefined); setPuck(undefined); setBloom(undefined); setDrawdown(0)
  }

  const runDiagnosis = () => {
    const d = diagnose({
      ctx,
      actual: {
        doseG, timeS: elapsed, waterTempC: tempC,
        yieldG: isEspresso ? yieldG : undefined,
        waterG: isEspresso ? undefined : waterG,
        grindSetting: grinder ? { equipmentId: grinder.id, value: grindVal, unit: 'clicks' } : undefined,
      },
      observations: {
        flowState: flow, puckState: puck, bloomBehavior: bloom,
        drawdownS: drawdown || undefined,
      },
      tasting: rating ? { rating: rating as 1|2|3|4|5, defects, characters, wouldRepeat: rating >= 4 } : undefined,
      targetTimeS: targetT,
    })
    setResult(d)
    s.addBrew({
      bagId: bag?.id ?? '', beanId: bean.id, method,
      actual: {
        doseG, timeS: elapsed, waterTempC: tempC,
        yieldG: isEspresso ? yieldG : undefined,
        waterG: isEspresso ? undefined : waterG,
        grindSetting: grinder ? { equipmentId: grinder.id, value: grindVal, unit: 'clicks' } : undefined,
      },
      observations: { flowState: flow, puckState: puck, bloomBehavior: bloom, drawdownS: drawdown || undefined },
      tasting: rating ? { rating: rating as 1|2|3|4|5, defects, characters, wouldRepeat: rating >= 4 } : undefined,
      isBest: false,
    })
    setPhase('result')
  }

  // ══ TIMER (Vollbild) ══════════════════════════════════════════════
  if (phase === 'timer') {
    return <BrewTimer target={targetT} onStop={(sec) => { setElapsed(sec); setPhase('record') }} onCancel={reset} />
  }

  return (
    <Screen>
      <Header
        title={phase === 'select' ? 'Brühen' : bean.name}
        subtitle={phase === 'select' ? undefined : `${METHOD_LABEL[method]} · ${fresh.label}`}
        onBack={phase === 'select' ? undefined : reset}
      />

      {/* ══ AUSWAHL ══ */}
      {phase === 'select' && (
        <>
          <Section title="Methode">
            <SegmentedControl
              value={method}
              onChange={setMethod}
              options={[
                { value: 'espresso' as const, label: 'Espresso' },
                { value: 'v60' as const, label: 'V60' },
                { value: 'aeropress' as const, label: 'AeroPress' },
              ]}
            />
          </Section>

          <Section title="Bohne">
            <div className="space-y-2">
              {s.beans.map((b) => {
                const bBag = s.bags.filter((x) => x.beanId === b.id && !x.depleted)[0]
                const f = assessFreshness(bBag, method, b.roastLevel, !!b.isDecaf, new Date())
                const active = b.id === bean.id
                return (
                  <Card key={b.id} onClick={() => setBeanId(b.id)} tone={active ? 'accent' : 'default'}>
                    <div className="flex items-center gap-3">
                      <FreshnessRing score={f.score} label={f.days !== null ? String(f.days) : '?'} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{b.name}</p>
                        <p className="truncate text-[13px] text-mute">
                          {b.origins.map((o) => o.country).join(', ') || 'Herkunft offen'} · {f.label}
                        </p>
                      </div>
                      {active && <span className="text-crema">✓</span>}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Section>

          <Section>
            <Button size="lg" className="w-full" onClick={() => setPhase('proposal')}>
              Weiter
            </Button>
          </Section>
        </>
      )}

      {/* ══ STARTPUNKT ══ */}
      {phase === 'proposal' && (
        <>
          <Section title={sp.headline}>
            <Card tone="accent">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Dosis" value={doseG.toFixed(1)} unit="g" term="dose" />
                {isEspresso ? (
                  <Stat label="Ausbringung" value={yieldG.toFixed(1)} unit="g" term="yield" />
                ) : (
                  <Stat label="Wasser" value={waterG} unit="g" />
                )}
                <Stat label="Verhältnis" value={`1:${sp.proposal.ratio.toFixed(1)}`} term="ratio" />
                <Stat label="Temperatur" value={tempC} unit="°C" />
                {grinder && <Stat label={`Mahlgrad (${grinder.name})`} value={grindVal} term="grind" />}
                {targetT && (
                  <Stat label="Zielzeit" value={`${targetT[0]}–${targetT[1]}`} unit="s" term="time-is-result" />
                )}
              </div>

              <div className="mt-4 space-y-1.5 border-t border-line pt-3">
                {sp.rationale.map((r, i) => (
                  <p
                    key={i}
                    className={`text-[13px] leading-snug ${
                      r.kind === 'warning' ? 'text-warn' : r.kind === 'learning' ? 'text-crema' : 'text-mute'
                    }`}
                  >
                    {r.kind === 'source' ? '▸ ' : '· '}
                    {r.text}
                  </p>
                ))}
              </div>
            </Card>

            {!grinder && (
              <Card className="mt-3" tone="warn">
                <p className="text-[14px] leading-snug">
                  <strong>Keine Mühle eingerichtet.</strong> Ohne sie kann ich Korrekturen nur in
                  Prozent angeben statt in Klicks.
                </p>
                <Button size="sm" variant="ghost" className="mt-2 -ml-3" onClick={() => navigate({ tab: 'setup', detail: 'grinder' })}>
                  Mühle einrichten →
                </Button>
              </Card>
            )}

            {consistency && (
              <Card className="mt-3" tone="warn">
                <p className="text-[14px] leading-snug">{consistency}</p>
              </Card>
            )}

            {untilPersonal > 0 && sp.source !== 'personal' && (
              <p className="mt-3 px-1 text-[13px] text-faint">
                Noch{' '}
                {untilPersonal === 1
                  ? 'ein gut bewerteter Durchgang'
                  : `${untilPersonal} gut bewertete Durchgänge`}
                , dann kenne ich deinen Geschmack für diese Bohne.
              </p>
            )}
          </Section>

          <Section title="Anpassen">
            <div className="space-y-4">
              <Field label="Dosis" term="dose">
                <Stepper value={doseG} onChange={setDoseG} step={0.1} min={5} max={30} unit="g" decimals={1} />
              </Field>
              {isEspresso ? (
                <Field label="Ziel-Ausbringung" term="yield">
                  <Stepper value={yieldG} onChange={setYieldG} step={0.5} min={10} max={90} unit="g" decimals={1} />
                </Field>
              ) : (
                <Field label="Wasser" hint={`Verhältnis 1:${(waterG / doseG).toFixed(1)}`}>
                  <Stepper value={waterG} onChange={setWaterG} step={5} min={80} max={900} unit="g" />
                </Field>
              )}
              <Field label="Temperatur">
                <Stepper value={tempC} onChange={setTempC} step={1} min={70} max={100} unit="°C" />
              </Field>
              {grinder && (
                <Field label={`Mahlgrad · ${grinder.name}`} term="grind">
                  <Stepper value={grindVal} onChange={setGrindVal} step={1} min={0} max={200} />
                </Field>
              )}
            </div>
          </Section>

          <Section>
            <Button size="lg" className="w-full" onClick={() => setPhase('timer')}>
              Brühen starten
            </Button>
          </Section>
        </>
      )}

      {/* ══ ERFASSEN ══ */}
      {phase === 'record' && (
        <>
          <Section title="Ergebnis">
            <Card>
              <div className="grid grid-cols-3 gap-3">
                <Stat
                  label="Zeit"
                  value={fmtTime(elapsed)}
                  tone={targetT ? (elapsed < targetT[0] ? 'warn' : elapsed > targetT[1] ? 'warn' : 'ok') : undefined}
                />
                {targetT && <Stat label="Ziel" value={`${targetT[0]}–${targetT[1]}s`} />}
                {isEspresso && (
                  <Stat label="Fluss" value={(yieldG / Math.max(1, elapsed)).toFixed(2)} unit="g/s" />
                )}
              </div>
            </Card>
          </Section>

          <Section title={isEspresso ? 'Tatsächlich im Glas' : 'Tatsächlich aufgegossen'}>
            {isEspresso ? (
              <Stepper value={yieldG} onChange={setYieldG} step={0.5} min={5} max={120} unit="g" decimals={1} />
            ) : (
              <Stepper value={waterG} onChange={setWaterG} step={5} min={50} max={1000} unit="g" />
            )}
          </Section>

          {isEspresso && (
            <>
              <Section title="Wie lief er?">
                <div className="flex flex-wrap gap-2">
                  {FLOW_CHOICES.map((f) => (
                    <Chip
                      key={f}
                      label={FLOW_LABEL[f]}
                      active={flow === f}
                      tone={f === 'normal' ? 'good' : 'bad'}
                      onClick={() => setFlow(flow === f ? undefined : f)}
                    />
                  ))}
                </div>
              </Section>
              <Section title="Puck danach">
                <div className="flex flex-wrap gap-2">
                  {PUCK_CHOICES.map((p) => (
                    <Chip
                      key={p}
                      label={PUCK_LABEL[p]}
                      active={puck === p}
                      tone={p === 'even' ? 'good' : 'bad'}
                      onClick={() => setPuck(puck === p ? undefined : p)}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {method === 'v60' && (
            <>
              <Section title="Bloom">
                <div className="flex flex-wrap gap-2">
                  {BLOOM_CHOICES.map((b) => (
                    <Chip
                      key={b}
                      label={BLOOM_LABEL[b]}
                      active={bloom === b}
                      tone={b === 'moderate' ? 'good' : 'bad'}
                      onClick={() => setBloom(bloom === b ? undefined : b)}
                    />
                  ))}
                </div>
              </Section>
              <Section title="Drawdown" action={<InfoDot termId="drawdown" />}>
                <Stepper value={drawdown} onChange={setDrawdown} step={5} min={0} max={180} unit="s" />
              </Section>
            </>
          )}

          <Section>
            <Button size="lg" className="w-full" onClick={() => setPhase('taste')}>
              Weiter zum Verkosten
            </Button>
          </Section>
        </>
      )}

      {/* ══ VERKOSTEN ══ */}
      {phase === 'taste' && (
        <>
          <Section title="Wie war er?">
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  aria-label={`${n} von 5`}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-[28px] transition-colors ${
                    n <= rating ? 'text-crema' : 'text-line'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </Section>

          <Section title="Was stört?" action={<span className="text-[12px] text-faint">löst Korrekturen aus</span>}>
            <div className="flex flex-wrap gap-2">
              {COMMON_DEFECTS.map((d) => (
                <Chip
                  key={d}
                  label={DEFECT_LABEL[d]}
                  tone="bad"
                  active={defects.includes(d)}
                  onClick={() =>
                    setDefects((x) => (x.includes(d) ? x.filter((y) => y !== d) : [...x, d]))
                  }
                />
              ))}
            </div>
            <p className="mt-2 text-[12px] text-faint">
              Nichts angetippt ist der Normalfall bei einem guten Kaffee.
            </p>
          </Section>

          <Section title="Was schmeckst du?" action={<span className="text-[12px] text-faint">nur beschreibend</span>}>
            <div className="flex flex-wrap gap-2">
              {COMMON_CHARACTERS.map((c) => (
                <Chip
                  key={c}
                  label={CHARACTER_LABEL[c] ?? c}
                  active={characters.includes(c)}
                  onClick={() =>
                    setCharacters((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))
                  }
                />
              ))}
            </div>
          </Section>

          <Section>
            <Button size="lg" className="w-full" disabled={rating === 0} onClick={runDiagnosis}>
              Auswerten
            </Button>
          </Section>
        </>
      )}

      {/* ══ ERGEBNIS ══ */}
      {phase === 'result' && result && (
        <>
          <Section>
            <Card tone={result.blocked ? 'warn' : result.suggestions.length ? 'accent' : 'default'}>
              <p className="text-[19px] leading-tight font-semibold">{result.headline}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-mute">{result.summary}</p>

              {result.techniqueSteps && (
                <ol className="mt-3 space-y-1.5 border-t border-line pt-3">
                  {result.techniqueSteps.map((t, i) => (
                    <li key={i} className="flex gap-2 text-[14px] leading-snug">
                      <span className="text-crema">{i + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              )}
              {result.checklist && (
                <ul className="mt-3 space-y-1 border-t border-line pt-3">
                  {result.checklist.map((t, i) => (
                    <li key={i} className="text-[14px] text-mute">· {t}</li>
                  ))}
                </ul>
              )}
              {result.escalation && (
                <ul className="mt-3 space-y-1 border-t border-line pt-3">
                  {result.escalation.map((t, i) => (
                    <li key={i} className="text-[14px] text-mute">→ {t}</li>
                  ))}
                </ul>
              )}
            </Card>
          </Section>

          {result.suggestions.map((sg) => (
            <Section key={sg.ruleId} title="Empfehlung">
              <Card tone="accent">
                <p className="text-[22px] leading-tight font-semibold text-crema">{sg.what}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{sg.why}</p>
                <div className="mt-3 rounded-xl border border-line bg-raised p-3">
                  <p className="text-[12px] font-medium tracking-wide text-mute uppercase">Erwartung</p>
                  <p className="mt-1 text-[14px] leading-snug">{sg.expectation}</p>
                </div>
                <p className="mt-2 text-[12px] text-faint">Konfidenz: {sg.confidence}</p>
                {sg.alternative && (
                  <p className="mt-2 text-[13px] text-mute">{sg.alternative}</p>
                )}
                {sg.newValue !== undefined && sg.variable === 'grindSetting' && (
                  <Button
                    className="mt-4 w-full"
                    onClick={() => { setGrindVal(sg.newValue!); setPhase('proposal') }}
                  >
                    Übernehmen und nochmal
                  </Button>
                )}
              </Card>
            </Section>
          ))}

          {result.saveAsReference && (
            <Section>
              <Card tone="accent">
                <p className="text-[15px]">Das war gut. Als Referenz für diese Bohne merken?</p>
                <Button
                  className="mt-3 w-full"
                  onClick={() => {
                    const latest = useStore.getState().brews[0]
                    if (latest) useStore.getState().setBestBrew(latest.id)
                    reset()
                  }}
                >
                  Als Referenz speichern
                </Button>
              </Card>
            </Section>
          )}

          <Section>
            <Button variant="secondary" size="lg" className="w-full" onClick={reset}>
              Fertig
            </Button>
          </Section>
        </>
      )}
    </Screen>
  )
}

// ══ Timer ═══════════════════════════════════════════════════════════

function BrewTimer({
  target,
  onStop,
  onCancel,
}: {
  target?: [number, number]
  onStop: (sec: number) => void
  onCancel: () => void
}) {
  const [sec, setSec] = useState(0)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    startRef.current = Date.now()
    const id = setInterval(() => setSec(Math.floor((Date.now() - startRef.current) / 1000)), 200)
    return () => clearInterval(id)
  }, [])

  const inTarget = target ? sec >= target[0] && sec <= target[1] : false
  const over = target ? sec > target[1] : false

  return (
    <div className="pt-safe pb-safe flex h-full flex-col">
      <div className="flex justify-end px-4 pt-3">
        <button onClick={onCancel} className="h-11 px-3 text-[15px] text-mute">
          Abbrechen
        </button>
      </div>
      {/* Ganzflächig antippbar — blindbedienbar mit nassen Händen */}
      <button
        onClick={() => onStop(sec)}
        className="flex flex-1 flex-col items-center justify-center gap-3"
      >
        <span
          className={`tnum text-[96px] leading-none font-light tabular-nums ${
            over ? 'text-bad' : inTarget ? 'text-ok' : 'text-ink'
          }`}
        >
          {sec}
        </span>
        <span className="text-[15px] text-mute">
          {target ? `Ziel ${target[0]}–${target[1]} s` : 'Sekunden'}
        </span>
        <span className="mt-8 rounded-full border border-line px-6 py-3 text-[15px] text-mute">
          Tippen zum Stoppen
        </span>
      </button>
    </div>
  )
}
