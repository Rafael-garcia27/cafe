/**
 * Mini-Router (~50 Zeilen statt 15 KB Bibliothek).
 *
 * Nutzt die History-API, damit die iOS-Zurück-Wischgeste funktioniert —
 * in der Standalone-PWA gibt es keine Browser-Zurück-Schaltfläche, die
 * Geste ist der einzige Weg zurück.
 */
import { useCallback, useEffect, useState } from 'react'

export type Tab = 'brew' | 'shelf' | 'log' | 'setup'

export interface Route {
  tab: Tab
  detail?: string
  id?: string
}

const TABS: Tab[] = ['brew', 'shelf', 'log', 'setup']

function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '')
  const [tab, detail, id] = clean.split('/')
  const t = (TABS as string[]).includes(tab ?? '') ? (tab as Tab) : 'brew'
  return { tab: t, detail: detail || undefined, id: id || undefined }
}

function stringify(r: Route): string {
  let s = `#/${r.tab}`
  if (r.detail) s += `/${r.detail}`
  if (r.id) s += `/${r.id}`
  return s
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onPop = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onPop)
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('hashchange', onPop)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  const navigate = useCallback((r: Route, replace = false) => {
    const h = stringify(r)
    if (replace) window.history.replaceState(null, '', h)
    else window.history.pushState(null, '', h)
    setRoute(r)
  }, [])

  const back = useCallback(() => window.history.back(), [])

  return { route, navigate, back }
}
