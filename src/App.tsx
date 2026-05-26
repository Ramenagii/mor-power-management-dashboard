import { useState, type ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Gauge,
  History,
  PlugZap,
  Power,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'

type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
type OutletStatus = 'Active' | 'Standby' | 'Restricted' | 'Disconnected'
type Severity = 'info' | 'success' | 'warning' | 'critical'

type Outlet = {
  id: number
  name: string
  role: string
  priority: Priority
  allowance: number
  watts: number
  status: OutletStatus
  schedule: string
  idleLimit: string
}

type EventLog = {
  id: number
  time: string
  title: string
  detail: string
  severity: Severity
}

const MAX_CAPACITY = 2200
const WARNING_THRESHOLD = 1800
const CRITICAL_THRESHOLD = 2000

const baseOutlets: Outlet[] = [
  {
    id: 1,
    name: 'Outlet 1',
    role: 'Instructor workstation',
    priority: 'Critical',
    allowance: 500,
    watts: 430,
    status: 'Active',
    schedule: 'Class hours + override',
    idleLimit: 'Exempt',
  },
  {
    id: 2,
    name: 'Outlet 2',
    role: 'Demo equipment',
    priority: 'High',
    allowance: 500,
    watts: 360,
    status: 'Active',
    schedule: '08:00-18:00',
    idleLimit: '20 min',
  },
  {
    id: 3,
    name: 'Outlet 3',
    role: 'Lab instrument',
    priority: 'High',
    allowance: 450,
    watts: 280,
    status: 'Active',
    schedule: '08:00-18:00',
    idleLimit: '20 min',
  },
  {
    id: 4,
    name: 'Outlet 4',
    role: 'Student workstation',
    priority: 'Medium',
    allowance: 300,
    watts: 210,
    status: 'Active',
    schedule: 'Class hours',
    idleLimit: '15 min',
  },
  {
    id: 5,
    name: 'Outlet 5',
    role: 'Student charging',
    priority: 'Low',
    allowance: 200,
    watts: 70,
    status: 'Standby',
    schedule: 'Class hours',
    idleLimit: '10 min',
  },
  {
    id: 6,
    name: 'Outlet 6',
    role: 'General-use device',
    priority: 'Low',
    allowance: 250,
    watts: 0,
    status: 'Disconnected',
    schedule: 'Authorized window',
    idleLimit: '10 min',
  },
]

const initialEvents: EventLog[] = [
  {
    id: 1,
    time: '09:00',
    title: 'Dashboard synchronized',
    detail: 'Policies loaded for six controlled outlets.',
    severity: 'info',
  },
  {
    id: 2,
    time: '09:01',
    title: 'Normal operating state',
    detail: 'Total load is below warning threshold.',
    severity: 'success',
  },
]

const priorityRank: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

function getTimeStamp() {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

function formatWatts(value: number) {
  return `${Math.round(value).toLocaleString()} W`
}

function totalLoad(outlets: Outlet[]) {
  return outlets.reduce((sum, outlet) => sum + outlet.watts, 0)
}

function systemState(load: number) {
  if (load >= CRITICAL_THRESHOLD) return 'Critical'
  if (load >= WARNING_THRESHOLD) return 'Warning'
  return 'Normal'
}

function statusClass(status: OutletStatus) {
  return status.toLowerCase()
}

function severityIcon(severity: Severity) {
  if (severity === 'success') return <CheckCircle2 size={16} />
  if (severity === 'warning') return <AlertTriangle size={16} />
  if (severity === 'critical') return <Zap size={16} />
  return <Bell size={16} />
}

function App() {
  const [outlets, setOutlets] = useState<Outlet[]>(baseOutlets)
  const [events, setEvents] = useState<EventLog[]>(initialEvents)

  const load = totalLoad(outlets)
  const remaining = Math.max(MAX_CAPACITY - load, 0)
  const activeCount = outlets.filter((outlet) => outlet.status === 'Active').length
  const currentState = systemState(load)
  const loadPercent = Math.min((load / MAX_CAPACITY) * 100, 100)

  const addEvent = (title: string, detail: string, severity: Severity = 'info') => {
    setEvents((current) => [
      {
        id: Date.now(),
        time: getTimeStamp(),
        title,
        detail,
        severity,
      },
      ...current,
    ])
  }

  const resetNormal = () => {
    setOutlets(baseOutlets)
    setEvents([
      {
        id: Date.now(),
        time: getTimeStamp(),
        title: 'Scenario reset',
        detail: 'Baseline simulated laboratory load restored.',
        severity: 'success',
      },
      ...initialEvents,
    ])
  }

  const requestActivation = () => {
    const requested = outlets.find((outlet) => outlet.id === 6)
    if (!requested) return

    const projectedLoad = load + requested.allowance
    if (projectedLoad > CRITICAL_THRESHOLD) {
      addEvent(
        'Activation blocked',
        `Outlet 6 request denied: ${formatWatts(load)} current load + ${formatWatts(
          requested.allowance,
        )} allowance exceeds the configured critical threshold.`,
        'warning',
      )
      return
    }

    setOutlets((current) =>
      current.map((outlet) =>
        outlet.id === 6
          ? { ...outlet, status: 'Active', watts: 190 }
          : outlet,
      ),
    )
    addEvent(
      'Outlet activation allowed',
      'Pre-activation capacity assessment passed; Outlet 6 relay energized.',
      'success',
    )
  }

  const blockInsufficientCapacity = () => {
    setOutlets((current) =>
      current.map((outlet) => {
        if (outlet.id === 1) return { ...outlet, watts: 520, status: 'Active' }
        if (outlet.id === 2) return { ...outlet, watts: 500, status: 'Active' }
        if (outlet.id === 3) return { ...outlet, watts: 420, status: 'Active' }
        if (outlet.id === 4) return { ...outlet, watts: 330, status: 'Active' }
        if (outlet.id === 5) return { ...outlet, watts: 150, status: 'Active' }
        return { ...outlet, watts: 0, status: 'Restricted' }
      }),
    )
    addEvent(
      'Pre-activation restriction',
      'A new low-priority outlet request was restricted because projected load would exceed the configured threshold.',
      'warning',
    )
  }

  const postActivationOverload = () => {
    setOutlets((current) =>
      current.map((outlet) => {
        if (outlet.id === 6) return { ...outlet, watts: 460, status: 'Active' }
        if (outlet.id === 5) return { ...outlet, watts: 160, status: 'Active' }
        return outlet.status === 'Disconnected' ? { ...outlet, status: 'Standby' } : outlet
      }),
    )
    addEvent(
      'Post-activation verification failed',
      'Measured outlet load exceeded the expected allowance after relay activation.',
      'critical',
    )
  }

  const selectiveResponse = () => {
    const lowPriority = outlets
      .filter((outlet) => outlet.status === 'Active')
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
      .slice(0, 2)
      .map((outlet) => outlet.id)

    setOutlets((current) =>
      current.map((outlet) =>
        lowPriority.includes(outlet.id)
          ? { ...outlet, status: 'Disconnected', watts: 0 }
          : outlet,
      ),
    )
    addEvent(
      'Selective load response applied',
      'Low-priority outlets were disconnected first while high-priority outlets remained active when possible.',
      'critical',
    )
  }

  const idleShutdown = () => {
    setOutlets((current) =>
      current.map((outlet) =>
        outlet.status === 'Standby' || outlet.watts <= 80
          ? { ...outlet, status: 'Disconnected', watts: 0 }
          : outlet,
      ),
    )
    addEvent(
      'Idle/standby policy enforced',
      'Persistent low-load outlet activity was disconnected according to the configured idle threshold.',
      'info',
    )
  }

  const toggleOutlet = (id: number) => {
    const outlet = outlets.find((item) => item.id === id)
    if (!outlet) return

    if (outlet.status === 'Active') {
      setOutlets((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: 'Disconnected', watts: 0 } : item,
        ),
      )
      addEvent('Manual relay action', `${outlet.name} was disconnected from the dashboard.`, 'info')
      return
    }

    const projectedLoad = load + outlet.allowance
    if (projectedLoad > CRITICAL_THRESHOLD) {
      addEvent(
        'Manual activation blocked',
        `${outlet.name} was restricted because projected load exceeds the configured threshold.`,
        'warning',
      )
      return
    }

    setOutlets((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: 'Active', watts: Math.max(90, Math.round(item.allowance * 0.72)) }
          : item,
      ),
    )
    addEvent('Manual relay action', `${outlet.name} was activated after capacity assessment.`, 'success')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Shared Laboratory Power Management</p>
          <h1>Power Management Console</h1>
        </div>
        <div className={`system-pill ${currentState.toLowerCase()}`}>
          <Activity size={18} />
          {currentState}
        </div>
      </header>

      <section className="overview-grid" aria-label="System overview">
        <MetricCard
          icon={<Gauge />}
          label="Total load"
          value={formatWatts(load)}
          note={`${Math.round(loadPercent)}% of 2,200 W capacity`}
        />
        <MetricCard
          icon={<ShieldCheck />}
          label="Remaining capacity"
          value={formatWatts(remaining)}
          note={`${formatWatts(WARNING_THRESHOLD)} warning / ${formatWatts(CRITICAL_THRESHOLD)} critical`}
        />
        <MetricCard
          icon={<PlugZap />}
          label="Active outlets"
          value={`${activeCount}/6`}
          note="Individually controlled relay channels"
        />
        <MetricCard
          icon={<Cpu />}
          label="Controller mode"
          value="Edge"
          note="ESP32 local decision simulation"
        />
      </section>

      <section className="load-panel" aria-label="Load capacity meter">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Real-time load condition</p>
            <h2>Capacity and thresholds</h2>
          </div>
          <span>{formatWatts(load)} / {formatWatts(MAX_CAPACITY)}</span>
        </div>
        <div className="meter" aria-label="Total load usage">
          <div className="warning-mark" />
          <div className="critical-mark" />
          <div className={`meter-fill ${currentState.toLowerCase()}`} style={{ width: `${loadPercent}%` }} />
        </div>
        <div className="threshold-row">
          <span>Normal</span>
          <span>Warning: {formatWatts(WARNING_THRESHOLD)}</span>
          <span>Critical: {formatWatts(CRITICAL_THRESHOLD)}</span>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="outlet-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Outlet-level monitoring</p>
              <h2>Six controlled outlets</h2>
            </div>
          </div>
          <div className="outlet-grid">
            {outlets.map((outlet) => (
              <OutletCard key={outlet.id} outlet={outlet} onToggle={toggleOutlet} />
            ))}
          </div>
        </div>

        <aside className="side-stack">
          <PolicyPanel />
          <ScenarioPanel
            onNormal={resetNormal}
            onActivate={requestActivation}
            onBlock={blockInsufficientCapacity}
            onOverload={postActivationOverload}
            onSelective={selectiveResponse}
            onIdle={idleShutdown}
          />
        </aside>
      </section>

      <section className="event-panel" aria-label="Event log and notifications">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Output actions</p>
            <h2>Event log and notifications</h2>
          </div>
          <History size={20} />
        </div>
        <div className="event-list">
          {events.slice(0, 8).map((event) => (
            <article className={`event-item ${event.severity}`} key={event.id}>
              <div className="event-icon">{severityIcon(event.severity)}</div>
              <div>
                <div className="event-title-row">
                  <h3>{event.title}</h3>
                  <time>{event.time}</time>
                </div>
                <p>{event.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode
  label: string
  value: string
  note: string
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </article>
  )
}

function OutletCard({
  outlet,
  onToggle,
}: {
  outlet: Outlet
  onToggle: (id: number) => void
}) {
  const percent = Math.min((outlet.watts / outlet.allowance) * 100, 100)

  return (
    <article className={`outlet-card ${statusClass(outlet.status)}`}>
      <div className="outlet-header">
        <div>
          <h3>{outlet.name}</h3>
          <p>{outlet.role}</p>
        </div>
        <span className={`status-badge ${statusClass(outlet.status)}`}>{outlet.status}</span>
      </div>
      <div className="outlet-reading">
        <strong>{formatWatts(outlet.watts)}</strong>
        <span>Allowance {formatWatts(outlet.allowance)}</span>
      </div>
      <div className="mini-meter">
        <div style={{ width: `${percent}%` }} />
      </div>
      <dl className="outlet-meta">
        <div>
          <dt>Priority</dt>
          <dd>{outlet.priority}</dd>
        </div>
        <div>
          <dt>Schedule</dt>
          <dd>{outlet.schedule}</dd>
        </div>
        <div>
          <dt>Idle limit</dt>
          <dd>{outlet.idleLimit}</dd>
        </div>
      </dl>
      <button type="button" className="icon-button" onClick={() => onToggle(outlet.id)}>
        <Power size={16} />
        {outlet.status === 'Active' ? 'Disconnect' : 'Request activation'}
      </button>
    </article>
  )
}

function PolicyPanel() {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Configured policy</p>
          <h2>Usage rules</h2>
        </div>
        <SlidersHorizontal size={20} />
      </div>
      <ul className="policy-list">
        <li>
          <span>Authority</span>
          <strong>Lab personnel</strong>
        </li>
        <li>
          <span>Capacity check</span>
          <strong>Current load + outlet allowance</strong>
        </li>
        <li>
          <span>Verification</span>
          <strong>Measured load after activation</strong>
        </li>
        <li>
          <span>Response order</span>
          <strong>Low priority first</strong>
        </li>
      </ul>
      <p className="safe-note">
        Prototype-level abnormal/excessive load response only. This does not replace certified
        protection devices.
      </p>
    </section>
  )
}

function ScenarioPanel({
  onNormal,
  onActivate,
  onBlock,
  onOverload,
  onSelective,
  onIdle,
}: {
  onNormal: () => void
  onActivate: () => void
  onBlock: () => void
  onOverload: () => void
  onSelective: () => void
  onIdle: () => void
}) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Defense demo</p>
          <h2>Scenario controls</h2>
        </div>
        <ClipboardList size={20} />
      </div>
      <div className="scenario-grid">
        <button type="button" onClick={onNormal}>
          <RotateCcw size={16} />
          Normal operation
        </button>
        <button type="button" onClick={onActivate}>
          <CheckCircle2 size={16} />
          Activate request
        </button>
        <button type="button" onClick={onBlock}>
          <AlertTriangle size={16} />
          Capacity block
        </button>
        <button type="button" onClick={onOverload}>
          <Zap size={16} />
          Post-activation overload
        </button>
        <button type="button" onClick={onSelective}>
          <ShieldCheck size={16} />
          Selective response
        </button>
        <button type="button" onClick={onIdle}>
          <Power size={16} />
          Idle shutdown
        </button>
      </div>
    </section>
  )
}

export default App
