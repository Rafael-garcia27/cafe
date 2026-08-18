/**
 * Regal — die Bohnenbibliothek.
 *
 * Briefing A6: Herkunft, Farm, Röstdatum und Röster-Empfehlung sind keine
 * Deko, sondern Eingaben für die Startpunkt-Berechnung.
 */
import { useMemo, useState } from 'react'
import type { Route } from '@/router'
import { useStore } from '@/store'
import type { Bean, RoastLevel, Process, BrewMethod } from '@domain'
import { assessFreshness } from '@/engine/freshness'
import { ORIGIN_NAMES } from '@/kb'
import { ROAST_LABEL, PROCESS_LABEL, METHOD_LABEL } from '@/labels'
import {
  Screen, Header, Section, Card, Button, Field, TextInput, Select, Sheet,
  Empty, Stat, FreshnessRing, Stepper, Toggle, Chip,
} from '@/components/ui'

interface Props {
  route: Route
  navigate: (r: Route) => void
  back: () => void
}

export default function ShelfScreen({ route, navigate, back }: Props) {
  const beans = useStore((s) => s.beans)
  const bags = useStore((s) => s.bags)
  const brews = useStore((s) => s.brews)
  const [showNew, setShowNew] = useState(route.detail === 'new')

  const detailBean = route.detail === 'bean' ? beans.find((b) => b.id === route.id) : undefined

  if (detailBean) return <BeanDetail bean={detailBean} onBack={back} />

  // „Welche Bohne heute?“ — nach Frischefenster sortiert (Briefing Teil D)
  const ranked = beans
    .map((b) => {
      const bag = bags.filter((x) => x.beanId === b.id && !x.depleted)[0]
      const f = assessFreshness(bag, b.preferredMethod ?? 'espresso', b.roastLevel, !!b.isDecaf, new Date())
      return { bean: b, bag, fresh: f, count: brews.filter((x) => x.beanId === b.id).length }
    })
    .sort((a, b) => b.fresh.score - a.fresh.score)

  return (
    <Screen>
      <Header
        title="Regal"
        subtitle={beans.length ? `${beans.length} Bohne${beans.length === 1 ? '' : 'n'}` : undefined}
        right={
          <Button size="sm" onClick={() => setShowNew(true)}>
            + Bohne
          </Button>
        }
      />

      {beans.length === 0 ? (
        <Empty
          title="Regal ist leer"
          body="Trag deine erste Bohne ein. Je mehr du angibst — Röstdatum, Höhe, Aufbereitung — desto präziser wird der Startpunkt."
          action={<Button onClick={() => setShowNew(true)}>Erste Bohne anlegen</Button>}
        />
      ) : (
        <Section title="Nach Frische sortiert">
          <div className="space-y-2">
            {ranked.map(({ bean, fresh, count }) => (
              <Card key={bean.id} onClick={() => navigate({ tab: 'shelf', detail: 'bean', id: bean.id })}>
                <div className="flex items-center gap-3">
                  <FreshnessRing score={fresh.score} label={fresh.days !== null ? String(fresh.days) : '?'} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{bean.name}</p>
                    <p className="truncate text-[13px] text-mute">
                      {bean.roaster ? `${bean.roaster} · ` : ''}
                      {ROAST_LABEL[bean.roastLevel]} · {PROCESS_LABEL[bean.process]}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-faint">
                      {fresh.label}
                      {count > 0 && ` · ${count}× gebrüht`}
                    </p>
                  </div>
                  <span className="text-faint">›</span>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {showNew && <BeanSheet onClose={() => setShowNew(false)} />}
    </Screen>
  )
}

// ── Detailansicht ─────────────────────────────────────────────────────

function BeanDetail({ bean, onBack }: { bean: Bean; onBack: () => void }) {
  const allBags = useStore((s) => s.bags)
  const allBrews = useStore((s) => s.brews)
  const bags = useMemo(() => allBags.filter((b) => b.beanId === bean.id), [allBags, bean.id])
  const brews = useMemo(() => allBrews.filter((b) => b.beanId === bean.id), [allBrews, bean.id])
  const deleteBean = useStore((s) => s.deleteBean)
  const addBag = useStore((s) => s.addBag)
  const updateBag = useStore((s) => s.updateBag)
  const [showBag, setShowBag] = useState(false)

  const bestByMethod = (['espresso', 'v60', 'aeropress'] as BrewMethod[])
    .map((m) => {
      const list = brews.filter((b) => b.method === m && (b.tasting?.rating ?? 0) >= 4)
      const best = list.sort((a, b) => (b.tasting!.rating - a.tasting!.rating))[0]
      return best ? { method: m, brew: best } : null
    })
    .filter(Boolean) as { method: BrewMethod; brew: (typeof brews)[number] }[]

  return (
    <Screen>
      <Header title={bean.name} subtitle={bean.roaster} onBack={onBack} />

      <Section title="Profil">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Röstgrad" value={ROAST_LABEL[bean.roastLevel]} />
            <Stat label="Aufbereitung" value={PROCESS_LABEL[bean.process]} />
            <Stat label="Herkunft" value={bean.origins.map((o) => o.country).join(', ') || '—'} />
            {bean.origins[0]?.farm && <Stat label="Farm" value={bean.origins[0].farm} />}
            {bean.altitudeMasl && (
              <Stat label="Höhe" value={`${bean.altitudeMasl[0]}–${bean.altitudeMasl[1]}`} unit="m" />
            )}
            {bean.varieties?.length ? <Stat label="Varietät" value={bean.varieties.join(', ')} /> : null}
            {bean.isDecaf && <Stat label="Koffein" value="Entkoffeiniert" />}
          </div>
          {bean.flavorNotes?.length ? (
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-[12px] text-mute">Notizen des Rösters</p>
              <p className="mt-1 text-[15px]">{bean.flavorNotes.join(', ')}</p>
            </div>
          ) : null}
        </Card>
      </Section>

      <Section title="Tüten" action={<Button size="sm" variant="ghost" onClick={() => setShowBag(true)}>+ Tüte</Button>}>
        {bags.length === 0 ? (
          <Card>
            <p className="text-[14px] text-mute">
              Noch keine Tüte. Ohne Röstdatum kann ich die Frische nicht mitführen.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {bags.map((bag) => {
              const f = assessFreshness(bag, bean.preferredMethod ?? 'espresso', bean.roastLevel, !!bean.isDecaf, new Date())
              return (
                <Card key={bag.id}>
                  <div className="flex items-center gap-3">
                    <FreshnessRing score={bag.depleted ? 0 : f.score} label={f.days !== null ? String(f.days) : '?'} />
                    <div className="flex-1">
                      <p className="text-[15px]">
                        {bag.roastDate
                          ? `Geröstet ${new Date(bag.roastDate).toLocaleDateString('de-DE')}`
                          : 'Röstdatum fehlt'}
                      </p>
                      <p className="text-[13px] text-mute">
                        {bag.remainingGrams !== undefined ? `${bag.remainingGrams} g übrig` : ''}
                        {bag.storage === 'frozen' ? ' · eingefroren' : ''}
                        {bag.depleted ? ' · leer' : ''}
                      </p>
                    </div>
                    {!bag.depleted && (
                      <Button size="sm" variant="ghost" onClick={() => updateBag(bag.id, { depleted: true })}>
                        leer
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </Section>

      {bestByMethod.length > 0 && (
        <Section title="Deine besten Einstellungen">
          <div className="space-y-2">
            {bestByMethod.map(({ method, brew }) => (
              <Card key={method}>
                <p className="text-[13px] text-mute">{METHOD_LABEL[method]}</p>
                <p className="mt-1 text-[16px]">
                  {brew.actual.doseG} g →{' '}
                  {brew.actual.yieldG ? `${brew.actual.yieldG} g` : `${brew.actual.waterG} g Wasser`} ·{' '}
                  {brew.actual.timeS} s
                  {brew.actual.grindSetting ? ` · Mahlgrad ${brew.actual.grindSetting.value}` : ''}
                </p>
                <p className="mt-1 text-[13px] text-crema">{'★'.repeat(brew.tasting?.rating ?? 0)}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            if (confirm(`„${bean.name}“ mit allen Tüten und Protokollen löschen?`)) {
              deleteBean(bean.id)
              onBack()
            }
          }}
        >
          Bohne löschen
        </Button>
      </Section>

      {showBag && (
        <BagSheet
          onClose={() => setShowBag(false)}
          onSave={(b) => {
            addBag({ beanId: bean.id, ...b })
            setShowBag(false)
          }}
        />
      )}
    </Screen>
  )
}

// ── Formulare ─────────────────────────────────────────────────────────

function BeanSheet({ onClose }: { onClose: () => void }) {
  const addBean = useStore((s) => s.addBean)
  const addBag = useStore((s) => s.addBag)

  const [name, setName] = useState('')
  const [roaster, setRoaster] = useState('')
  const [country, setCountry] = useState('Kolumbien')
  const [farm, setFarm] = useState('')
  const [roast, setRoast] = useState<RoastLevel>('medium')
  const [process, setProcess] = useState<Process>('washed')
  const [altitude, setAltitude] = useState(1500)
  const [notes, setNotes] = useState('')
  const [decaf, setDecaf] = useState(false)
  const [roastDate, setRoastDate] = useState(new Date().toISOString().slice(0, 10))
  const [grams, setGrams] = useState(250)

  const save = () => {
    if (!name.trim()) return
    const id = addBean({
      name: name.trim(),
      roaster: roaster.trim() || undefined,
      origins: [{ country, farm: farm.trim() || undefined }],
      process,
      roastLevel: roast,
      altitudeMasl: [altitude - 100, altitude + 100],
      flavorNotes: notes ? notes.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      isDecaf: decaf || undefined,
    })
    addBag({ beanId: id, roastDate, purchasedGrams: grams, remainingGrams: grams, storage: 'ambient' })
    onClose()
  }

  return (
    <Sheet
      title="Neue Bohne"
      onClose={onClose}
      footer={
        <Button className="w-full" size="lg" disabled={!name.trim()} onClick={save}>
          Ins Regal stellen
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <TextInput value={name} onChange={setName} placeholder="z. B. Finca La Esperanza" />
        </Field>
        <Field label="Rösterei">
          <TextInput value={roaster} onChange={setRoaster} placeholder="optional" />
        </Field>
        <Field label="Herkunft" hint="Beeinflusst Mahlgrad und Temperatur">
          <Select
            value={country}
            onChange={setCountry}
            options={ORIGIN_NAMES.map((n) => ({ value: n, label: n }))}
          />
        </Field>
        <Field label="Farm / Washing Station">
          <TextInput value={farm} onChange={setFarm} placeholder="optional" />
        </Field>
        <Field label="Röstgrad" hint="Die wichtigste Angabe für den Startpunkt">
          <Select
            value={roast}
            onChange={setRoast}
            options={(Object.keys(ROAST_LABEL) as RoastLevel[]).map((r) => ({ value: r, label: ROAST_LABEL[r] }))}
          />
        </Field>
        <Field label="Aufbereitung" term="process">
          <Select
            value={process}
            onChange={setProcess}
            options={(Object.keys(PROCESS_LABEL) as Process[]).map((p) => ({ value: p, label: PROCESS_LABEL[p] }))}
          />
        </Field>
        <Field label="Anbauhöhe" hint="Über 1800 m: dichter, braucht feineren Mahlgrad">
          <Stepper value={altitude} onChange={setAltitude} step={100} min={400} max={2400} unit="m" />
        </Field>
        <Field label="Geschmacksnotizen des Rösters" hint="Kommagetrennt">
          <TextInput value={notes} onChange={setNotes} placeholder="Schokolade, Nuss, Karamell" />
        </Field>
        <Toggle checked={decaf} onChange={setDecaf} label="Entkoffeiniert" />

        <div className="border-t border-line pt-4">
          <p className="mb-3 text-[13px] font-semibold tracking-wide text-mute uppercase">Erste Tüte</p>
          <Field label="Röstdatum" hint="Ohne dieses Datum kann ich die Frische nicht mitführen">
            <TextInput value={roastDate} onChange={setRoastDate} type="date" />
          </Field>
          <div className="mt-4">
            <Field label="Menge">
              <Stepper value={grams} onChange={setGrams} step={50} min={50} max={2000} unit="g" />
            </Field>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

function BagSheet({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (b: { roastDate?: string; purchasedGrams?: number; remainingGrams?: number; storage?: 'ambient' | 'frozen' }) => void
}) {
  const [roastDate, setRoastDate] = useState(new Date().toISOString().slice(0, 10))
  const [grams, setGrams] = useState(250)
  const [frozen, setFrozen] = useState(false)

  return (
    <Sheet
      title="Neue Tüte"
      onClose={onClose}
      footer={
        <Button
          className="w-full"
          size="lg"
          onClick={() =>
            onSave({ roastDate, purchasedGrams: grams, remainingGrams: grams, storage: frozen ? 'frozen' : 'ambient' })
          }
        >
          Hinzufügen
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="Röstdatum">
          <TextInput value={roastDate} onChange={setRoastDate} type="date" />
        </Field>
        <Field label="Menge">
          <Stepper value={grams} onChange={setGrams} step={50} min={50} max={2000} unit="g" />
        </Field>
        <Toggle
          checked={frozen}
          onChange={setFrozen}
          label="Eingefroren (hält die Frische-Uhr an)"
        />
        {frozen && (
          <div className="flex flex-wrap gap-2">
            <Chip label="Gefroren gemahlen: 1–2 Schritte gröber starten" />
          </div>
        )}
      </div>
    </Sheet>
  )
}
