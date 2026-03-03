import { useState } from 'react'
import useStore from '../store/useStore'
import { getCyclePhase, getEnergyTier } from '../utils/helpers'

const BLOCK_OPTIONS = [
  { label: 'Focus time',   color: 'bg-brand-light text-brand-purple border-brand-purple/30' },
  { label: 'Easy tasks',   color: 'bg-green-50 text-green-700 border-green-200' },
  { label: 'Workout',      color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: 'Rest',         color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { label: 'Social',       color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { label: 'Plan ahead',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
]

function blockStyle(label) {
  return BLOCK_OPTIONS.find((b) => b.label === label)?.color
    || 'bg-gray-100 text-gray-600 border-gray-200'
}

export default function Planner() {
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)
  const plannerBlocks = useStore((s) => s.plannerBlocks)
  const addPlannerBlock = useStore((s) => s.addPlannerBlock)
  const removePlannerBlock = useStore((s) => s.removePlannerBlock)

  const [expandedDay, setExpandedDay] = useState(null) // dayKey of open picker

  // Build 7-day view: today + 6 ahead
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    let cd = cycleDay + i
    if (cd > cycleLength) cd = ((cd - 1) % cycleLength) + 1
    const dayKey = date.toISOString().split('T')[0]
    const phase = getCyclePhase(cd, cycleLength)
    const energy = getEnergyTier(phase.key)
    return {
      date,
      dayKey,
      cycleDay: cd,
      phase,
      energy,
      isToday: i === 0,
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })

  const toggleBlock = (dayKey, label) => {
    const existing = plannerBlocks[dayKey] || []
    if (existing.includes(label)) {
      removePlannerBlock(dayKey, label)
    } else {
      addPlannerBlock(dayKey, label)
    }
  }

  return (
    <div className="py-4 space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Planner</h1>
        <p className="text-sm text-gray-500 mt-1">Your week, mapped to your cycle. Tap a day to add blocks.</p>
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {['menstrual', 'follicular', 'ovulatory', 'luteal'].map((key) => {
          const p = getCyclePhase(
            key === 'menstrual' ? 1 : key === 'follicular' ? 7 : key === 'ovulatory' ? 14 : 18,
            28
          )
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-gray-500 capitalize">{key}</span>
            </div>
          )
        })}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-200">
          <div className="w-3 h-3 rounded bg-brand-light border border-brand-purple/30" />
          <span className="text-xs text-gray-500">Your blocks</span>
        </div>
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {days.map(({ date, dayKey, cycleDay: cd, phase, energy, isToday, dayLabel, dateLabel }) => {
          const blocks = plannerBlocks[dayKey] || []
          const isExpanded = expandedDay === dayKey

          return (
            <div
              key={dayKey}
              className={`rounded-2xl border-2 transition-all duration-200
                ${isToday
                  ? 'border-brand-purple bg-brand-light shadow-sm'
                  : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
            >
              {/* Day header — tap to expand/collapse picker */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : dayKey)}
                className="w-full text-left px-4 pt-4 pb-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Date chip */}
                    <div
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0
                        ${isToday ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <span className="text-[8px] font-semibold uppercase leading-none opacity-70">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-sm font-bold leading-tight">{date.getDate()}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {dayLabel}
                          {isToday && (
                            <span className="ml-2 text-[10px] font-bold text-brand-purple uppercase tracking-wide">
                              Day {cd}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: phase.color }}
                        />
                        <p className="text-xs text-gray-400 capitalize">{phase.name} phase</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {blocks.length > 0 && (
                      <span className="text-[10px] text-gray-400">{blocks.length} block{blocks.length > 1 ? 's' : ''}</span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${energy.bg} ${energy.color}`}
                    >
                      {energy.label}
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      className={`text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Phase insight strip */}
              <div className="h-0.5 mx-4" style={{ backgroundColor: phase.color + '80' }} />

              {/* Active blocks */}
              {blocks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 pt-3">
                  {blocks.map((b) => (
                    <button
                      key={b}
                      onClick={() => removePlannerBlock(dayKey, b)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border
                        transition-all active:scale-95 ${blockStyle(b)}`}
                      title="Tap to remove"
                    >
                      {b} <span className="opacity-50 text-[10px]">&#x2715;</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Block picker (expanded) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Add a block for {dayLabel === 'Today' || dayLabel === 'Tomorrow' ? dayLabel.toLowerCase() : dateLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {BLOCK_OPTIONS.map(({ label, color }) => {
                      const active = blocks.includes(label)
                      return (
                        <button
                          key={label}
                          onClick={() => toggleBlock(dayKey, label)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all active:scale-95
                            ${active
                              ? `${color} opacity-40`
                              : `${color} hover:opacity-80`
                            }`}
                        >
                          {active ? '✓ ' : '+ '}{label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Phase tip */}
                  <div className="mt-3 p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="font-semibold text-gray-700">{phase.name} tip: </span>
                      {phase.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Spacer if no expansion */}
              {!isExpanded && blocks.length === 0 && <div className="pb-3" />}
              {!isExpanded && blocks.length > 0 && <div className="pb-3" />}
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Blocks are saved automatically. Tap any day to add or remove plans.
          Energy levels are based on your cycle phase.
        </p>
      </div>
    </div>
  )
}

