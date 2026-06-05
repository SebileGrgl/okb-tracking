import { useState } from 'react'
import {
  Plus, Trash2, Check, ChevronDown, ChevronUp, CheckCircle, Clock,
} from 'lucide-react'
import {
  useChecklists, useChecklistItems, useChecklistCompletions,
  useCreateChecklist, useDeleteChecklist, useAddChecklistItem,
  useDeleteChecklistItem, useCompleteChecklist,
} from '../hooks/useChecklists'
import { Button, Input, EmptyState, PageHeader } from '../components/ui'
import { formatDateTime } from '../utils/date'
import type { ChecklistItem } from '../types'

interface ChecklistDetailProps {
  checklistId: string
  onDelete: () => void
}

function ChecklistDetail({ checklistId, onDelete }: ChecklistDetailProps) {
  const { data: items = [] }       = useChecklistItems(checklistId)
  const { data: completions = [] } = useChecklistCompletions(checklistId)
  const addItem        = useAddChecklistItem()
  const deleteItem     = useDeleteChecklistItem()
  const completeList   = useCompleteChecklist()

  const [checked, setChecked]     = useState<Set<string>>(new Set())
  const [newLabel, setNewLabel]   = useState('')
  const [showHistory, setHistory] = useState(false)
  const [justDone, setJustDone]   = useState(false)

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const allChecked = items.length > 0 && items.every((i) => checked.has(i.id))

  const handleAddItem = async () => {
    const label = newLabel.trim()
    if (!label) return
    await addItem.mutateAsync({ checklistId, label, position: items.length })
    setNewLabel('')
  }

  const handleComplete = async () => {
    await completeList.mutateAsync({
      checklistId,
      itemsCompleted: checked.size,
      itemsTotal: items.length,
    })
    setChecked(new Set())
    setJustDone(true)
    setTimeout(() => setJustDone(false), 3000)
  }

  return (
    <div className="space-y-3">
      {/* Checklist items */}
      <div className="space-y-1.5">
        {items.map((item: ChecklistItem) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 group"
          >
            <button
              onClick={() => toggle(item.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked.has(item.id)
                  ? 'bg-brand-500 border-brand-500'
                  : 'border-gray-300 hover:border-brand-400'
              }`}
            >
              {checked.has(item.id) && <Check size={11} strokeWidth={3} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm transition-colors ${
              checked.has(item.id) ? 'line-through text-gray-400' : 'text-gray-700'
            }`}>
              {item.label}
            </span>
            <button
              onClick={() => deleteItem.mutate({ id: item.id, checklistId })}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem() }}
          placeholder="Yeni madde ekle…"
          className="flex-1"
        />
        <Button
          variant="secondary"
          onClick={handleAddItem}
          disabled={!newLabel.trim()}
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Complete */}
      {items.length > 0 && (
        <div className="space-y-2">
          {justDone ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-brand-50 rounded-xl text-brand-700 text-sm font-medium">
              <CheckCircle size={18} />
              Tamamlandı!
            </div>
          ) : (
            <Button
              fullWidth
              onClick={handleComplete}
              loading={completeList.isPending}
              disabled={!allChecked}
              variant={allChecked ? 'primary' : 'ghost'}
            >
              <Check size={16} />
              {allChecked ? 'Tamamla' : `${checked.size}/${items.length} işaretlendi`}
            </Button>
          )}
        </div>
      )}

      {/* History */}
      {completions.length > 0 && (
        <div>
          <button
            onClick={() => setHistory((h) => !h)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            <Clock size={12} />
            Geçmiş ({completions.length})
            {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showHistory && (
            <div className="space-y-1.5 mt-2">
              {completions.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs text-gray-500 py-1.5 px-3 bg-surface-secondary rounded-lg">
                  <span>{formatDateTime(c.completed_at)}</span>
                  <span className="text-brand-600 font-medium">{c.items_completed}/{c.items_total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={onDelete}
        className="text-xs text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 pt-1"
      >
        <Trash2 size={12} />
        Listeyi sil
      </button>
    </div>
  )
}

interface ChecklistRowProps {
  id: string
  title: string
  onDelete: () => void
}

function ChecklistRow({ id, title, onDelete }: ChecklistRowProps) {
  const [open, setOpen] = useState(false)
  const { data: items = [] } = useChecklistItems(id)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle size={16} className="text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{items.length} madde</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <ChecklistDetail checklistId={id} onDelete={onDelete} />
        </div>
      )}
    </div>
  )
}

export default function Checklists() {
  const { data: checklists = [], isLoading } = useChecklists()
  const createChecklist = useCreateChecklist()
  const deleteChecklist = useDeleteChecklist()

  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    const title = newTitle.trim()
    if (!title) return
    await createChecklist.mutateAsync(title)
    setNewTitle('')
    setCreating(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Kontrol Listeleri"
        subtitle="Ev çıkış, uyku öncesi ve diğer rutinlerin"
        action={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={15} />
            Yeni Liste
          </Button>
        }
      />

      {/* New checklist form */}
      {creating && (
        <div className="card p-5 space-y-3">
          <p className="text-sm font-medium text-gray-800">Liste adı</p>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
            placeholder="ör. Evden çıkış kontrolü"
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setCreating(false); setNewTitle('') }} className="flex-1">İptal</Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()} loading={createChecklist.isPending} className="flex-1">Oluştur</Button>
          </div>
        </div>
      )}

      {/* Lists */}
      {isLoading ? null : checklists.length === 0 && !creating ? (
        <EmptyState
          icon={<CheckCircle size={22} />}
          title="Henüz liste yok"
          description="Kontrol etmen gereken şeyler için listeler oluştur"
          action={
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus size={15} />
              Yeni Liste
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {checklists.map((cl) => (
            <ChecklistRow
              key={cl.id}
              id={cl.id}
              title={cl.title}
              onDelete={() => deleteChecklist.mutate(cl.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
