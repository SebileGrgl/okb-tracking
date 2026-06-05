import { Outlet, NavLink, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Plus, CheckSquare, BarChart2, User, ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import CrisisButton from '../features/crisis/CrisisButton'

interface NavItem {
  to: string
  label: string
  Icon: LucideIcon
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',        label: 'Ana Ekran', Icon: LayoutDashboard, exact: true },
  { to: '/kayit',   label: 'Kayıt',     Icon: Plus },
  { to: '/kontrol', label: 'Kontrol',   Icon: CheckSquare },
  { to: '/analiz',  label: 'Analiz',    Icon: BarChart2 },
  { to: '/profil',  label: 'Profil',    Icon: User },
]

function SidebarLink({ to, label, Icon, exact }: NavItem) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
        isActive
          ? 'bg-brand-50 text-brand-700'
          : 'text-gray-500 hover:bg-surface-tertiary hover:text-gray-700',
      )}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} />
          <span className="flex-1">{label}</span>
          {isActive && <ChevronRight size={14} className="text-brand-400" />}
        </>
      )}
    </NavLink>
  )
}

function BottomNavLink({ to, label, Icon, exact }: NavItem) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => cn(
        'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
        isActive ? 'text-brand-600' : 'text-gray-400',
      )}
    >
      <Icon size={21} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-surface-secondary">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 xl:w-64 shrink-0 border-r border-gray-100 bg-white sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">OKB Takip</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>
        <div className="px-3 pb-5">
          <div className="text-xs text-gray-300 px-3">v1.0</div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'flex-1 min-w-0',
          location.pathname !== '/kriz' && 'pb-16 md:pb-0',
        )}
      >
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30 shadow-nav">
        {NAV_ITEMS.map((item) => (
          <BottomNavLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Floating crisis button */}
      <CrisisButton />
    </div>
  )
}
