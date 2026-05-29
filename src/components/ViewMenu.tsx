import { Cpu, LayoutDashboard, SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const activeLabel = menuItems.find((item) => item.id === activeView)?.label ?? 'Dashboard'

  const selectView = (view: AppView) => {
    onChange(view)
    setIsOpen(false)
  }

  return (
    <nav className={`view-menu ${isOpen ? 'open' : ''}`} aria-label="Loadwise sections">
      <div className="menu-current">
        <span>Menu</span>
        <strong>{activeLabel}</strong>
      </div>
      <button
        type="button"
        className="hamburger-button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="loadwise-menu-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="menu-panel" id="loadwise-menu-panel">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeView === item.id ? 'active' : ''}
            aria-current={activeView === item.id ? 'page' : undefined}
            onClick={() => selectView(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
