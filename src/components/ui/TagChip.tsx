import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface TagChipProps {
  label: string
  selected?: boolean
  onToggle?: () => void
  onRemove?: () => void
  size?: 'sm' | 'md'
}

export default function TagChip({ label, selected = false, onToggle, onRemove, size = 'md' }: TagChipProps) {
  return (
    <span
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1 rounded-chip border transition-colors select-none',
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
        onToggle && 'cursor-pointer',
        selected
          ? 'bg-brand-500 border-brand-500 text-white'
          : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300',
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
