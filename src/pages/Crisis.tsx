import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, X, ChevronRight } from 'lucide-react'
import { useLogCrisis, useResolveCrisis } from '../hooks/useCrisis'
import { useEmergencyContacts } from '../hooks/useEmergencyContacts'
import { useActivities, useLogActivityUsage } from '../hooks/useActivities'
import { useQuotes } from '../hooks/useQuotes'
import { Button } from '../components/ui'
import type { CrisisLog } from '../types'

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'

const PHASES: Record<Phase, { label: string; duration: number; next: Phase }> = {
  inhale:  { label: 'Nefes al',   duration: 4, next: 'hold' },
  hold:    { label: 'Bekle',      duration: 4, next: 'exhale' },
  exhale:  { label: 'Nefes ver',  duration: 6, next: 'rest' },
  rest:    { label: 'Bekle',      duration: 2, next: 'inhale' },
}

function BreathingGuide() {
  const [phase, setPhase]     = useState<Phase>('inhale')
  const [countdown, setCount] = useState(PHASES.inhale.duration)

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const next = PHASES[p].next
            setCount(PHASES[next].duration)
            return next
          })
          return PHASES[phase].duration
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  const isExpand = phase === 'inhale' || phase === 'hold'

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute rounded-full bg-brand-200 transition-all duration-1000 ${
            isExpand ? 'w-32 h-32 opacity-30' : 'w-16 h-16 opacity-10'
          }`}
        />
        <div
          className={`absolute rounded-full bg-brand-300 transition-all duration-1000 ${
            isExpand ? 'w-24 h-24 opacity-40' : 'w-12 h-12 opacity-20'
          }`}
        />
        <div
          className={`relative z-10 rounded-full bg-brand-500 text-white flex flex-col items-center justify-center transition-all duration-1000 ${
            isExpand ? 'w-20 h-20' : 'w-14 h-14'
          }`}
        >
          <span className="text-xl font-bold leading-none">{countdown}</span>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700">{PHASES[phase].label}</p>
      <p className="text-xs text-gray-400">4-4-6-2 nefes egzersizi</p>
    </div>
  )
}

export default function CrisisPage() {
  const navigate    = useNavigate()
  const logCrisis   = useLogCrisis()
  const resolveCrisis = useResolveCrisis()
  const logActivity = useLogActivityUsage()

  const { data: contacts    = [] } = useEmergencyContacts()
  const { data: activities  = [] } = useActivities()
  const { data: quotes      = [] } = useQuotes()

  const crisisRef = useRef<CrisisLog | null>(null)
  const loggedRef  = useRef(false)
  const [resolved, setResolved] = useState(false)

  // Stable random quote — memoized so it doesn't change on re-render
  const randomQuote = useMemo(
    () => quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null,
    [quotes],
  )

  // Log crisis once on mount. The ref guard prevents duplicate logs in StrictMode.
  useEffect(() => {
    if (loggedRef.current) return
    loggedRef.current = true
    logCrisis.mutateAsync(undefined).then((log) => { crisisRef.current = log })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResolve = async () => {
    if (crisisRef.current) {
      await resolveCrisis.mutateAsync(crisisRef.current.id)
    }
    setResolved(true)
    setTimeout(() => navigate('/'), 500)
  }

  if (resolved) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-brand-700">İyi ki buradasın</p>
          <p className="text-sm text-brand-500">Ana sayfaya dönülüyor…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe pt-6 pb-4 border-b border-brand-100">
        <div>
          <h1 className="text-lg font-semibold text-brand-800">Buradayım, merak etme</h1>
          <p className="text-sm text-brand-500 mt-0.5">Birlikte geçirelim</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 max-w-lg mx-auto w-full">

        {/* Breathing */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-gray-800 mb-1">Önce birlikte nefes alalım</p>
          <p className="text-xs text-gray-400 mb-4">Döngüyü takip et — beyin yavaş yavaş sakinleşecek</p>
          <BreathingGuide />
        </div>

        {/* Emergency contacts */}
        {contacts.length > 0 && (
          <div className="card p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-800">Birini ara</p>
            <div className="space-y-2">
              {contacts.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl hover:bg-brand-50 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-brand-700">{c.name}</p>
                    {c.relation && <p className="text-xs text-gray-400">{c.relation}</p>}
                  </div>
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                    <Phone size={15} className="text-brand-600" />
                  </div>
                </a>
              ))}
            </div>
            <a
              href="tel:182"
              className="flex items-center justify-between p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-amber-800">Türkiye İntihar Önleme Hattı</p>
                <p className="text-xs text-amber-600">7/24 ücretsiz</p>
              </div>
              <div className="flex items-center gap-1 text-amber-700 font-semibold text-sm">
                182 <ChevronRight size={14} />
              </div>
            </a>
          </div>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <div className="card p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-800">Sana iyi gelen bir şey yap</p>
            <div className="grid grid-cols-2 gap-2">
              {activities.slice(0, 6).map((a) => (
                <button
                  key={a.id}
                  onClick={() => logActivity.mutate(a)}
                  className="flex items-center gap-2 p-3 bg-surface-secondary rounded-xl text-left hover:bg-brand-50 transition-colors active:scale-95"
                >
                  {a.icon && <span className="text-lg">{a.icon}</span>}
                  <span className="text-sm text-gray-700 leading-snug">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Personal quote */}
        {randomQuote && (
          <div className="card p-5 bg-brand-50 border-brand-100">
            <p className="text-xs text-brand-400 mb-2 font-medium uppercase tracking-wide">Kendi sözün</p>
            <p className="text-sm text-brand-800 italic leading-relaxed">"{randomQuote.text}"</p>
          </div>
        )}

        {/* Resolve */}
        <div className="pb-4">
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={handleResolve}
          >
            İyileştim, teşekkürler
          </Button>
        </div>

      </div>
    </div>
  )
}
