import { useEffect, useState } from 'react'
import { Activity, Gauge, PlugZap, ScanLine, ShieldCheck } from 'lucide-react'
import { EventLogPanel } from './components/EventLogPanel'
import { HardwarePanel } from './components/HardwarePanel'
import { LoadingScreen } from './components/LoadingScreen'
import { MetricCard } from './components/MetricCard'
import { OutletCard } from './components/OutletCard'
import { PolicyPanel } from './components/PolicyPanel'
import { ScenarioPanel } from './components/ScenarioPanel'
import {
  baseOutlets,
  CRITICAL_THRESHOLD,
  initialEvents,
  MAX_CAPACITY,
  priorityRank,
  WARNING_THRESHOLD,
} from './data/dashboard'
import type { EventLog, Outlet, Severity } from './types/dashboard'
import { formatWatts, getTimeStamp, systemState, totalLoad } from './utils/dashboard'

function App() {
  const [outlets, setOutlets] = useState<Outlet[]>(baseOutlets)
  const [events, setEvents] = useState<EventLog[]>(initialEvents)
  const [introDone, setIntroDone] = useState(false)
  const [introKey, setIntroKey] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 3600)
    return () => window.clearTimeout(timer)
  }, [introKey])

  useEffect(() => {
    document.body.classList.toggle('intro-active', !introDone)
    return () => document.body.classList.remove('intro-active')
  }, [introDone])

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
        outlet.id === 6 ? { ...outlet, status: 'Active', watts: 190 } : outlet,
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

  const replayIntro = () => {
    setIntroDone(false)
    setIntroKey((current) => current + 1)
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
    <>
      <LoadingScreen key={introKey} isLeaving={introDone} />
      <main className={`app-shell ${introDone ? 'is-ready' : 'is-waiting'}`}>
        <header className="topbar">
          <div>
            <p className="eyebrow">Shared Laboratory Power Management</p>
            <h1>Power Management Console</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="replay-button" onClick={replayIntro}>
              Replay intro
            </button>
            <div className={`system-pill ${currentState.toLowerCase()}`}>
              <Activity size={18} />
              {currentState}
            </div>
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
            note="Six relay-switched outlet channels"
          />
          <MetricCard
            icon={<ScanLine />}
            label="Metering channels"
            value="6"
            note="One PZEM-004T v3.0 + CT per outlet"
          />
        </section>

        <section className="load-panel" aria-label="Load capacity meter">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Real-time load condition</p>
              <h2>Capacity and thresholds</h2>
            </div>
            <span>
              {formatWatts(load)} / {formatWatts(MAX_CAPACITY)}
            </span>
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
            <HardwarePanel />
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

        <EventLogPanel events={events} />
      </main>
    </>
  )
}

export default App
