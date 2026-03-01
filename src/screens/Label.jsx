import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import CycleBar from '../components/CycleBar'
import { FlowHeader } from './CheckIn'

export default function Label() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const getCyclePhase = useStore((s) => s.getCyclePhase)
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)

  const phase = getCyclePhase()
  const isLow = mode === 'low'

  // Use PRD-approved copy where available, phase-specific otherwise
  const headline = isLow ? phase.labelHeadline : getHighHeadline(phase)
  const body = isLow ? phase.labelBody : getHighBody(phase)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader
        step={2}
        total={4}
        onBack={() => navigate(`/flow/${mode}/check-in`)}
        mode={mode}
      />

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 flex flex-col">
        {/* Label badge */}
        <div className="mb-6">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
            style={{ backgroundColor: phase.bgColor, color: '#45009D' }}
          >
            {isLow ? 'Why you feel this way' : "What's powering you"}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
          {headline}
        </h1>

        {/* Body text */}
        <p className="text-base text-gray-600 leading-relaxed mb-8">
          {body}
        </p>

        {/* Cycle visualization */}
        <div className="card mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Your cycle position
          </p>
          <CycleBar cycleDay={cycleDay} cycleLength={cycleLength} />
        </div>

        {/* Tone note */}
        <div className={`rounded-xl p-4 mb-8 ${isLow ? 'bg-brand-light' : 'bg-green-50'}`}>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            {isLow
              ? 'This is physiology, not discipline. Your body is doing exactly what it should.'
              : 'Your body is working with you today. That\'s real — and worth using.'
            }
          </p>
        </div>

        {/* CTA */}
        <div className="mt-auto pb-6">
          <button
            onClick={() => navigate(`/flow/${mode}/validate`)}
            className={isLow ? 'btn-primary' : 'btn-primary bg-green-600 hover:bg-green-700'}
          >
            {isLow ? 'What does this mean for today? →' : 'What does this mean for today? →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function getHighHeadline(phase) {
  const map = {
    follicular: "You're in your follicular phase — this is your high-output window.",
    ovulatory: "You're in your ovulatory phase — peak energy window.",
    luteal: "You're in your luteal phase — but your energy is holding up well today.",
    menstrual: "You're in your menstrual phase — and your energy is defying the norm today.",
  }
  return map[phase.key] || map.follicular
}

function getHighBody(phase) {
  const map = {
    follicular: 'Estrogen is rising, cortisol tolerance is higher, and your body is primed for effort. This is the window to push.',
    ovulatory: 'Estrogen and testosterone are at their highest. Your body is primed for maximum output, both physically and mentally.',
    luteal: "Progesterone is up, but some days your body handles it better. Today seems to be one of those days — use it well.",
    menstrual: "Even though hormone levels are low, some days just feel right. Listen to that — your body is telling you something.",
  }
  return map[phase.key] || map.follicular
}
