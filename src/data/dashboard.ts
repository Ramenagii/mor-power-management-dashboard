import type { EventLog, Outlet, Priority } from '../types/dashboard'

export const MAX_CAPACITY = 2200
export const WARNING_THRESHOLD = 1800
export const CRITICAL_THRESHOLD = 2000

export const baseOutlets: Outlet[] = [
  {
    id: 1,
    name: 'Outlet 1',
    role: 'Instructor workstation',
    meter: 'PZEM-01 + CT-01',
    relay: 'Relay CH1',
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
    meter: 'PZEM-02 + CT-02',
    relay: 'Relay CH2',
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
    meter: 'PZEM-03 + CT-03',
    relay: 'Relay CH3',
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
    meter: 'PZEM-04 + CT-04',
    relay: 'Relay CH4',
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
    meter: 'PZEM-05 + CT-05',
    relay: 'Relay CH5',
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
    meter: 'PZEM-06 + CT-06',
    relay: 'Relay CH6',
    priority: 'Low',
    allowance: 250,
    watts: 0,
    status: 'Disconnected',
    schedule: 'Authorized window',
    idleLimit: '10 min',
  },
]

export const initialEvents: EventLog[] = [
  {
    id: 1,
    time: '09:00',
    title: 'Dashboard synchronized',
    detail: 'Policies loaded for six outlets with dedicated PZEM meters, CTs, and relay channels.',
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

export const priorityRank: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}
