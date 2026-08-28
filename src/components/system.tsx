/**
 * Systemnahe Hinweise: Installation, Datensicherung, Erststart.
 *
 * Briefing F3: iOS kennt kein `beforeinstallprompt` — die Installation muss
 * erklärt werden, sie lässt sich nicht auslösen.
 * Briefing C5: Ohne Sicherung ist die Historie einen Safari-Aufräumlauf
 * entfernt. Die Erinnerung gehört dorthin, wo der Nutzer täglich hinsieht.
 */
import { useEffect, useState } from 'react'
import { Card, Button } from './ui'
import { useStore, selectSnapshot } from '@/store'
import { shareBackup } from '@/store/persist'
import { BACKUP_REMINDER_DAYS, APP_NAME } from '@/config'

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** Anleitung zum Ablegen auf dem Home-Bildschirm */
export function InstallGuide() {
  if (isStandalone()) {
    return (
      <Card>
        <p className="text-[15px]">
          <span className="text-ok">✓</span> Als App installiert.
        </p>
        <p className="mt-1 text-[13px] text-mute">
          Läuft im Vollbild und funktioniert ohne Netz.
        </p>
      </Card>
    )
  }

  return (
    <Card tone="accent">
      <p className="font-medium">Auf dem Home-Bildschirm ablegen</p>
      {isIOS() ? (
        <ol className="mt-3 space-y-2 text-[14px] leading-snug">
          <li className="flex gap-2">
            <span className="text-crema">1.</span>
            <span>
              In Safari unten auf <strong>Teilen</strong> tippen (Quadrat mit Pfeil nach oben)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-crema">2.</span>
            <span>
              Nach unten wischen zu <strong>Zum Home-Bildschirm</strong>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-crema">3.</span>
            <span>
              Oben rechts <strong>Hinzufügen</strong>
            </span>
          </li>
        </ol>
      ) : (
        <p className="mt-2 text-[14px] leading-snug text-mute">
          Im Browsermenü „Zum Startbildschirm hinzufügen" oder „App installieren" wählen.
        </p>
      )}
      <p className="mt-3 border-t border-line pt-3 text-[13px] leading-relaxed text-mute">
        Danach startet {APP_NAME} im Vollbild, ohne Adressleiste, und funktioniert vollständig
        ohne Internet. Das ist nicht nur Kosmetik: Nur als installierte App bleiben die
        Daten zuverlässig erhalten.
      </p>
    </Card>
  )
}

/**
 * Erinnerung an die Sicherung. Erscheint erst, wenn es etwas zu verlieren gibt —
 * eine Warnung ohne Daten wäre nur Lärm.
 */
export function BackupBanner() {
  const brews = useStore((s) => s.brews)
  const lastBackupAt = useStore((s) => s.settings.lastBackupAt)
  const setSettings = useStore((s) => s.setSettings)
  const [dismissed, setDismissed] = useState(false)
  const [busy, setBusy] = useState(false)

  const days = lastBackupAt
    ? Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 86_400_000)
    : null
  const overdue = brews.length >= 5 && (days === null || days > BACKUP_REMINDER_DAYS)

  if (!overdue || dismissed) return null

  return (
    <div className="px-4 pt-4">
      <Card tone="warn">
        <p className="text-[15px] leading-snug">
          {brews.length} Durchgänge ungesichert. iOS löscht die Daten einer PWA nach
          längerer Nichtnutzung — dann ist alles Gelernte weg.
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              await shareBackup(selectSnapshot(useStore.getState()))
              setSettings({ lastBackupAt: new Date().toISOString() })
              setBusy(false)
            }}
          >
            Jetzt sichern
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            Später
          </Button>
        </div>
      </Card>
    </div>
  )
}

/** Erststart: was fehlt noch, damit die App gut arbeiten kann? */
export function SetupNudge({ onGrinder }: { onGrinder: () => void }) {
  const grinders = useStore((s) => s.grinders)
  const brews = useStore((s) => s.brews)
  const [dismissed, setDismissed] = useState(false)

  if (grinders.length > 0 || dismissed || brews.length > 2) return null

  return (
    <div className="px-4 pt-4">
      <Card tone="accent">
        <p className="text-[15px] leading-snug">
          <strong>Noch keine Mühle eingerichtet.</strong> Mit ihr werden aus Empfehlungen
          konkrete Klickzahlen statt Prozentangaben.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={onGrinder}>
            Mühle wählen
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            Später
          </Button>
        </div>
      </Card>
    </div>
  )
}

/** Aktualisierung des Service Workers sichtbar machen */
export function UpdateToast() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const onUpdate = () => setReady(true)
    navigator.serviceWorker.addEventListener('controllerchange', onUpdate)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onUpdate)
  }, [])

  if (!ready) return null
  return (
    <div className="pb-safe fixed inset-x-4 bottom-24 z-40 rounded-2xl border border-line bg-raised px-4 py-3">
      <p className="text-[14px]">Neue Version geladen.</p>
    </div>
  )
}
