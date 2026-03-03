import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function Settings() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)
  const updateCycleDay = useStore((s) => s.updateCycleDay)
  const updateCycleLength = useStore((s) => s.updateCycleLength)
  const checkInHistory = useStore((s) => s.checkInHistory)
  const adaptActions = useStore((s) => s.adaptActions)
  const periodActive = useStore((s) => s.periodActive)
  const periodStartDate = useStore((s) => s.periodStartDate)
  const periodHistory = useStore((s) => s.periodHistory)
  const logPeriodStart = useStore((s) => s.logPeriodStart)
  const logPeriodEnd = useStore((s) => s.logPeriodEnd)
  const resetApp = useStore((s) => s.resetApp)

  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [localCycleDay, setLocalCycleDay] = useState(cycleDay)
  const [localCycleLength, setLocalCycleLength] = useState(cycleLength)

  const handleSaveCycle = () => {
    updateCycleDay(Math.max(1, Math.min(localCycleLength, localCycleDay)))
    updateCycleLength(Math.max(21, Math.min(40, localCycleLength)))
  }

  const handleReset = () => {
    resetApp()
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="py-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your Biome experience</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Profile
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm font-medium text-gray-900">{user?.name || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Tone</span>
            <span className="text-sm font-medium text-gray-900">
              {user?.preferences?.tone?.[0] || user?.preferences?.tone || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Health context</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
              {user?.preferences?.health?.join(', ') || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Cycle settings */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Cycle Tracking
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Current cycle day
            </label>
            <input
              type="number"
              min={1}
              max={localCycleLength}
              value={localCycleDay}
              onChange={(e) => setLocalCycleDay(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base
                focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Cycle length (days)
            </label>
            <input
              type="number"
              min={21}
              max={40}
              value={localCycleLength}
              onChange={(e) => setLocalCycleLength(parseInt(e.target.value) || 28)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base
                focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>
          <button
            onClick={handleSaveCycle}
            className="btn-soft text-sm"
          >
            Save cycle settings
          </button>
        </div>
      </div>

      {/* Period Tracking */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Period Tracking
        </h3>

        <div className="space-y-3">
          {/* Current status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-100">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🩸</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {periodActive ? 'Period in progress' : 'No active period'}
                </p>
                {periodActive && periodStartDate && (
                  <p className="text-xs text-rose-600 mt-0.5">Started {periodStartDate}</p>
                )}
              </div>
            </div>
            {periodActive ? (
              <button
                onClick={logPeriodEnd}
                className="text-xs font-bold px-3 py-1.5 rounded-full
                  bg-white text-rose-600 border border-rose-200
                  hover:bg-rose-100 transition-colors"
              >
                End period
              </button>
            ) : (
              <button
                onClick={logPeriodStart}
                className="text-xs font-bold px-3 py-1.5 rounded-full
                  bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                Mark started
              </button>
            )}
          </div>

          {/* Period history */}
          {periodHistory.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">History</p>
              <div className="space-y-1.5">
                {periodHistory.slice().reverse().slice(0, 4).map((p) => (
                  <div key={p.id}
                    className="flex items-center justify-between text-xs py-2 px-3
                      rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="text-gray-600 font-medium">{p.start}</span>
                    </div>
                    <span className="text-gray-400">
                      {p.end ? `→ ${p.end}` : '→ ongoing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Your Data
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-brand-light rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-brand-purple">{checkInHistory.length}</p>
            <p className="text-xs text-gray-500 mt-1">Check-ins</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{adaptActions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Actions logged</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-rose-600">{periodHistory.length}</p>
            <p className="text-xs text-gray-500 mt-1">Cycles tracked</p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card border-red-100">
        <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
          Danger Zone
        </h3>
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold
              text-red-500 border-2 border-red-200 hover:bg-red-50 transition-colors"
          >
            Reset all data
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">
              This will delete all your check-ins, logs, and preferences. Are you sure?
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl text-sm font-semibold
                bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes, reset everything
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold
                text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* About */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Biome v1.0.0 · Built with care
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Not a medical device. For informational purposes only.
        </p>
      </div>
    </div>
  )
}
