import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import CycleBar from '../components/CycleBar'
import EnergyChart from '../components/EnergyChart'
import { getGreeting, formatDate } from '../utils/helpers'
import { CYCLE_PHASES } from '../data/mockData'

export default function Home() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)
  const todayLog = useStore((s) => s.todayLog)
  const toggleQuickLog = useStore((s) => s.toggleQuickLog)
  const getPatternInsight = useStore((s) => s.getPatternInsight)
  const getCyclePhase = useStore((s) => s.getCyclePhase)
  const getEnergyPattern = useStore((s) => s.getEnergyPattern)
  const checkInHistory = useStore((s) => s.checkInHistory)
  const startFlow = useStore((s) => s.startFlow)

  const insight = getPatternInsight()
  const phase = getCyclePhase()
  const energyData = getEnergyPattern()
  const greeting = getGreeting()
  const userName = user?.name || 'there'

  const handleStartFlow = (mode) => {
    startFlow(mode)
    navigate(`/flow/${mode}/check-in`)
  }

  const completedToday = [todayLog.sleep, todayLog.moved, todayLog.ate].filter(v => v === true).length
  const hasLoggedToday = [todayLog.sleep, todayLog.moved, todayLog.ate].some(v => v !== null)

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{userName}</h1>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: phase.bgColor, color: '#45009D' }}
          >
            {phase.name} · Day {cycleDay}
          </span>
        </div>
      </div>

      {/* ── Top grid: CTA + Status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hard day CTA */}
        <button
          onClick={() => handleStartFlow('low')}
          className="group flex items-center gap-4 p-5 rounded-2xl
            bg-brand-purple text-white
            hover:shadow-lg active:scale-[0.98] transition-all duration-200
            text-left"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">😔</span>
          <div>
            <p className="font-bold text-base leading-tight">Having a hard day?</p>
            <p className="text-sm text-purple-200 mt-0.5">Label → Validate → Adapt</p>
          </div>
        </button>

        {/* Good day CTA */}
        <button
          onClick={() => handleStartFlow('high')}
          className="group flex items-center gap-4 p-5 rounded-2xl
            bg-brand-yellow text-gray-900
            hover:shadow-lg active:scale-[0.98] transition-all duration-200
            text-left"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">✨</span>
          <div>
            <p className="font-bold text-base leading-tight">Feeling good today?</p>
            <p className="text-sm text-yellow-700 mt-0.5">Make the most of it</p>
          </div>
        </button>

        {/* Today status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Log</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${hasLoggedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {hasLoggedToday ? `${completedToday}/3 done` : 'Not logged'}
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'sleep', emoji: '😴', label: 'Sleep' },
              { key: 'moved', emoji: '🏃', label: 'Move' },
              { key: 'ate', emoji: '🍽️', label: 'Food' },
            ].map(({ key, emoji, label }) => {
              const val = todayLog[key]
              return (
                <button
                  key={key}
                  onClick={() => toggleQuickLog(key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2
                    transition-all duration-200 active:scale-95
                    ${val === true
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : val === false
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span className="text-[10px] font-semibold">{label}</span>
                  {val !== null && (
                    <span className="text-[9px] font-bold">{val ? '✓' : '✗'}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Middle row: Cycle + Insight ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cycle position */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">Cycle Position</p>
            <button
              onClick={() => navigate('/settings')}
              className="text-xs text-brand-purple hover:underline"
            >
              Edit
            </button>
          </div>
          <CycleBar cycleDay={cycleDay} cycleLength={cycleLength} />

          <div className="mt-5 p-3 rounded-xl bg-gray-50">
            <p className="text-xs font-semibold text-gray-700 mb-1">{phase.name} Phase</p>
            <p className="text-xs text-gray-500 leading-relaxed">{phase.description}</p>
          </div>
        </div>

        {/* Pattern insight */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-4">Energy — Last 14 Days</p>
          <EnergyChart data={energyData} />
          {insight.exists && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-brand-light">
              <span className="text-base shrink-0">🔮</span>
              <p className="text-xs text-gray-700 leading-relaxed">{insight.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: Phase detail + History ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Phase breakdown */}
        <div className="md:col-span-1 bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Phases Overview</p>
          <div className="space-y-2.5">
            {Object.values(CYCLE_PHASES).map((p) => {
              const isCurrent = p.key === phase.key
              return (
                <div
                  key={p.key}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors
                    ${isCurrent ? 'bg-brand-light' : 'hover:bg-gray-50'}`}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-semibold ${isCurrent ? 'text-brand-purple' : 'text-gray-700'}`}>
                        {p.name}
                      </p>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-brand-purple bg-brand-mid px-1.5 py-0.5 rounded-full">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">Days {p.dayRange[0]}–{p.dayRange[1]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent check-ins */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Check-ins</p>
            <span className="text-xs text-gray-400">{checkInHistory.length} total</span>
          </div>

          {checkInHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">📋</span>
              <p className="text-sm font-medium text-gray-500">No check-ins yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Use the buttons above to log how you're feeling
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {checkInHistory.slice().reverse().slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0
                    ${entry.mode === 'low' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                    {entry.mode === 'low' ? '😔' : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.mode === 'low' ? 'Hard day' : 'Good day'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {entry.feelings?.join(', ') || 'No feelings logged'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
                    <p className="text-xs text-gray-300 capitalize">Day {entry.cycleDay}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
