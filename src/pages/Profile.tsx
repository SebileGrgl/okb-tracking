import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  User, Phone, Quote, Tag, ChevronRight, Trash2, Plus, LogOut, Activity,
} from 'lucide-react'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'
import { useEmergencyContacts, useCreateContact, useDeleteContact } from '../hooks/useEmergencyContacts'
import { useQuotes, useCreateQuote, useDeleteQuote } from '../hooks/useQuotes'
import { useTags, useDeleteTag } from '../hooks/useTags'
import { Button, Input, Modal, PageHeader, TagChip } from '../components/ui'
import { signOut } from '../hooks/useAuth'
import { TAG_TYPE_LABELS } from '../utils/constants'
import type { TagType } from '../types'

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-brand-500" />
      <p className="text-sm font-semibold text-gray-800">{title}</p>
    </div>
  )
}

function SettingRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 border-b border-gray-50 last:border-0 text-left"
    >
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-400">{value}</span>}
        {onClick && <ChevronRight size={16} className="text-gray-300" />}
      </div>
    </button>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()
  const updateProfile     = useUpdateProfile()
  const { data: contacts = [] }  = useEmergencyContacts()
  const { data: quotes = [] }    = useQuotes()
  const { data: tags = [] }      = useTags()
  const createContact  = useCreateContact()
  const deleteContact  = useDeleteContact()
  const createQuote    = useCreateQuote()
  const deleteQuote    = useDeleteQuote()
  const deleteTag      = useDeleteTag()

  const [nameModal, setNameModal]         = useState(false)
  const [contactModal, setContactModal]   = useState(false)
  const [quoteModal, setQuoteModal]       = useState(false)
  const [tagTab, setTagTab]               = useState<TagType>('trigger')
  const [showTags, setShowTags]           = useState(false)

  const [newName, setNewName]         = useState(profile?.display_name ?? '')
  const [newContact, setNewContact]   = useState({ name: '', phone: '', relation: '' })
  const [newQuoteText, setNewQuoteText] = useState('')

  const handleSaveName = async () => {
    await updateProfile.mutateAsync({ display_name: newName.trim() || null })
    setNameModal(false)
  }

  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.phone) return
    await createContact.mutateAsync(newContact)
    setNewContact({ name: '', phone: '', relation: '' })
    setContactModal(false)
  }

  const handleSaveQuote = async () => {
    if (!newQuoteText.trim()) return
    await createQuote.mutateAsync(newQuoteText.trim())
    setNewQuoteText('')
    setQuoteModal(false)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const tagsByType = tags.filter((t) => t.type === tagTab)

  return (
    <div className="page-container-wide">
      <PageHeader title="Profil" />

      {/* ── xl: 2-col grid ── */}
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-2 xl:gap-8">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Hesap */}
          <div className="card p-5">
            <SectionHeader icon={User} title="Hesap" />
            <SettingRow
              label="İsim"
              value={profile?.display_name ?? 'Belirtilmemiş'}
              onClick={() => { setNewName(profile?.display_name ?? ''); setNameModal(true) }}
            />
          </div>

          {/* Acil Durum Kişileri */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-brand-500" />
                <p className="text-sm font-semibold text-gray-800">Acil Durum Kişileri</p>
              </div>
              <button
                onClick={() => setContactModal(true)}
                className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            {contacts.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">Henüz kişi eklemedin</p>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.phone}{c.relation ? ` · ${c.relation}` : ''}</p>
                    </div>
                    <button
                      onClick={() => deleteContact.mutate(c.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Motivasyon Sözleri */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Quote size={16} className="text-brand-500" />
                <p className="text-sm font-semibold text-gray-800">Motivasyon Sözleri</p>
              </div>
              <button
                onClick={() => setQuoteModal(true)}
                className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Kriz anında sana bunlardan birini göstereceğiz</p>
            {quotes.length === 0 ? (
              <p className="text-sm text-gray-400">Henüz söz eklemedin</p>
            ) : (
              <div className="space-y-2">
                {quotes.map((q) => (
                  <div key={q.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <p className="flex-1 text-sm text-gray-700 italic">"{q.text}"</p>
                    <button
                      onClick={() => deleteQuote.mutate(q.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Etiket Yönetimi */}
          <div className="card p-5">
            <button
              onClick={() => setShowTags((s) => !s)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-brand-500" />
                <p className="text-sm font-semibold text-gray-800">Etiket Yönetimi</p>
              </div>
              <ChevronRight size={16} className={`text-gray-300 transition-transform ${showTags ? 'rotate-90' : ''}`} />
            </button>
            {showTags && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-1 p-1 bg-surface-tertiary rounded-xl">
                  {(['trigger', 'obsession', 'compulsion'] as TagType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTagTab(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        tagTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      {TAG_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {tagsByType.map((tag) => (
                    <TagChip
                      key={tag.id}
                      label={tag.label}
                      onRemove={() => deleteTag.mutate(tag.id)}
                      size="sm"
                    />
                  ))}
                  {tagsByType.length === 0 && (
                    <p className="text-xs text-gray-400 py-2">Bu türde etiket yok</p>
                  )}
                </div>
                <p className="text-xs text-gray-400">Etiketler kayıt sayfasında da eklenebilir</p>
              </div>
            )}
          </div>

          {/* Aktiviteler — alt hizaya sabitlenmiş */}
          <button
            onClick={() => navigate('/aktiviteler')}
            className="card p-5 flex items-center justify-between w-full hover:shadow-md transition-shadow mt-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                <Activity size={18} className="text-brand-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Rahatlatıcı Aktiviteler</p>
                <p className="text-xs text-gray-400">Kriz anında önerilen aktiviteler</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

        </div>
      </div>

      {/* Sign out — full width */}
      <div className="pb-4">
        <Button variant="danger" fullWidth onClick={handleSignOut}>
          <LogOut size={16} />
          Çıkış Yap
        </Button>
      </div>

      {/* Modals */}
      <Modal open={nameModal} onClose={() => setNameModal(false)} title="İsmi Düzenle" size="sm">
        <div className="space-y-4">
          <Input
            label="İsmin"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <Button fullWidth onClick={handleSaveName} loading={updateProfile.isPending}>
            Kaydet
          </Button>
        </div>
      </Modal>

      <Modal open={contactModal} onClose={() => setContactModal(false)} title="Kişi Ekle">
        <div className="space-y-3">
          <Input
            label="İsim"
            value={newContact.name}
            onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))}
            placeholder="Adı Soyadı"
          />
          <Input
            label="Telefon"
            type="tel"
            value={newContact.phone}
            onChange={(e) => setNewContact((c) => ({ ...c, phone: e.target.value }))}
            placeholder="+90 5xx xxx xx xx"
          />
          <Input
            label="İlişki (isteğe bağlı)"
            value={newContact.relation}
            onChange={(e) => setNewContact((c) => ({ ...c, relation: e.target.value }))}
            placeholder="ör. Anne, Arkadaş, Terapist"
          />
          <Button
            fullWidth
            onClick={handleSaveContact}
            disabled={!newContact.name || !newContact.phone}
            loading={createContact.isPending}
          >
            Ekle
          </Button>
        </div>
      </Modal>

      <Modal open={quoteModal} onClose={() => setQuoteModal(false)} title="Söz Ekle" size="sm">
        <div className="space-y-4">
          <Input
            label="Söz"
            value={newQuoteText}
            onChange={(e) => setNewQuoteText(e.target.value)}
            placeholder="Sana iyi gelen bir söz…"
            autoFocus
          />
          <Button
            fullWidth
            onClick={handleSaveQuote}
            disabled={!newQuoteText.trim()}
            loading={createQuote.isPending}
          >
            Ekle
          </Button>
        </div>
      </Modal>
    </div>
  )
}
