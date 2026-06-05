import type { TagType } from '../types'

export const DEFAULT_TAGS: Record<TagType, string[]> = {
  trigger: [
    'Stres',
    'Yorgunluk',
    'Sosyal ortam',
    'Temizlik',
    'Sağlık endişesi',
    'Ev',
    'İş / okul',
    'Hastalık',
    'Yalnızlık',
    'Belirsizlik',
  ],
  obsession: [
    'Kirlenme / mikrop',
    'Zarar verme',
    'Simetri / düzen',
    'Kontrol',
    'Dini / ahlaki',
    'Kimlik / cinsel',
    'Felaket senaryoları',
    'Hastalık korkusu',
  ],
  compulsion: [
    'Kontrol etme',
    'Yıkama / temizlik',
    'Tekrarlama',
    'Sayma',
    'Sıralama',
    'Zihinsel tekrarlama',
    'Güvence arama',
    'Kaçınma',
  ],
}

export const DEFAULT_ACTIVITIES = [
  { label: 'Derin nefes alma', icon: '🌬️' },
  { label: 'Yürüyüş', icon: '🚶' },
  { label: 'Müzik dinleme', icon: '🎵' },
  { label: 'Meditasyon', icon: '🧘' },
  { label: 'Sıcak duş', icon: '🚿' },
  { label: 'Çay / kahve', icon: '☕' },
  { label: 'Kitap okuma', icon: '📖' },
  { label: 'Arkadaşla konuşma', icon: '💬' },
  { label: 'Egzersiz', icon: '🏃' },
  { label: 'Film / dizi', icon: '🎬' },
]

export const ANXIETY_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#4ade80',
  3: '#86efac',
  4: '#fde047',
  5: '#fbbf24',
  6: '#fb923c',
  7: '#f97316',
  8: '#ef4444',
  9: '#dc2626',
  10: '#b91c1c',
}

export const TAG_TYPE_LABELS: Record<TagType, string> = {
  trigger: 'Tetikleyici',
  obsession: 'Obsesyon',
  compulsion: 'Kompülsiyon',
}
