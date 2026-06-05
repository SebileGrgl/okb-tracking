import { useState, useRef } from 'react'
import { Plus, Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import TagChip from './TagChip'
import type { Tag, TagType } from '../../types'

interface TagSelectorProps {
  type: TagType
  tags: Tag[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  onCreateTag: (label: string) => Promise<Tag>
}

export default function TagSelector({ tags, selectedIds, onChange, onCreateTag }: TagSelectorProps) {
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    )
  }

  const handleCreate = async () => {
    const label = newLabel.trim()
    if (!label || creating) return
    setCreating(true)
    try {
      const tag = await onCreateTag(label)
      onChange([...selectedIds, tag.id])
      setNewLabel('')
      setAdding(false)
    } finally {
      setCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleCreate() }
    if (e.key === 'Escape') { setAdding(false); setNewLabel('') }
  }

  const startAdding = () => {
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagChip
          key={tag.id}
          label={tag.label}
          selected={selectedIds.includes(tag.id)}
          onToggle={() => toggle(tag.id)}
        />
      ))}

      {adding ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Etiket adı…"
            className={cn(
              'text-sm border border-brand-300 rounded-chip px-3 py-1.5',
              'focus:outline-none focus:ring-2 focus:ring-brand-300',
              'w-32 bg-white',
            )}
          />
          <button
            onClick={handleCreate}
            disabled={!newLabel.trim() || creating}
            className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Check size={13} />
          </button>
        </div>
      ) : (
        <button
          onClick={startAdding}
          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-chip border border-dashed border-gray-300 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors"
        >
          <Plus size={13} />
          Yeni
        </button>
      )}
    </div>
  )
}
