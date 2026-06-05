import { useMemo, useState } from 'react'
import { useRecords } from '../hooks/useRecords'
import { useTags } from '../hooks/useTags'
import { useCrisisLogs } from '../hooks/useCrisis'
import { PageHeader, PageLoader } from '../components/ui'
import TrendChart from '../components/features/charts/TrendChart'
import TagBarChart from '../components/features/charts/TagBarChart'
import { getLast30Days, toDateKey } from '../utils/date'
import { ANXIETY_COLORS } from '../utils/constants'
import type { Tag } from '../types'

type Tab = 'genel' | 'tetikleyici' | 'obsesyon' | 'kompülsiyon' | 'kriz'

const TABS: { id: Tab; label: string }[] = [
  { id: 'genel',        label: 'Genel' },
  { id: 'tetikleyici',  label: 'Tetikleyici' },
  { id: 'obsesyon',     label: 'Obsesyon' },
  { id: 'kompülsiyon',  label: 'Kompülsiyon' },
  { id: 'kriz',         label: 'Kriz' },
]

function buildTagFrequency(ids: string[][], allTags: Tag[]) {
  const counts: Record<string, number> = {}
  ids.flat().forEach((id) => { counts[id] = (counts[id] ?? 0) + 1 })
  return Object.entries(counts)
    .map(([id, count]) => ({ label: allTags.find((t) => t.id === id)?.label ?? '—', count }))
    .filter((x) => x.label !== '—')
    .sort((a, b) => b.count - a.count)
}

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900" style={color ? { color } : undefined}>{value}</span>
    </div>
  )
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 xl:grid xl:grid-cols-2 xl:gap-8">
      {left}
      {right}
    </div>
  )
}

