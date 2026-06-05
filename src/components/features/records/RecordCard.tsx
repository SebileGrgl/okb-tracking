import { Clock } from 'lucide-react'
import { formatDateTime } from '../../../utils/date'
import { ANXIETY_COLORS } from '../../../utils/constants'
import TagChip from '../../ui/TagChip'
import type { OKBRecord, Tag } from '../../../types'

interface RecordCardProps {
  record: OKBRecord
  tags: Tag[]
  onClick?: () => void
}

function getTagLabels(ids: string[], allTags: Tag[]): string[] {
  return ids
    .map((id) => allTags.find((t) => t.id === id)?.label)
    .filter(Boolean) as string[]
}

export default function RecordCard({ record, tags, onClick }: RecordCardProps) {
  const triggerLabels   = getTagLabels(record.trigger_tag_ids, tags)
  const obsessionLabels = getTagLabels(record.obsession_tag_ids, tags)
  const compLabels      = getTagLabels(record.compulsion_tag_ids, tags)
  const anxietyColor    = record.anxiety_level ? ANXIETY_COLORS[record.anxiety_level] : null

  return (
    <div
      onClick={onClick}
      className="card p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={12} />
          {formatDateTime(record.created_at)}
        </div>
        {anxietyColor && record.anxiety_level && (
          <div
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: anxietyColor }}
          >
            {record.anxiety_level}
          </div>
        )}
      </div>

      {triggerLabels.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Tetikleyici</p>
          <div className="flex flex-wrap gap-1.5">
            {triggerLabels.map((l) => <TagChip key={l} label={l} size="sm" />)}
          </div>
        </div>
      )}

      {obsessionLabels.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Obsesyon</p>
          <div className="flex flex-wrap gap-1.5">
            {obsessionLabels.map((l) => <TagChip key={l} label={l} size="sm" />)}
          </div>
        </div>
      )}

      {record.obsession_note && (
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{record.obsession_note}</p>
      )}

      {compLabels.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Kompülsiyon</p>
          <div className="flex flex-wrap gap-1.5">
            {compLabels.map((l) => <TagChip key={l} label={l} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  )
}
