import { useEffect, type ReactElement } from 'react'
import { useRouter, type Tab } from './router'
import { useStore } from './store'
import BrewScreen from './screens/BrewScreen'
import ShelfScreen from './screens/ShelfScreen'
import LogScreen from './screens/LogScreen'
import SetupScreen from './screens/SetupScreen'

const TABS: { id: Tab; label: string; icon: ReactElement }[] = [
  {
    id: 'brew',
    label: 'Brühen',
    icon: (
      <path
        d="M6 9h11a3 3 0 010 6h-1M6 9v5a5 5 0 005 5h0a5 5 0 005-5V9M6 9H5m1-4v1m4-1v1m4-1v1M4 21h14"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'shelf',
    label: 'Regal',
    icon: (
      <path
        d="M4 4h16v6H4V4zm0 10h16v6H4v-6zM8 4v6M14 14v6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'log',
    label: 'Logbuch',
    icon: (
      <path
        d="M5 4h11l3 3v13H5V4zm3 5h8M8 13h8M8 17h5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'setup',
    label: 'Setup',
    icon: (
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 008.9 19a1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 8.9a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

export default function App() {
  const { route, navigate, back } = useRouter()
  const ready = useStore((s) => s.ready)
  const hydrate = useStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!ready) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-crema" />
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col">
      <main className="scroll-area flex-1 overflow-y-auto">
        {route.tab === 'brew' && <BrewScreen route={route} navigate={navigate} back={back} />}
        {route.tab === 'shelf' && <ShelfScreen route={route} navigate={navigate} back={back} />}
        {route.tab === 'log' && <LogScreen route={route} navigate={navigate} back={back} />}
        {route.tab === 'setup' && <SetupScreen route={route} navigate={navigate} back={back} />}
      </main>

      <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-xl">
        <div className="flex">
          {TABS.map((t) => {
            const active = route.tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => navigate({ tab: t.id })}
                aria-current={active ? 'page' : undefined}
                className={`flex h-[54px] flex-1 flex-col items-center justify-center gap-1 ${active ? 'text-crema' : 'text-faint'}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  {t.icon}
                </svg>
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
