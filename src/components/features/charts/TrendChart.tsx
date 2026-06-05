import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { getLast7Days, toDateKey } from '../../../utils/date'
import type { OKBRecord } from '../../../types'

interface DataPoint {
  date: string
  label: string
  avg: number | null
  count: number
}

function buildChartData(records: OKBRecord[]): DataPoint[] {
  const days = getLast7Days()
  return days.map((day) => {
    const dayRecords = records.filter(
      (r) => toDateKey(r.created_at) === day && r.anxiety_level !== null
    )
    const avg = dayRecords.length
      ? Math.round(dayRecords.reduce((s, r) => s + (r.anxiety_level ?? 0), 0) / dayRecords.length * 10) / 10
      : null
    return {
      date: day,
      label: format(parseISO(day), 'EEE', { locale: tr }),
      avg,
      count: dayRecords.length,
    }
  })
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: DataPoint }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{label}</p>
      {d.avg !== null
        ? <p className="text-brand-600">Ort. anksiyete: <span className="font-semibold">{d.avg}</span></p>
        : <p className="text-gray-400">Kayıt yok</p>
      }
    </div>
  )
}

interface TrendChartProps {
  records: OKBRecord[]
}

export default function TrendChart({ records }: TrendChartProps) {
  const data = useMemo(() => buildChartData(records), [records])

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          ticks={[2, 4, 6, 8, 10]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#218c74"
          strokeWidth={2}
          dot={{ fill: '#218c74', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#218c74' }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
