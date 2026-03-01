import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from 'recharts'

export default function EnergyChart({ data }) {
  const currentDay = data.find((d) => d.isCurrent)

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#45009D" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#45009D" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-500">{d.day}</p>
                  <p className="text-sm font-semibold text-brand-purple">
                    Energy: {d.energy}%
                  </p>
                </div>
              )
            }}
          />
          {currentDay && (
            <ReferenceLine
              x={currentDay.day}
              stroke="#45009D"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#45009D"
            strokeWidth={2.5}
            fill="url(#energyGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: '#45009D',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
