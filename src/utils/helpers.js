import { CYCLE_PHASES } from '../data/mockData'

/**
 * Determine the cycle phase for a given day/length.
 */
export function getCyclePhase(cycleDay, cycleLength = 28) {
  // Normalize day ranges proportionally if cycle isn't 28 days
  const ratio = cycleLength / 28

  const phases = [
    { key: 'menstrual', start: 1, end: Math.round(5 * ratio) },
    { key: 'follicular', start: Math.round(5 * ratio) + 1, end: Math.round(13 * ratio) },
    { key: 'ovulatory', start: Math.round(13 * ratio) + 1, end: Math.round(16 * ratio) },
    { key: 'luteal', start: Math.round(16 * ratio) + 1, end: cycleLength },
  ]

  for (const p of phases) {
    if (cycleDay >= p.start && cycleDay <= p.end) {
      return CYCLE_PHASES[p.key]
    }
  }
  return CYCLE_PHASES.luteal
}

/**
 * Generate mock energy data for the last 14 days.
 * Creates a realistic pattern based on cycle day.
 */
export function generateMockEnergyData(currentCycleDay) {
  const data = []
  for (let i = 13; i >= 0; i--) {
    let day = currentCycleDay - i
    if (day <= 0) day += 28

    // Simulate energy based on cycle phase
    let baseEnergy
    if (day >= 1 && day <= 5) baseEnergy = 35 // menstrual
    else if (day >= 6 && day <= 13) baseEnergy = 78 // follicular
    else if (day >= 14 && day <= 16) baseEnergy = 88 // ovulatory
    else baseEnergy = 42 // luteal

    // Add some natural variation
    const noise = Math.sin(day * 2.7) * 12 + Math.cos(day * 1.3) * 8
    const energy = Math.max(15, Math.min(100, Math.round(baseEnergy + noise)))

    data.push({
      day: `Day ${day}`,
      dayNum: day,
      energy,
      isCurrent: i === 0,
    })
  }
  return data
}

/**
 * Get a time-of-day greeting.
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Format a timestamp to a readable date.
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get the energy tier label for the planner.
 */
export function getEnergyTier(phase) {
  const tiers = {
    menstrual: { label: 'Rest', color: 'text-red-600', bg: 'bg-red-50' },
    follicular: { label: 'High', color: 'text-green-700', bg: 'bg-green-50' },
    ovulatory: { label: 'Peak', color: 'text-yellow-700', bg: 'bg-yellow-50' },
    luteal: { label: 'Lower', color: 'text-orange-700', bg: 'bg-orange-50' },
  }
  return tiers[phase] || tiers.luteal
}
