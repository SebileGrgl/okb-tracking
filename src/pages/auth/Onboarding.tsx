import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import { Button, Input } from '../../components/ui'
import { useUpdateProfile } from '../../hooks/useProfile'
import { useCreateContact } from '../../hooks/useEmergencyContacts'
import { useCreateActivity } from '../../hooks/useActivities'
import { useCreateTag } from '../../hooks/useTags'
import { DEFAULT_ACTIVITIES, DEFAULT_TAGS } from '../../utils/constants'
import type { TagType } from '../../types'

const TOTAL_STEPS = 4

interface ContactInput { name: string; phone: string; relation: string }
interface ActivityInput { label: string; icon: string }

export default function Onboarding() {
  const navigate = useNavigate()
  const updateProfile   = useUpdateProfile()
  const createContact   = useCreateContact()
  const createActivity  = useCreateActivity()
  const createTag       = useCreateTag()

  const [step, setStep]       = useState(1)
  const [saving, setSaving]   = useState(false)
  const [name, setName]       = useState('')

  const [contacts, setContacts]     = useState<ContactInput[]>([{ name: '', phone: '', relation: '' }])
  const [activities, setActivities] = useState<ActivityInput[]>(DEFAULT_ACTIVITIES.slice(0, 5))

  const progress = (step / TOTAL_STEPS) * 100

  const addContact    = () => setContacts((c) => [...c, { name: '', phone: '', relation: '' }])
  const removeContact = (i: number) => setContacts((c) => c.filter((_, idx) => idx !== i))
  const updateContact = (i: number, field: keyof ContactInput, value: string) =>
    setContacts((c) => c.map((x, idx) => idx === i ? { ...x, [field]: value } : x))

  const toggleActivity = (a: ActivityInput) => {
    setActivities((prev) => {
      const exists = prev.find((x) => x.label === a.label)
      return exists ? prev.filter((x) => x.label !== a.label) : [...prev, a]
    })
  }

  const isActivitySelected = (label: string) => activities.some((a) => a.label === label)

  const handleFinish = async () => {
    setSaving(true)
    try {
      if (name) await updateProfile.mutateAsync({ display_name: name })

      const validContacts = contacts.filter((c) => c.name && c.phone)
      await Promise.all(validContacts.map((c) =>
        createContact.mutateAsync(c).catch(() => null)
      ))

      await Promise.all(activities.map((a) =>
        createActivity.mutateAsync(a).catch(() => null)
      ))

      // Ignore duplicate tag errors (unique constraint) — safe to retry
      const tagTypes: TagType[] = ['trigger', 'obsession', 'compulsion']
      for (const type of tagTypes) {
        await Promise.all(DEFAULT_TAGS[type].map((label) =>
          createTag.mutateAsync({ type, label }).catch(() => null)
        ))
      }

      await updateProfile.mutateAsync({ onboarding_completed: true })
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Onboarding error:', err)
      // Still try to mark onboarding complete so user isn't stuck
      try {
        await updateProfile.mutateAsync({ onboarding_completed: true })
        navigate('/', { replace: true })
      } catch {
        // If this also fails, user needs to retry
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Kurulum</span>
            <span>{step}/{TOTAL_STEPS}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="card p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Merhaba! 👋</h2>
              <p className="text-sm text-gray-500">Seni nasıl çağıralım?</p>
            </div>
            <Input
              label="İsmin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adın veya lakabın"
              autoFocus
            />
            <Button fullWidth onClick={() => setStep(2)}>
              Devam
            </Button>
          </div>
        )}

        {/* Step 2: Emergency Contacts */}
        {step === 2 && (
          <div className="card p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Acil durum kişileri</h2>
              <p className="text-sm text-gray-500">
                Zorlandığında ulaşabileceğin kişileri ekle. Kriz anında bunları sana göstereceğiz.
              </p>
            </div>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div key={i} className="bg-surface-secondary rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Kişi {i + 1}</span>
                    {contacts.length > 1 && (
                      <button onClick={() => removeContact(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="İsim"
                    value={c.name}
                    onChange={(e) => updateContact(i, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Telefon numarası"
                    type="tel"
                    value={c.phone}
                    onChange={(e) => updateContact(i, 'phone', e.target.value)}
                  />
                  <Input
                    placeholder="İlişki (ör. Anne, Arkadaş)"
                    value={c.relation}
                    onChange={(e) => updateContact(i, 'relation', e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={addContact}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors"
              >
                <Plus size={15} />
                Kişi ekle
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Geri</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Devam</Button>
            </div>
          </div>
        )}

        {/* Step 3: Activities */}
        {step === 3 && (
          <div className="card p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Rahatlatıcı aktiviteler</h2>
              <p className="text-sm text-gray-500">
                Zorlandığında sana iyi gelen şeyleri seç. Bunları kriz anında önereceğiz.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_ACTIVITIES.map((a) => (
                <button
                  key={a.label}
                  onClick={() => toggleActivity(a)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-chip border text-sm transition-colors ${
                    isActivitySelected(a.label)
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300'
                  }`}
                >
                  <span>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">Geri</Button>
              <Button onClick={() => setStep(4)} disabled={activities.length === 0} className="flex-1">Devam</Button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="card p-6 space-y-5 text-center">
            <div className="space-y-3">
              <CheckCircle size={40} className="text-brand-500 mx-auto" />
              <h2 className="text-lg font-semibold text-gray-900">Hazırsın!</h2>
              <p className="text-sm text-gray-500">
                Uygulamayı istediğin zaman özelleştirebilirsin.
                Kendine iyi bak.
              </p>
            </div>
            <Button fullWidth loading={saving} onClick={handleFinish}>
              Başlayalım
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
