import { useState, useMemo } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { useRecords, useDeleteRecord } from '../hooks/useRecords'
import { useTags } from '../hooks/useTags'
import { PageHeader, EmptyState, LoadingSpinner } from '../components/ui'
import RecordCard from '../components/features/records/RecordCard'
import { formatDate, toDateKey } from '../utils/date'

export default function Records() {
  const { data: records = [], isLoading } = useRecords()
  const { data: tags = [] }               = useTags()
  const deleteRecord = useDeleteRecord()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return records
    const q = search.toLowerCase()
    return records.filter((r) => {
      const tagLabels = [
        ...r.trigger_tag_ids,
        ...r.obsession_tag_ids,
        ...r.compulsion_tag_ids,
      ]
        .map((id) => tags.find((t) => t.id === id)?.label ?? '')
        .join(' ')
        .toLowerCase()
      return tagLabels.includes(q) || r.obsession_note?.toLowerCase().includes(q)
    })
  }, [records, tags, search])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach((r) => {
      const key = toDateKey(r.created_at)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    })
    return Array.from(map.entries())
  }, [filtered])

  if (isLoading) {
    return (
      <div className="page-container">
        <PageHeader title="Tüm Kayıtlar" back />
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <PageHeader title="Tüm Kayıtlar" subtitle={`${records.length} kayıt`} back />

      {/* Search */}
      {records.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Etiket veya not ara…"
            className="input pl-9"
          />
        </div>
      )}

      {/* List */}
      {grouped.length === 0 ? (
        <EmptyState
          title="Kayıt bulunamadı"
          description={search ? 'Farklı bir arama dene' : 'Henüz kayıt eklemedin'}
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, dayRecords]) => (
            <div key={date} className="space-y-2">
              <p className="section-title">{formatDate(date + 'T00:00:00')}</p>
              {dayRecords.map((r) => (
                <div key={r.id} className="relative group">
                  <RecordCard record={r} tags={tags} />
                  <button
                    onClick={() => setConfirmDelete(r.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                  {confirmDelete === r.id && (
                    <div className="absolute inset-0 bg-white/95 rounded-card flex items-center justify-center gap-3 z-10">
                      <p className="text-sm text-gray-700">Bu kaydı sil?</p>
                      <button
                        onClick={() => { deleteRecord.mutate(r.id); setConfirmDelete(null) }}
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        İptal
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
