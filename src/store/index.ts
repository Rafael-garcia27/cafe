/**
 * Zustandsverwaltung.
 *
 * Der Store hält Daten und ruft die Engine — er enthält selbst keine
 * Kaffeelogik. Alles Fachliche liegt in `src/engine/` und ist ohne Browser
 * testbar (Solution Design §4).
 */
import { create } from 'zustand'
import type { AppState, Settings, ExpertLevel } from '@/domain'
import type { Bean, Bag, Brew, Grinder, Water, BrewMethod } from '@domain'
import { emptyState } from '@/domain'
import { SCHEMA_VERSION } from '@/config'
import { loadState, saveState, flush } from './persist'
import { recompute } from '@/engine/learn'

export const uid = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const nowIso = () => new Date().toISOString()

interface StoreActions {
  hydrate: () => Promise<void>

  addBean: (b: Omit<Bean, 'id' | 'createdAt'>) => string
  updateBean: (id: string, patch: Partial<Bean>) => void
  deleteBean: (id: string) => void

  addBag: (b: Omit<Bag, 'id' | 'createdAt' | 'depleted'>) => string
  updateBag: (id: string, patch: Partial<Bag>) => void
  deleteBag: (id: string) => void

  addBrew: (b: Omit<Brew, 'id' | 'createdAt'>) => string
  updateBrew: (id: string, patch: Partial<Brew>) => void
  deleteBrew: (id: string) => void
  setBestBrew: (id: string) => void

  addGrinder: (g: Omit<Grinder, 'id'>) => string
  updateGrinder: (id: string, patch: Partial<Grinder>) => void
  deleteGrinder: (id: string) => void

  upsertWater: (w: Water) => void

  setSettings: (patch: Partial<Settings>) => void
  setExpertLevel: (l: ExpertLevel) => void
  setTheme: (t: 'dark' | 'light') => void

  replaceState: (s: AppState) => void
  resetAll: () => void
}

export type Store = AppState & { ready: boolean } & StoreActions

/** Nach jeder Datenänderung die Lernmodelle neu rechnen und persistieren. */
function commit(set: (fn: (s: Store) => Partial<Store>) => void, relearn = true) {
  set((s) => {
    const learned = relearn
      ? recompute(s.brews, s.beans, s.bags, new Date())
      : s.learned
    const next: AppState = {
      schemaVersion: s.schemaVersion,
      beans: s.beans,
      bags: s.bags,
      brews: s.brews,
      grinders: s.grinders,
      setups: s.setups,
      waters: s.waters,
      settings: s.settings,
      learned,
    }
    saveState(next)
    return { learned }
  })
}

