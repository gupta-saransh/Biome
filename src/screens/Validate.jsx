import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import EnergyChart from '../components/EnergyChart'
import { FlowHeader } from './CheckIn'

export default function Validate() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const getEnergyPattern = useStore((s) => s.getEnergyPattern)
  const getPatternInsight = useStore((s) => s.getPatternInsight)
  const getCyclePhase = useStore((s) => s.getCyclePhase)
  const checkInHistory = useStore((s) => s.checkInHistory)
  const cycleDay = useStore((s) => s.cycleDay)

  const energyData = getEnergyPattern()
  const insight = getPatternInsight()
  const phase = getCyclePhase()
  const isLow = mode === 'low'

  // Determine if we have enough data for patterns
  const hasEnoughData = checkInHistory.length >= 5 // In production: 30+

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader
        step={3}
        total={4}
        onBack={() => navigate(`/flow/${mode}/label`)}
        mode={mode}
      />

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 flex flex-col">
        {/* Headline */}
        <div className="mb-2">
          <span
            className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4
              ${isLow ? 'bg-brand-light text-brand-purple' : 'bg-green-50 text-green-700'}`}
          >
            Your Pattern
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
          {isLow
            ? 'This has happened before — and it makes sense.'
            : 'This tracks. You tend to peak around now.'}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {isLow
            ? 'Your body isn\'t broken. It\'s following a pattern.'
            : 'Your body is in its power window.'}
        </p>

        {/* Pattern card */}
        <div className={`rounded-2xl p-5 mb-5 ${isLow ? 'bg-brand-light' : 'bg-green-50'}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">📊</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {hasEnoughData ? 'Pattern detected' : 'Building your pattern'}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {hasEnoughData
                  ? isLow
                    ? `Your logs suggest lower energy around this time every month. This is the ${insight.occurrences}${getOrdinalSuffix(insight.occurrences)} time this pattern has shown up.`
                    : `Your logs show higher energy and stronger workouts on days 7–10 of your cycle. Today is day ${cycleDay}.`
                  : "We don't have enough data yet to show your pattern — but here's what we know about this phase in general."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Energy chart */}
        <div className="card mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Energy — Last 14 Days
          </p>
          <EnergyChart data={energyData} />
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Dashed line = today (Day {cycleDay})
          </p>
        </div>

        {/* Validation statement */}
        <div className={`rounded-xl p-4 mb-8 border-l-4
          ${isLow
            ? 'bg-brand-light border-brand-purple'
            : 'bg-green-50 border-green-600'
          }`}
        >
          <p className="text-sm font-medium text-gray-800 leading-relaxed">
            {isLow
              ? 'This is not a discipline failure. Your body is working harder than usual right now.'
              : 'Your body is working with you today. That\'s real — and worth using.'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-auto pb-6">
          <button
            onClick={() => navigate(`/flow/${mode}/adapt`)}
            className={isLow ? 'btn-primary' : 'btn-primary bg-green-600 hover:bg-green-700'}
          >
            {isLow ? 'What can I do today? →' : 'How do I make the most of today? →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
