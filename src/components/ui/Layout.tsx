import { NavLink, Outlet } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Pamokos', icon: '◎' },
  { to: '/savokos', label: 'Sąvokos', icon: '≡' },
  { to: '/mintys', label: 'Mintys', icon: '✎' },
  { to: '/skaitiniai', label: 'Skaitiniai', icon: '❏' },
]

export function Layout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col">
      <main className="flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[640px] justify-around">
          {ITEMS.map(it => (
            <NavLink key={it.to} to={it.to} end={it.to === '/'}
              className={({ isActive }) => `flex min-w-[64px] flex-col items-center px-2 py-2 text-xs ${isActive ? 'text-accent' : 'text-muted'}`}>
              <span className="text-lg leading-none">{it.icon}</span>
              <span className="mt-1">{it.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
