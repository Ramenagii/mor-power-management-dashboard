import { SlidersHorizontal } from 'lucide-react'

export function PolicyPanel() {
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
