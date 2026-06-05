import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface TagFrequency {
  label: string
  count: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: TagFrequency; value: number }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{payload[0].payload.label}</p>
      <p className="text-brand-600">{payload[0].value} kez</p>
    </div>
  )
}

interface TagBarChartProps {
  data: TagFrequency[]
  color?: string
  maxItems?: number
}

export default function TagBarChart({ data, color = '#218c74', maxItems = 6 }: TagBarChartProps) {
  const chartData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count).slice(0, maxItems),
    [data, maxItems],
  )

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Henüz yeterli veri yok</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(chartData.length * 36, 120)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={color} opacity={1 - i * 0.08} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
