import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, AnxietySlider, TagSelector, Textarea, Button } from '../components/ui'
import { useAddRecord } from '../hooks/useRecords'
import { useTags, useCreateTag } from '../hooks/useTags'
import type { Tag, TagType } from '../types'

function SectionCard({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="card p-5 space-y-3 h-full">
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function NewRecord() {
  const navigate   = useNavigate()
  const addRecord  = useAddRecord()
  const createTag  = useCreateTag()
  const { data: allTags = [] } = useTags()

  const [triggerIds,   setTriggerIds]   = useState<string[]>([])
  const [obsessionIds, setObsessionIds] = useState<string[]>([])
  const [compIds,      setCompIds]      = useState<string[]>([])
  const [obsNote,      setObsNote]      = useState('')
  const [anxiety,      setAnxiety]      = useState(5)
  const [hasAnxiety,   setHasAnxiety]   = useState(false)

  const tagsByType = (type: TagType): Tag[] => allTags.filter((t) => t.type === type)

  const handleCreate = async (type: TagType, label: string): Promise<Tag> =>
    createTag.mutateAsync({ type, label })

  const handleSave = async () => {
    await addRecord.mutateAsync({
      trigger_tag_ids:    triggerIds,
      obsession_tag_ids:  obsessionIds,
      compulsion_tag_ids: compIds,
      obsession_note:     obsNote.trim() || null,
      anxiety_level:      hasAnxiety ? anxiety : null,
    })
    navigate('/')
  }

  const isEmpty =
    triggerIds.length === 0 &&
    obsessionIds.length === 0 &&
    compIds.length === 0 &&
    !obsNote.trim() &&
    !hasAnxiety

  return (
    <div className="page-container-wide">
      <PageHeader title="Yeni Kayıt" subtitle="Ne yaşadığını kaydet" back />

      {/* ── xl: 2-col grid ── */}
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-2 xl:gap-8">

        {/* Left column */}
        <div className="space-y-5">
          <SectionCard
            title="Tetikleyici"
            description="Bu durumu neyin başlattığını düşünüyorsun?"
          >
            <TagSelector
              type="trigger"
              tags={tagsByType('trigger')}
              selectedIds={triggerIds}
              onChange={setTriggerIds}
              onCreateTag={(l) => handleCreate('trigger', l)}
            />
          </SectionCard>

          <SectionCard
            title="Obsesyon"
            description="Aklına takılan düşünceler veya korkular neler?"
          >
            <TagSelector
              type="obsession"
              tags={tagsByType('obsession')}
              selectedIds={obsessionIds}
              onChange={setObsessionIds}
              onCreateTag={(l) => handleCreate('obsession', l)}
            />
            <Textarea
              placeholder="Düşüncelerini daha detaylı ifade etmek istersen… (isteğe bağlı)"
              value={obsNote}
              onChange={(e) => setObsNote(e.target.value)}
              rows={3}
            />
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <SectionCard title="Anksiyete Şiddeti">
            {!hasAnxiety ? (
              <button
                onClick={() => setHasAnxiety(true)}
                className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors"
              >
                Şiddet ekle (isteğe bağlı)
              </button>
            ) : (
              <div className="space-y-3">
                <AnxietySlider value={anxiety} onChange={setAnxiety} />
                <button
                  onClick={() => setHasAnxiety(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
                >
                  Kaldır
                </button>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Kompülsiyon"
            description="Gerçekleştirdiğin davranışlar veya zihinsel eylemler?"
          >
            <TagSelector
              type="compulsion"
              tags={tagsByType('compulsion')}
              selectedIds={compIds}
              onChange={setCompIds}
              onCreateTag={(l) => handleCreate('compulsion', l)}
            />
          </SectionCard>

          <div className="mt-auto pb-2">
            <Button
              fullWidth
              size="lg"
              onClick={handleSave}
              loading={addRecord.isPending}
              disabled={isEmpty}
            >
              Kaydet
            </Button>
            {isEmpty && (
              <p className="text-xs text-gray-400 text-center mt-2">
                En az bir alan doldur
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
