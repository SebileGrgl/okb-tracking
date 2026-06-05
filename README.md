# OKB Takip — PWA

OKB (Obsesif Kompulsif Bozukluk) rahatsızlığı olan bireyler için semptom takip uygulaması.

## Teknoloji

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Grafikler**: Recharts
- **State**: Zustand
- **Form**: React Hook Form
- **PWA**: vite-plugin-pwa (offline destek, ana ekrana ekleme, push bildirim)

## Kurulum

### 1. Supabase projesi oluştur

1. [supabase.com](https://supabase.com) → New Project
2. SQL Editor'e gir → `supabase-schema.sql` dosyasını çalıştır
3. Project Settings > API → URL ve anon key'i kopyala

### 2. Projeyi kur

```bash
git clone <repo>
cd okb-app

cp .env.example .env
# .env dosyasını Supabase bilgileriyle doldur

npm install
npm run dev
```

### 3. Deploy (Vercel)

```bash
npm run build
# Vercel'e VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY env variable ekle
```

## Proje yapısı

```
src/
├── components/
│   ├── layout/     # AppLayout (bottom nav)
│   └── ui/         # CrisisButton, vb.
├── pages/
│   ├── Dashboard   # Ana ekran
│   ├── RecordForm  # Yeni kayıt formu
│   ├── Analiz      # Grafikler & istatistik
│   └── Login       # Magic link auth
├── store/          # Zustand global state
├── lib/
│   └── supabase.ts # Client + tipler
└── App.tsx         # Router + auth guard
```

## Özellikler (MVP)

- [x] Magic link ile şifresiz giriş
- [x] Kompulsiyon türü seçimi (6 kategori)
- [x] Anksiyete şiddeti (0–10 slider)
- [x] Süre ve tetikleyici kaydı
- [x] Haftalık anksiyete trend grafiği
- [x] Tetikleyici sıklık analizi
- [x] Günün saatine göre dağılım
- [x] Kriz butonu (kayıt + destek hattı bilgisi)
- [x] Offline destek (PWA / Service Worker)
- [x] Ana ekrana ekleme (manifest)
- [x] Row Level Security (her kullanıcı sadece kendi verisini görür)

## Sonraki aşama (v2)

- [ ] Push bildirim (günlük check-in hatırlatıcısı)
- [ ] ERP egzersiz rehberi
- [ ] PDF rapor çıktısı
- [ ] Claude API ile kişisel içgörüler
