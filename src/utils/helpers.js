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

const PHASE_PREDICTIONS = {
  menstrual: {
    label: 'Menstrual',
    color: '#EF9A9A',
    titles: ['Rest & Restore', 'Low & Slow', 'Inner Rest', 'Blood Flow', 'Gentle Day', 'Ease Up', 'Recovery'],
    messages: [
      'Day 1 — cramps and fatigue are common today. Heat packs and magnesium can ease discomfort.',
      'Day 2 — flow is often heaviest now. Hydrate well and keep activity gentle.',
      'Day 3 — inflammation peaks mid-bleed. Anti-inflammatory foods like ginger and turmeric help.',
      'Day 4 — the worst usually passes here. Light walking can lift mood without draining reserves.',
      'Day 5 — energy starts a slow return. Iron-rich meals will speed that along.',
      'Winding down — lighter flow expected. You can start reintroducing some structure.',
      'Last menstrual day — estrogen is beginning to climb. Tomorrow feels brighter.',
    ],
  },
  follicular: {
    label: 'Follicular',
    color: '#A5D6A7',
    titles: ['Rising Energy', 'Build Mode', 'Sharp Focus', 'Creative Surge', 'High Drive', 'Momentum', 'Peak Approach'],
    messages: [
      'Estrogen begins its climb — you may notice a lift in mood and lighter sleep.',
      'Cognitive sharpness improves today. Good day for learning or tackling a backlog.',
      'Social confidence rising — great window for meetings, pitches, or hard conversations.',
      'Physical strength is building up. Strength training shows the best results now.',
      'Motivation is near its monthly high. Set ambitious goals while momentum is on your side.',
      'Creativity is peaking in this phase. Brainstorming and new projects flow more easily.',
      'Approaching ovulation — energy and libido are close to their monthly maximum.',
    ],
  },
  ovulatory: {
    label: 'Ovulatory',
    color: '#FFD54F',
    titles: ['Peak Power', 'High Output', 'Social Peak', 'Full Energy', 'Max Drive'],
    messages: [
      'Estrogen and testosterone peak together — expect your highest energy and sharpest mind today.',
      'Communication and charisma are at a monthly high. Lean into social or collaborative work.',
      'Physical performance is optimal. This is your best window for high-intensity workouts.',
      'Confidence and decisiveness are strong — ideal for negotiations or important decisions.',
      'Peak fertility window. Energy may feel almost limitless, but rest is still valuable.',
    ],
  },
  luteal: {
    label: 'Luteal',
    color: '#FFCC80',
    titles: ['Wind Down', 'Slow Burn', 'Steady Pace', 'Inward Turn', 'Rest Prep', 'PMS Watch', 'Pre-Cycle'],
    messages: [
      'Progesterone rising — body temperature is slightly up and reservoirs are being tapped.',
      'Focus can still be solid in early luteal. Tackle detail-oriented or analytical tasks.',
      'Appetite tends to increase mid-luteal. Protein and complex carbs stabilise mood and cravings.',
      'Bloating and breast tenderness can appear. Reducing salt and caffeine makes a real difference.',
      'Emotional sensitivity is heightened. Journalling or light yoga can help process feelings.',
      'PMS symptoms may be noticeable today. Prioritise sleep and avoid overscheduling.',
      'Final day before your period — rest, warmth, and preparation set you up for a smoother bleed.',
    ],
  },
}

function getPhasePrediction(phaseKey, cycleDay, cycleLength) {
  const phase = PHASE_PREDICTIONS[phaseKey]
  // Find which day within the phase this is, to pick a unique message
  const r = cycleLength / 28
  const phaseStarts = {
    menstrual: 1,
    follicular: Math.round(5 * r) + 1,
    ovulatory: Math.round(13 * r) + 1,
    luteal: Math.round(16 * r) + 1,
  }
  const start = phaseStarts[phaseKey] || 1
  const dayWithinPhase = Math.max(0, cycleDay - start)
  const idx = dayWithinPhase % phase.messages.length
  return {
    title: phase.titles[idx % phase.titles.length],
    message: phase.messages[idx],
    color: phase.color,
    label: phase.label,
  }
}

function getPhaseKey(cycleDay, cycleLength = 28) {
  const r = cycleLength / 28
  if (cycleDay <= Math.round(5 * r)) return 'menstrual'
  if (cycleDay <= Math.round(13 * r)) return 'follicular'
  if (cycleDay <= Math.round(16 * r)) return 'ovulatory'
  return 'luteal'
}

function energyForDay(day) {
  let base
  if (day >= 1 && day <= 5) base = 35
  else if (day >= 6 && day <= 13) base = 78
  else if (day >= 14 && day <= 16) base = 88
  else base = 42
  const noise = Math.sin(day * 2.7) * 12 + Math.cos(day * 1.3) * 8
  return Math.max(15, Math.min(100, Math.round(base + noise)))
}

/**
 * Generate energy data: 14 days of history + 7 days of prediction.
 * Each point has a real date label and cycle-phase metadata.
 */
export function generateMockEnergyData(currentCycleDay, cycleLength = 28) {
  const today = new Date()
  const data = []

  // 14 historical days (index 0 = 13 days ago, index 13 = today)
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    let cd = currentCycleDay - i
    if (cd <= 0) cd += cycleLength

    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    data.push({
      date: label,
      cycleDay: cd,
      energy: energyForDay(cd),
      predicted: null,
      isPrediction: false,
      isCurrent: i === 0,
      phaseKey: getPhaseKey(cd, cycleLength),
    })
  }

  // 7 prediction days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    let cd = currentCycleDay + i
    if (cd > cycleLength) cd -= cycleLength

    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const phaseKey = getPhaseKey(cd, cycleLength)
    const pred = getPhasePrediction(phaseKey, cd, cycleLength)

    data.push({
      date: label,
      cycleDay: cd,
      energy: null,
      predicted: energyForDay(cd),
      isPrediction: true,
      isCurrent: false,
      phaseKey,
      predTitle: pred.title,
      predMessage: pred.message,
      predColor: pred.color,
    })
  }

  return data
}

export { PHASE_PREDICTIONS }

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
