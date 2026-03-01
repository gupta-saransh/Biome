import { CYCLE_PHASES } from '../data/mockData'

const phaseOrder = ['menstrual', 'follicular', 'ovulatory', 'luteal']

export default function CycleBar({ cycleDay, cycleLength = 28, compact = false }) {
  // Calculate proportional widths
  const widths = {
    menstrual: (5 / 28) * 100,
    follicular: (8 / 28) * 100,
    ovulatory: (3 / 28) * 100,
    luteal: (12 / 28) * 100,
  }

  // Calculate marker position as percentage
  const markerPos = ((cycleDay - 0.5) / cycleLength) * 100

  return (
    <div className="w-full">
      {/* Phase bar */}
      <div className="relative">
        <div className="flex rounded-full overflow-hidden h-3">
          {phaseOrder.map((key) => (
            <div
              key={key}
              style={{
                width: `${widths[key]}%`,
                backgroundColor: CYCLE_PHASES[key].color,
              }}
              className="transition-all duration-300"
            />
          ))}
        </div>

        {/* Current day marker */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${markerPos}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-brand-purple border-2 border-white shadow-md" />
          {!compact && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[11px] font-semibold text-brand-purple bg-white px-1.5 py-0.5 rounded shadow-sm">
                Day {cycleDay}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Phase labels */}
      {!compact && (
        <div className="flex mt-6 gap-0.5">
          {phaseOrder.map((key) => (
            <div key={key} style={{ width: `${widths[key]}%` }} className="text-center">
              <span className="text-[10px] text-gray-500 font-medium leading-none">
                {CYCLE_PHASES[key].name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
