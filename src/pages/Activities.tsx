import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useActivities, useCreateActivity, useDeleteActivity, useLogActivityUsage } from '../hooks/useActivities'
import { Button, Input, EmptyState, PageHeader } from '../components/ui'

const EMOJI_OPTIONS = ['🌬️','🚶','🎵','🧘','🚿','☕','📖','💬','🏃','🎬','🌿','🎨','✍️','🐾','🌊','🧩']

export default function Activities() {
  const { data: activities = [] } = useActivities()
  const createActivity = useCreateActivity()
  const deleteActivity = useDeleteActivity()
  const logUsage       = useLogActivityUsage()

  const [creating, setCreating] = useState(false)
  const [label, setLabel]       = useState('')
  const [icon, setIcon]         = useState('🌿')

  const handleCreate = async () => {
    if (!label.trim()) return
    await createActivity.mutateAsync({ label: label.trim(), icon })
    setLabel('')
    setIcon('🌿')
    setCreating(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Rahatlatıcı Aktiviteler"
        subtitle="Zorlu anlarda sana iyi gelen şeyler"
        back
        action={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={15} />
            Ekle
          </Button>
        }
      />

      {/* Create form */}
      {creating && (
        <div className="card p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Yeni aktivite</p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">İkon seç</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-colors ${
                    icon === e ? 'bg-brand-100 ring-2 ring-brand-400' : 'bg-surface-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Aktivite adı"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
            placeholder="ör. Nefes egzersizi"
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setCreating(false); setLabel('') }} className="flex-1">İptal</Button>
            <Button onClick={handleCreate} disabled={!label.trim()} loading={createActivity.isPending} className="flex-1">Ekle</Button>
          </div>
        </div>
      )}

      {/* Activity grid */}
      {activities.length === 0 && !creating ? (
        <EmptyState
          title="Henüz aktivite yok"
          description="Kriz anında sana iyi gelen aktiviteleri ekle"
          action={<Button size="sm" onClick={() => setCreating(true)}><Plus size={15} />Aktivite ekle</Button>}
        />
      ) : (
        <div className="space-y-2">
          {activities.map((a) => (
            <div
              key={a.id}
              className="card px-4 py-3 flex items-center gap-3 group"
            >
              <button
                onClick={() => logUsage.mutate(a)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 bg-surface-secondary rounded-xl flex items-center justify-center text-xl shrink-0">
                  {a.icon ?? '✨'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.label}</p>
                  <p className="text-xs text-gray-400">{a.usage_count} kez kullanıldı</p>
                </div>
              </button>
              <button
                onClick={() => deleteActivity.mutate(a.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1.5"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
