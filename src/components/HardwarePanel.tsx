import { Cable, Cpu, Plug, ShieldCheck, Zap } from 'lucide-react'

const hardwareItems = [
  {
    icon: <Plug />,
    label: 'Outlet channels',
    value: '6 sockets, 6 relays, 6 PZEM-004T v3.0 meters, 6 matched CTs',
  },
  {
    icon: <Cpu />,
    label: 'Controller',
    value: 'ESP32 DevKit / ESP32-WROOM-32 for local policy decisions and dashboard sync',
  },
  {
    icon: <Zap />,
    label: 'Low-voltage supply',
    value: 'Isolated 5 V AC-DC module such as Mean Well IRM-05-5',
  },
  {
    icon: <ShieldCheck />,
    label: 'Input support',
    value: 'Main switch, fuse or resettable breaker, MOV after fuse, and strain relief',
  },
  {
    icon: <Cable />,
    label: 'Distribution',
    value: 'Separate live, neutral, and earth busbars; earth remains continuous and unswitched',
  },
]

export function HardwarePanel() {
  return (
    <section className="panel hardware-panel">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Hardware design</p>
          <h2>Prototype architecture</h2>
        </div>
        <Cable size={20} />
      </div>
      <div className="hardware-list">
        {hardwareItems.map((item) => (
          <article key={item.label} className="hardware-item">
            <div className="hardware-icon">{item.icon}</div>
            <div>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="safe-note">
        Per-outlet CTs monitor only their assigned live branch. The prototype switches live through
        COM and NO relay contacts and does not replace certified electrical protection devices.
      </p>
    </section>
  )
}
