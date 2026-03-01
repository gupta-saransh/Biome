import useStore from '../store/useStore'
import { WEEKLY_PLAN, CYCLE_PHASES } from '../data/mockData'
import { getEnergyTier } from '../utils/helpers'

export default function Planner() {
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)

  return (
    <div className="py-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Planner</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your week, mapped to your cycle
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.values(CYCLE_PHASES).map((p) => (
          <div key={p.key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-xs text-gray-500">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {WEEKLY_PLAN.map((day, idx) => {
          const phaseData = CYCLE_PHASES[day.phase]
          const energyTier = getEnergyTier(day.phase)
          const isToday = idx === 0

          return (
            <div
              key={day.day}
              className={`rounded-2xl border-2 p-4 transition-all duration-200
                ${isToday
                  ? 'border-brand-purple bg-brand-light shadow-sm'
                  : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                      ${isToday ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {day.date}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {day.day}
                      {isToday && (
                        <span className="ml-2 text-xs font-bold text-brand-purple">
                          TODAY
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {day.phase} phase
                    </p>
                  </div>
                </div>

                {/* Energy tier badge */}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${energyTier.bg} ${energyTier.color}`}
                >
                  {day.energy}
                </span>
              </div>

              {/* Phase color bar */}
              <div
                className="h-1 rounded-full mb-3"
                style={{ backgroundColor: phaseData.color }}
              />

              {/* Events */}
              {day.events.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {day.events.map((e) => (
                    <span
                      key={e}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}

              {/* Tip */}
              <p className="text-sm text-gray-600 leading-relaxed">
                💡 {day.tip}
              </p>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Predictions based on your historical pattern. Your actual energy may vary —
          always listen to your body.
        </p>
      </div>
    </div>
  )
}
