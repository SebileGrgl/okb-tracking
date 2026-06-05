import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import { useRecords } from '../hooks/useRecords'
import { useCrisisLogs } from '../hooks/useCrisis'
import { useProfile } from '../hooks/useProfile'
import { useTags } from '../hooks/useTags'
import { PageLoader } from '../components/ui'
import RecordCard from '../components/features/records/RecordCard'
import TrendChart from '../components/features/charts/TrendChart'
import { formatDate, toDateKey } from '../utils/date'
import { ANXIETY_COLORS } from '../utils/constants'
import type { OKBRecord } from '../types'

export default function Dashboard() {
  const { data: profile } = useProfile()
  const { data: records = [], isLoading } = useRecords()
  const { data: crisisLogs = [] } = useCrisisLogs()
  const { data: tags = [] } = useTags()

  const stats = useMemo(() => {
    const today        = toDateKey(new Date().toISOString())
    const todayRecords = records.filter((r) => toDateKey(r.created_at) === today)
    const withAnxiety  = todayRecords.filter((r) => r.anxiety_level !== null)

    const avgOf = (items: OKBRecord[]) => {
      const valid = items.filter((r) => r.anxiety_level !== null)
      if (!valid.length) return null
      return Math.round(valid.reduce((s, r) => s + (r.anxiety_level ?? 0), 0) / valid.length * 10) / 10
    }

    const todayCrises = crisisLogs.filter((c) => toDateKey(c.created_at) === today).length
    const weekAgo     = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const weekRecords = records.filter((r) => new Date(r.created_at) >= weekAgo)
    const weekCrises  = crisisLogs.filter((c) => new Date(c.created_at) >= weekAgo).length

    return {
      todayCount:     todayRecords.length,
      avgAnxiety:     avgOf(withAnxiety),
      todayCrises,
      weekCount:      weekRecords.length,
      weekCrises,
      avgWeekAnxiety: avgOf(weekRecords),
    }
  }, [records, crisisLogs])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Günaydın'
    if (h < 18) return 'İyi günler'
    return 'İyi akşamlar'
  }, []) // stable — only changes when component remounts

  if (isLoading) return <PageLoader />

  return (
    <div className="page-container-wide">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {greeting}{profile?.display_name ? `, ${profile.display_name}` : ''}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(new Date().toISOString())}</p>
        </div>
        <Link
          to="/kayit"
          className="btn-primary !py-2 !px-4 !w-auto flex items-center gap-1.5 no-underline shrink-0"
        >
          <Plus size={15} />
          Kayıt ekle
        </Link>
      </div>

      {/* ── Bugün stats — clean full-width card ── */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { value: stats.todayCount, label: 'Bugün kayıt', color: undefined },
            {
              value: stats.avgAnxiety ?? '—',
              label: 'Ort. anksiyete',
              color: stats.avgAnxiety ? ANXIETY_COLORS[Math.round(stats.avgAnxiety)] : '#d1d5db',
            },
            {
              value: stats.todayCrises,
              label: 'Bugün kriz',
              color: stats.todayCrises > 0 ? '#f59e0b' : undefined,
            },
          ].map(({ value, label, color }) => (
            <div key={label} className="flex flex-col items-center py-4 px-3 gap-1">
              <span
                className="text-2xl font-bold text-gray-900 tabular-nums"
                style={color ? { color } : undefined}
              >
                {value}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-col grid — sol içerik / sağ sidebar ── */}
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[1fr_260px] xl:gap-8">

        {/* ── Sol kolon ── */}
        <div className="flex flex-col gap-5">

          {/* Trend chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-brand-500" />
                <p className="text-sm font-semibold text-gray-800">Haftalık Anksiyete Trendi</p>
              </div>
              {stats.avgWeekAnxiety && (
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-chip"
                  style={{
                    background: `${ANXIETY_COLORS[Math.round(stats.avgWeekAnxiety)]}18`,
                    color: ANXIETY_COLORS[Math.round(stats.avgWeekAnxiety)],
                  }}
                >
                  Ort. {stats.avgWeekAnxiety}
                </span>
              )}
            </div>
            {records.length > 0 ? (
              <TrendChart records={records} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <p className="text-sm text-gray-400">Henüz kayıt yok</p>
                <p className="text-xs text-gray-300">Kayıt eklendikçe grafik burada görünecek</p>
              </div>
            )}
          </div>

          {/* Son kayıtlar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Son Kayıtlar</p>
              {records.length > 3 && (
                <Link
                  to="/kayitlar"
                  className="text-xs text-brand-600 flex items-center gap-1 hover:text-brand-700 font-medium"
                >
                  Tümünü gör <ArrowRight size={12} />
                </Link>
              )}
            </div>
            {records.length > 0 ? (
              <div className="flex flex-col gap-3">
                {records.slice(0, 3).map((r) => (
                  <RecordCard key={r.id} record={r} tags={tags} />
                ))}
              </div>
            ) : (
              <div className="card p-5 text-center">
                <p className="text-sm text-gray-400">Henüz kayıt eklemedin</p>
                <Link to="/kayit" className="text-sm text-brand-600 font-medium mt-2 inline-block hover:text-brand-700">
                  İlk kaydını oluştur →
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* ── Sağ kolon ── */}
        <div className="flex flex-col gap-3 xl:h-full">

          {/* Bu hafta — flex-1 ile sol kolona uzar */}
          <div className="card p-5 flex flex-col flex-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Bu Hafta</p>
            <div className="flex flex-col gap-2 flex-1">

              <div className="rounded-xl bg-brand-50 p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity size={13} className="text-brand-500" />
                  <p className="text-xs text-brand-600 font-medium">Kayıt</p>
                </div>
                <p className="text-3xl font-bold text-brand-700 mt-2">{stats.weekCount}</p>
              </div>

              <div className={`rounded-xl p-4 flex-1 flex flex-col justify-between ${stats.weekCrises > 0 ? 'bg-amber-50' : 'bg-surface-secondary'}`}>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={13} className={stats.weekCrises > 0 ? 'text-amber-500' : 'text-gray-300'} />
                  <p className={`text-xs font-medium ${stats.weekCrises > 0 ? 'text-amber-600' : 'text-gray-400'}`}>Kriz anı</p>
                </div>
                <p className={`text-3xl font-bold mt-2 ${stats.weekCrises > 0 ? 'text-amber-700' : 'text-gray-400'}`}>
                  {stats.weekCrises}
                </p>
              </div>

            </div>
          </div>

          {/* Detaylı analiz — flex-1 ile genişler */}
          <Link
            to="/analiz"
            className="card p-5 flex flex-col flex-1 hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
              <TrendingUp size={18} className="text-brand-600" />
            </div>
            <div className="mt-4 flex-1">
              <p className="text-sm font-semibold text-gray-800">Detaylı Analiz</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Tetikleyicileri, obsesyon örüntülerini ve kriz trendlerini incele
              </p>
            </div>
            <div className="flex items-center gap-1 text-brand-600 text-xs font-medium mt-4 group-hover:gap-2 transition-all">
              Analize git <ArrowRight size={13} />
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
