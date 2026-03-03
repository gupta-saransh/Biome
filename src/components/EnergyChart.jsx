import { useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  CartesianGrid,
} from 'recharts'

// Custom dot rendered on prediction points — pulsing, clickable
function PredictionDot(props) {
  const { cx, cy, payload, onSelect, selected } = props
  if (!payload?.isPrediction) return null
  const isSelected = selected === payload.date
  return (
    <g>
      {isSelected && (
        <circle cx={cx} cy={cy} r={14} fill={payload.predColor} fillOpacity={0.2} />
      )}
      <circle
        cx={cx} cy={cy} r={5}
        fill={isSelected ? payload.predColor : '#fff'}
        stroke={payload.predColor || '#a855f7'}
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelect(payload.date)}
      />
    </g>
  )
}

// Custom X-axis tick — bold + colored for today
function CustomTick({ x, y, payload, data }) {
  const point = data?.find(d => d.date === payload.value)
  const isCurrent = point?.isCurrent
  const isPrediction = point?.isPrediction
  return (
    <text
      x={x} y={y + 12}
      textAnchor="middle"
      fontSize={9}
      fontWeight={isCurrent ? 700 : 400}
      fill={isCurrent ? '#45009D' : isPrediction ? '#a78bfa' : '#9CA3AF'}
    >
      {payload.value}
    </text>
  )
}

export default function EnergyChart({ data }) {
  const [selected, setSelected] = useState(null)

  const currentPoint = data.find(d => d.isCurrent)
  const selectedPoint = data.find(d => d.date === selected)

  // Show only every 3rd label to avoid clutter on 21 points
  const tickDates = data.filter((_, i) => i % 3 === 0).map(d => d.date)

  const handleSelect = (date) => {
    setSelected(prev => (prev === date ? null : date))
  }

  return (
    <div className="w-full">
      {/* Prediction callout */}
      {selectedPoint && selectedPoint.isPrediction && (
        <div
          className="mb-3 p-3 rounded-xl border-2 transition-all duration-200"
          style={{ borderColor: selectedPoint.predColor + '80', backgroundColor: selectedPoint.predColor + '18' }}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: selectedPoint.predColor }}
            >
              {selectedPoint.cycleDay}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold text-gray-800">{selectedPoint.date}</p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: selectedPoint.predColor }}
                >
                  {selectedPoint.predTitle}
                </span>
                <span className="text-[10px] text-gray-400">~{selectedPoint.predicted}% energy</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">{selectedPoint.predMessage}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-300 hover:text-gray-500 text-xs shrink-0"
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 28, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#45009D" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#45009D" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#F3F4F6" />

            <XAxis
              dataKey="date"
              tick={<CustomTick data={data} />}
              axisLine={false}
              tickLine={false}
              ticks={tickDates}
            />
            <YAxis hide domain={[0, 100]} />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                if (!d) return null
                const val = d.isPrediction ? d.predicted : d.energy
                if (val == null) return null
                return (
                  <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-0.5">{d.date} · Day {d.cycleDay}</p>
                    <p className="text-sm font-semibold" style={{ color: d.isPrediction ? '#a855f7' : '#45009D' }}>
                      {d.isPrediction ? 'Predicted' : 'Energy'}: {val}%
                    </p>
                    {d.isPrediction && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Click dot for details</p>
                    )}
                  </div>
                )
              }}
            />

            {/* Today reference line */}
            {currentPoint && (
              <ReferenceLine
                x={currentPoint.date}
                stroke="#45009D"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                label={{ value: 'Today', position: 'top', fontSize: 9, fill: '#45009D' }}
              />
            )}

            {/* Historical solid area */}
            <Area
              type="monotone"
              dataKey="energy"
              stroke="#45009D"
              strokeWidth={2.5}
              fill="url(#histGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#45009D', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Prediction dashed area */}
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#predGrad)"
              dot={<PredictionDot onSelect={handleSelect} selected={selected} />}
              activeDot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-brand-purple rounded" />
          <span className="text-[10px] text-gray-400">Recorded</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px border-t-2 border-dashed border-purple-400" />
          <span className="text-[10px] text-gray-400">7-day forecast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400 border-2 border-white shadow-sm" />
          <span className="text-[10px] text-gray-400">Click to preview</span>
        </div>
      </div>
    </div>
  )
}

