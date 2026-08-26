/**
 * Persistenz.
 *
 * Leitentscheidung E4: Der gesamte Zustand liegt als EIN JSON-Blob in
 * IndexedDB. Bei 1000 Brews sind das unter 500 KB — Lesen ist damit
 * effektiv synchron, Export ist trivial, und es gibt keine Migrationshölle
 * über mehrere Object Stores hinweg.
 *
 * Briefing C5: Safari löscht IndexedDB einer PWA nach 7 Tagen ohne Nutzung.
 * Die Historie IST das Produkt — deshalb ist Backup hier kein Extra.
 */
import { openDB, type IDBPDatabase } from 'idb'
import type { AppState } from '@/domain'
import { emptyState, DEFAULT_SETTINGS } from '@/domain'
import { SCHEMA_VERSION } from '@/config'

// ACHTUNG: Der Datenbankname bleibt 'dialed', obwohl die App inzwischen
// Café heißt. Eine Umbenennung würde eine NEUE, leere Datenbank anlegen und
// alle bisherigen Bohnen, Tüten und Protokolle verwaisen lassen. Der Name ist
// ein interner Schlüssel, kein Anzeigetext — er darf nie geändert werden.
const DB_NAME = 'dialed'
const DB_VERSION = 1
const STORE = 'state'
const KEY = 'app'

let dbPromise: Promise<IDBPDatabase> | null = null

function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE)
      },
    })
  }
  return dbPromise
}

export async function loadState(): Promise<AppState> {
  try {
    const d = await db()
    const raw = (await d.get(STORE, KEY)) as AppState | undefined
    if (!raw) return emptyState(SCHEMA_VERSION)
    return migrate(raw)
  } catch (e) {
    console.error('[persist] Laden fehlgeschlagen', e)
    return emptyState(SCHEMA_VERSION)
  }
}

let writeTimer: ReturnType<typeof setTimeout> | null = null
let pending: AppState | null = null

/** Gebündeltes Schreiben — die UI soll nie auf die Platte warten. */
export function saveState(state: AppState): void {
  pending = state
  if (writeTimer) clearTimeout(writeTimer)
  writeTimer = setTimeout(flush, 300)
}

export async function flush(): Promise<void> {
  if (!pending) return
  const snapshot = pending
  pending = null
  try {
    const d = await db()
    await d.put(STORE, snapshot, KEY)
  } catch (e) {
    console.error('[persist] Speichern fehlgeschlagen', e)
  }
}

/** Vor dem Schließen der App noch schnell wegschreiben. */
export function installFlushHandlers(): void {
  const handler = () => void flush()
  window.addEventListener('pagehide', handler)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handler()
  })
}

/**
 * Speicher als dauerhaft markieren. Ohne das räumt Safari nach 7 Tagen
 * Inaktivität auf — mitsamt der gesamten Lernbasis.
 */
export async function requestPersistence(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  try {
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function storageEstimate(): Promise<{ usedKb: number; quotaMb: number } | null> {
  if (!navigator.storage?.estimate) return null
  try {
    const e = await navigator.storage.estimate()
    return {
      usedKb: Math.round((e.usage ?? 0) / 1024),
      quotaMb: Math.round((e.quota ?? 0) / 1024 / 1024),
    }
  } catch {
    return null
  }
}

// ── Migration ─────────────────────────────────────────────────────────

function migrate(state: AppState): AppState {
  let s = state
  if (s.schemaVersion === undefined) s = { ...s, schemaVersion: 1 }

  // Schema 1 → 2: Der alte Standard war 'dark'. Wer die App nie umgestellt
  // hat, trägt diesen Wert nur, weil er einmal voreingestellt war — nicht
  // weil er gewählt wurde. Beim Wechsel auf die Kaffee-Palette wird er
  // deshalb einmalig auf den neuen Standard gesetzt. Eine bewusste
  // Entscheidung lässt sich mit einem Tipp wiederherstellen.
  if ((s.schemaVersion ?? 1) < 2) {
    s = { ...s, settings: { ...s.settings, theme: DEFAULT_SETTINGS.theme } }
  }

  // Vorversion kannte drei Detailstufen. Alles außer „basis" wird Pro.
  const legacy = (s.settings as unknown as { expertLevel?: string })?.expertLevel
  if (legacy && !(s.settings as { mode?: string }).mode) {
    s = {
      ...s,
      settings: { ...s.settings, mode: legacy === 'basis' ? 'basic' : 'pro' },
    }
  }
  // Künftige Migrationen hier, jeweils mit Versionssprung.
  const base = emptyState(SCHEMA_VERSION)
  return {
    ...base,
    ...s,
    settings: { ...base.settings, ...s.settings },
    learned: { ...base.learned, ...s.learned },
    schemaVersion: SCHEMA_VERSION,
  }
}

// ── Export / Import ───────────────────────────────────────────────────

export interface BackupFile {
  /** Seit der Umbenennung 'cafe'. Alte Sicherungen tragen 'dialed'. */
  app: 'cafe' | 'dialed'
  schemaVersion: number
  exportedAt: string
  state: AppState
}

export function buildBackup(state: AppState): BackupFile {
  return {
    app: 'cafe',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
}

export function backupFilename(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `cafe-backup-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`
}

export function parseBackup(text: string): { state: AppState } | { error: string } {
  try {
    const parsed = JSON.parse(text) as BackupFile
    // Beide Kennungen akzeptieren: Sicherungen von vor der Umbenennung
    // müssen sich weiterhin einspielen lassen.
    if ((parsed.app !== 'cafe' && parsed.app !== 'dialed') || !parsed.state)
      return { error: 'Das ist keine Café-Sicherung.' }
    return { state: migrate(parsed.state) }
  } catch {
    return { error: 'Die Datei ließ sich nicht lesen.' }
  }
}

/**
 * Sicherung teilen. In der iOS-Standalone-PWA sind `<a download>`-Links
 * unzuverlässig — die Share-API ist der verlässliche Weg, mit
 * Zwischenablage als Rückfallebene.
 */
export async function shareBackup(state: AppState): Promise<'shared' | 'copied' | 'downloaded'> {
  const json = JSON.stringify(buildBackup(state), null, 2)
  const name = backupFilename()

  const file = new File([json], name, { type: 'application/json' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Café — Sicherung' })
      return 'shared'
    } catch {
      /* Nutzer hat abgebrochen — auf die nächste Ebene fallen */
    }
  }

  try {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return 'downloaded'
  } catch {
    await navigator.clipboard.writeText(json)
    return 'copied'
  }
}