export const useStore = create<Store>((set) => ({
  ...emptyState(SCHEMA_VERSION),
  ready: false,

  hydrate: async () => {
    const s = await loadState()
    set({ ...s, ready: true })
    document.documentElement.classList.toggle('light', s.settings.theme === 'light')
  },

  // ── Bohnen ──
  addBean: (b) => {
    const id = uid()
    set((s) => ({ beans: [...s.beans, { ...b, id, createdAt: nowIso() }] }))
    commit(set, false)
    return id
  },
  updateBean: (id, patch) => {
    set((s) => ({ beans: s.beans.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
    commit(set)
  },
  deleteBean: (id) => {
    set((s) => ({
      beans: s.beans.filter((x) => x.id !== id),
      bags: s.bags.filter((x) => x.beanId !== id),
      brews: s.brews.filter((x) => x.beanId !== id),
    }))
    commit(set)
  },

  // ── Tüten ──
  addBag: (b) => {
    const id = uid()
    set((s) => ({ bags: [...s.bags, { ...b, id, depleted: false, createdAt: nowIso() }] }))
    commit(set, false)
    return id
  },
  updateBag: (id, patch) => {
    set((s) => ({ bags: s.bags.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
    commit(set)
  },
  deleteBag: (id) => {
    set((s) => ({
      bags: s.bags.filter((x) => x.id !== id),
      brews: s.brews.filter((x) => x.bagId !== id),
    }))
    commit(set)
  },

  // ── Brews ──
  addBrew: (b) => {
    const id = uid()
    set((s) => {
      // Restmenge der Tüte automatisch verringern
      const bags = s.bags.map((bag) =>
        bag.id === b.bagId && bag.remainingGrams !== undefined
          ? {
              ...bag,
              remainingGrams: Math.max(0, Math.round((bag.remainingGrams - b.actual.doseG) * 10) / 10),
              depleted: bag.remainingGrams - b.actual.doseG <= 0,
            }
          : bag,
      )
      return {
        brews: [{ ...b, id, createdAt: nowIso() }, ...s.brews],
        bags,
        settings: { ...s.settings, lastBeanId: b.beanId, lastMethod: b.method },
      }
    })
    commit(set)
    return id
  },
  updateBrew: (id, patch) => {
    set((s) => ({ brews: s.brews.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
    commit(set)
  },
  deleteBrew: (id) => {
    set((s) => ({ brews: s.brews.filter((x) => x.id !== id) }))
    commit(set)
  },
  setBestBrew: (id) => {
    set((s) => {
      const target = s.brews.find((b) => b.id === id)
      if (!target) return {}
      return {
        brews: s.brews.map((b) =>
          b.beanId === target.beanId && b.method === target.method
            ? { ...b, isBest: b.id === id }
            : b,
        ),
      }
    })
    commit(set)
  },

  // ── Mühlen ──
  addGrinder: (g) => {
    const id = uid()
    set((s) => ({
      grinders: [...s.grinders, { ...g, id }],
      settings: s.settings.activeGrinderId ? s.settings : { ...s.settings, activeGrinderId: id },
    }))
    commit(set, false)
    return id
  },
  updateGrinder: (id, patch) => {
    set((s) => ({ grinders: s.grinders.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
    commit(set, false)
  },
  deleteGrinder: (id) => {
    set((s) => ({
      grinders: s.grinders.filter((x) => x.id !== id),
      settings:
        s.settings.activeGrinderId === id
          ? { ...s.settings, activeGrinderId: undefined }
          : s.settings,
    }))
    commit(set, false)
  },

  upsertWater: (w) => {
    set((s) => ({
      waters: s.waters.some((x) => x.id === w.id)
        ? s.waters.map((x) => (x.id === w.id ? w : x))
        : [...s.waters, w],
      settings: { ...s.settings, activeWaterId: w.id },
    }))
    commit(set, false)
  },

  // ── Einstellungen ──
  setSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
    commit(set, false)
  },
  setExpertLevel: (l) => {
    set((s) => ({ settings: { ...s.settings, expertLevel: l } }))
    commit(set, false)
  },
  setTheme: (t) => {
    document.documentElement.classList.toggle('light', t === 'light')
    set((s) => ({ settings: { ...s.settings, theme: t } }))
    commit(set, false)
  },

  replaceState: (s) => {
    set({ ...s, ready: true })
    document.documentElement.classList.toggle('light', s.settings.theme === 'light')
    commit(set)
  },
  resetAll: () => {
    set({ ...emptyState(SCHEMA_VERSION), ready: true })
    commit(set)
  },
}))

export { flush }

// ── Selektoren ────────────────────────────────────────────────────────

export const selectBean = (id?: string) => (s: Store) => s.beans.find((b) => b.id === id)

export const selectBagsForBean = (beanId: string) => (s: Store) =>
  s.bags.filter((b) => b.beanId === beanId).sort((a, b) => (a.depleted ? 1 : 0) - (b.depleted ? 1 : 0))

export const selectActiveBag = (beanId: string) => (s: Store) =>
  s.bags
    .filter((b) => b.beanId === beanId && !b.depleted)
    .sort((a, b) => (b.roastDate ?? '').localeCompare(a.roastDate ?? ''))[0]

export const selectBeanHistory = (beanId: string, method: BrewMethod) => (s: Store) =>
  s.brews
    .filter((b) => b.beanId === beanId && b.method === method)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const selectMethodHistory = (method: BrewMethod) => (s: Store) =>
  s.brews.filter((b) => b.method === method).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const selectActiveGrinder = (s: Store) =>
  s.grinders.find((g) => g.id === s.settings.activeGrinderId)

export const selectActiveWater = (s: Store) =>
  s.waters.find((w) => w.id === s.settings.activeWaterId)

/**
 * ACHTUNG: Kein Selektor für `useStore(...)`.
 * Erzeugt bei jedem Aufruf ein neues Objekt — als Hook-Selektor verwendet
 * führt das zu einer Render-Endlosschleife. Immer über
 * `selectSnapshot(useStore.getState())` aufrufen.
 */
export const selectSnapshot = (s: Store): AppState => ({
  schemaVersion: s.schemaVersion,
  beans: s.beans,
  bags: s.bags,
  brews: s.brews,
  grinders: s.grinders,
  setups: s.setups,
  waters: s.waters,
  settings: s.settings,
  learned: s.learned,
})
