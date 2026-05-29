import { Cpu, LayoutDashboard, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AppView } from '../types/dashboard'

const menuItems: Array<{
  id: AppView
  label: string
  icon: ReactNode
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'policies', label: 'Policies', icon: <SlidersHorizontal size={16} /> },
  { id: 'hardware', label: 'Hardware Components', icon: <Cpu size={16} /> },
]

type ViewMenuProps = {
  activeView: AppView
  onChange: (view: AppView) => void
}

export function ViewMenu({ activeView, onChange }: ViewMenuProps) {
  return (
    <nav className="view-menu" aria-label="Loadwise sections">
      {menuItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activeView === item.id ? 'active' : ''}
          aria-current={activeView === item.id ? 'page' : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  )
}