export default function Insights() {
  const { data: records = [], isLoading } = useRecords()
  const { data: tags = [] }               = useTags()
  const { data: crisisLogs = [] }         = useCrisisLogs()
  const [tab, setTab] = useState<Tab>('genel')

  const last30 = getLast30Days()

  const stats = useMemo(() => {
    const withAnxiety   = records.filter((r) => r.anxiety_level !== null)
    const avgAnxiety    = withAnxiety.length
      ? Math.round(withAnxiety.reduce((s, r) => s + (r.anxiety_level ?? 0), 0) / withAnxiety.length * 10) / 10
      : null
    const maxAnxiety    = withAnxiety.length ? Math.max(...withAnxiety.map((r) => r.anxiety_level ?? 0)) : null
    const last30Records = records.filter((r) => last30.includes(toDateKey(r.created_at)))
    const last30Crisis  = crisisLogs.filter((c) => last30.includes(toDateKey(c.created_at)))

    const triggerFreq = buildTagFrequency(records.map((r) => r.trigger_tag_ids), tags)
    const obsFreq     = buildTagFrequency(records.map((r) => r.obsession_tag_ids), tags)
    const compFreq    = buildTagFrequency(records.map((r) => r.compulsion_tag_ids), tags)

    const dayFreq: Record<string, number> = {}
    records.forEach((r) => {
      const d = toDateKey(r.created_at)
      dayFreq[d] = (dayFreq[d] ?? 0) + 1
    })
    const busiestDay = Object.entries(dayFreq).sort((a, b) => b[1] - a[1])[0]

    return { avgAnxiety, maxAnxiety, last30Records, last30Crisis, triggerFreq, obsFreq, compFreq, busiestDay }
  }, [records, tags, crisisLogs])

  if (isLoading) return <PageLoader />

  return (
    <div className="page-container-wide">
      <PageHeader title="Analiz" subtitle={`${records.length} toplam kayıt`} />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-tertiary rounded-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors text-center ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Genel ── */}
      {tab === 'genel' && (
        <TwoCol
          left={
            <div className="card p-5 space-y-1">
              <p className="text-sm font-semibold text-gray-800 mb-4">Özet İstatistikler</p>
              <StatRow label="Toplam kayıt" value={records.length} />
              <StatRow
                label="Ort. anksiyete"
                value={stats.avgAnxiety ? `${stats.avgAnxiety} / 10` : '—'}
                color={stats.avgAnxiety ? ANXIETY_COLORS[Math.round(stats.avgAnxiety)] : undefined}
              />
              <StatRow
                label="Maks. anksiyete"
                value={stats.maxAnxiety ? `${stats.maxAnxiety} / 10` : '—'}
                color={stats.maxAnxiety ? ANXIETY_COLORS[stats.maxAnxiety] : undefined}
              />
              <StatRow label="Son 30 gün — kayıt" value={stats.last30Records.length} />
              <StatRow label="Son 30 gün — kriz" value={stats.last30Crisis.length} />
              {stats.busiestDay && (
                <StatRow
                  label="En yoğun gün"
                  value={`${stats.busiestDay[0]}  (${stats.busiestDay[1]} kayıt)`}
                />
              )}
            </div>
          }
          right={
            <div className="card p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Son 7 Günlük Anksiyete Trendi</p>
              <TrendChart records={records} />
            </div>
          }
        />
      )}

      {/* ── Tab: Tetikleyici ── */}
      {tab === 'tetikleyici' && (
        <TwoCol
          left={
            <div className="card p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-800">En Sık Tetikleyiciler</p>
              <TagBarChart data={stats.triggerFreq} />
            </div>
          }
          right={
            stats.triggerFreq.length > 0 ? (
              <div className="card p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">Tüm Liste</p>
                {stats.triggerFreq.map((item) => (
                  <StatRow key={item.label} label={item.label} value={`${item.count} kez`} />
                ))}
              </div>
            ) : <div />
          }
        />
      )}

      {/* ── Tab: Obsesyon ── */}
      {tab === 'obsesyon' && (
        <TwoCol
          left={
            <div className="card p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-800">En Sık Obsesyonlar</p>
              <TagBarChart data={stats.obsFreq} color="#7c6fcd" />
            </div>
          }
          right={
            stats.obsFreq.length > 0 ? (
              <div className="card p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">Tüm Liste</p>
                {stats.obsFreq.map((item) => (
                  <StatRow key={item.label} label={item.label} value={`${item.count} kez`} />
                ))}
              </div>
            ) : <div />
          }
        />
      )}

      {/* ── Tab: Kompülsiyon ── */}
      {tab === 'kompülsiyon' && (
        <TwoCol
          left={
            <div className="card p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-800">En Sık Kompülsiyonlar</p>
              <TagBarChart data={stats.compFreq} color="#e08b4a" />
            </div>
          }
          right={
            stats.compFreq.length > 0 ? (
              <div className="card p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">Tüm Liste</p>
                {stats.compFreq.map((item) => (
                  <StatRow key={item.label} label={item.label} value={`${item.count} kez`} />
                ))}
              </div>
            ) : <div />
          }
        />
      )}

      {/* ── Tab: Kriz ── */}
      {tab === 'kriz' && (
        <TwoCol
          left={
            <div className="card p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Kriz İstatistikleri</p>
              <StatRow label="Toplam kriz anı" value={crisisLogs.length} />
              <StatRow
                label="Çözümlenen"
                value={crisisLogs.filter((c) => c.resolved_at).length}
              />
              <StatRow label="Son 30 gün" value={stats.last30Crisis.length} />
              {crisisLogs.length > 0 && (
                <StatRow
                  label="Son kriz"
                  value={new Date(crisisLogs[0].created_at).toLocaleDateString('tr-TR')}
                />
              )}
            </div>
          }
          right={
            crisisLogs.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-2xl mb-2">🌿</p>
                <p className="text-sm text-brand-600 font-medium">Harika!</p>
                <p className="text-xs text-gray-400 mt-1">Hiç kriz kaydın yok</p>
              </div>
            ) : <div />
          }
        />
      )}

    </div>
  )
}
