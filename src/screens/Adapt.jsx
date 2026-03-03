import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { ADAPTATIONS_LOW, ADAPTATIONS_HIGH } from '../data/mockData'
import { FlowHeader } from './CheckIn'

export default function Adapt() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const logAdaptAction = useStore((s) => s.logAdaptAction)
  const saveCheckIn = useStore((s) => s.saveCheckIn)
  const clearFlow = useStore((s) => s.clearFlow)
  const addPlannerBlock = useStore((s) => s.addPlannerBlock)

  const isLow = mode === 'low'
  const adaptations = isLow ? ADAPTATIONS_LOW : ADAPTATIONS_HIGH
  const [loggedActions, setLoggedActions] = useState([])
  const [showToast, setShowToast] = useState(null)

  const todayKey = new Date().toISOString().split('T')[0]

  const handleAction = (adaptation) => {
    logAdaptAction(adaptation.action)
    setLoggedActions((prev) => [...prev, adaptation.action])
    setShowToast(adaptation.actionLabel)
    setTimeout(() => setShowToast(null), 2500)

    if (adaptation.action === 'plan-week') {
      handleFinish('/planner')
    } else if (adaptation.action === 'deep-work') {
      addPlannerBlock(todayKey, 'Focus time')
      handleFinish('/planner')
    }
  }

  const handleFinish = (destination = '/') => {
    saveCheckIn()
    clearFlow()
    navigate(destination, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <FlowHeader
        step={4}
        total={4}
        onBack={() => navigate(`/flow/${mode}/validate`)}
        onForward={() => handleFinish('/')}
        mode={mode}
      />

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 flex flex-col">
        {/* Badge */}
        <span
          className={`inline-block self-start text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4
            ${isLow ? 'bg-brand-light text-brand-purple' : 'bg-green-50 text-green-700'}`}
        >
          {isLow ? "Today's plan, reshaped" : 'Make the most of today'}
        </span>

        {/* Headline */}
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
          {isLow
            ? "Here's what today could look like."
            : "Here's what today could look like if you lean in."}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isLow
            ? 'Adapted to how you actually feel — not how you planned to feel.'
            : 'Your body is ready. Here are ways to use this window.'}
        </p>

        {/* Adaptation cards */}
        <div className="space-y-4 mb-8">
          {adaptations.map((item) => {
            const isLogged = loggedActions.includes(item.action)
            return (
              <div
                key={item.action}
                className={`rounded-2xl border-2 p-5 transition-all duration-300
                  ${isLogged
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                      {isLogged && (
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          ✓ Logged
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
                {!isLogged && (
                  <button
                    onClick={() => handleAction(item)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]
                      ${isLow
                        ? 'bg-brand-light text-brand-purple hover:bg-brand-mid'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                  >
                    {item.actionLabel}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Keep original plan option (high energy) */}
        {!isLow && (
          <button
            onClick={() => handleFinish()}
            className="btn-ghost mb-4 text-sm"
          >
            Keep my original plan
          </button>
        )}

        {/* Footer */}
        <div className={`rounded-xl p-4 mb-6 ${isLow ? 'bg-gray-50' : 'bg-green-50'}`}>
          <p className="text-sm text-gray-500 leading-relaxed text-center">
            Come back and log how it went — it helps the pattern get smarter.
          </p>
        </div>

        {/* Done */}
        <div className="mt-auto pb-6">
          <button
            onClick={() => handleFinish()}
            className={isLow ? 'btn-primary' : 'btn-primary bg-green-600 hover:bg-green-700'}
          >
            Done — back to home
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
          bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl
          animate-[fadeInUp_0.3s_ease-out]">
          ✓ {showToast}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}
