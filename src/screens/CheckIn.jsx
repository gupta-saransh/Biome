import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { CHECK_IN_LOW, CHECK_IN_HIGH } from '../data/mockData'
import TagSelect from '../components/TagSelect'

export default function CheckIn() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const updateFlowCheckIn = useStore((s) => s.updateFlowCheckIn)
  const currentFlow = useStore((s) => s.currentFlow)

  const isLow = mode === 'low'
  const options = isLow ? CHECK_IN_LOW : CHECK_IN_HIGH

  const [feelings, setFeelings] = useState(currentFlow?.checkIn?.feelings || [])
  const [challenges, setChallenges] = useState(currentFlow?.checkIn?.challenges || [])
  const [quickLog, setQuickLog] = useState(currentFlow?.checkIn?.quickLog || {})

  const toggleQuick = (key) => {
    setQuickLog((prev) => ({
      ...prev,
      [key]: prev[key] === true ? false : prev[key] === false ? null : true,
    }))
  }

  const handleSubmit = () => {
    updateFlowCheckIn({ feelings, challenges, quickLog })
    navigate(`/flow/${mode}/label`)
  }

  const canSubmit = feelings.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Flow header */}
      <FlowHeader
        step={1}
        total={4}
        onBack={() => navigate('/')}
        onForward={handleSubmit}
        forwardDisabled={!canSubmit}
        mode={mode}
      />

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isLow ? 'How are you feeling right now?' : 'How are you feeling?'}
          </h1>
          <p className="text-sm text-gray-400">Select all that apply</p>
        </div>

        {/* Feelings */}
        <div>
          <TagSelect
            options={options.feelings.map((f) => ({
              emoji: f.emoji,
              label: f.label,
            }))}
            selected={feelings}
            onChange={setFeelings}
            multi
          />
        </div>

        {/* Challenges / Goals */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {isLow ? "What's hardest right now?" : 'What do you want to do with this?'}
          </h2>
          <TagSelect
            options={(isLow ? options.challenges : options.goals).map((c) => ({
              label: c.label,
            }))}
            selected={challenges}
            onChange={setChallenges}
            multi
          />
        </div>

        {/* Quick checks */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Quick check
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'sleep', label: isLow ? 'Sleep ok?' : 'Slept great?', emoji: '😴' },
              { key: 'moved', label: isLow ? 'Moved?' : 'Moving?' , emoji: '🏃' },
              { key: 'ate', label: isLow ? 'Ate ok?' : 'Eating well?', emoji: '🍽️' },
            ].map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => toggleQuick(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2
                  transition-all duration-200 active:scale-95 min-h-[72px] justify-center
                  ${
                    quickLog[key] === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : quickLog[key] === false
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[11px] font-medium text-center">{label}</span>
                {quickLog[key] !== undefined && quickLog[key] !== null && (
                  <span className="text-[10px] font-bold">
                    {quickLog[key] ? '✓ Yes' : '✗ No'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pb-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-primary"
          >
            {isLow ? 'See what\'s going on →' : 'See what your body can do →'}
          </button>
          {!canSubmit && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Select at least one feeling to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Flow Header (shared across flow screens) ──

export function FlowHeader({ step, total, onBack, onForward, forwardDisabled = false, mode }) {
  const progress = (step / total) * 100
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: mode === 'low' ? '#45009D' : '#2E7D32',
          }}
        />
      </div>
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        {/* Back */}
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Step dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300
                ${i + 1 <= step ? 'w-6' : 'w-1.5'}
                ${
                  i + 1 <= step
                    ? mode === 'low' ? 'bg-brand-purple' : 'bg-green-600'
                    : 'bg-gray-200'
                }`}
            />
          ))}
        </div>

        {/* Forward */}
        {onForward ? (
          <button
            onClick={onForward}
            disabled={forwardDisabled}
            className={`p-1.5 -mr-1.5 transition-colors
              ${forwardDisabled
                ? 'text-gray-200 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-900'}`}
            aria-label="Go forward"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </div>
  )
}
