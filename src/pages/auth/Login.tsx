import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Input, Button } from '../../components/ui'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">OKB Takip</h1>
            <p className="text-sm text-gray-400 mt-1">Semptomlarını takip et, kendini daha iyi anla</p>
          </div>
        </div>

        {sent ? (
          <div className="card p-5 text-center space-y-2">
            <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
              <svg width="20" height="20" fill="none" stroke="#218c74" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="font-medium text-gray-800">Bağlantı gönderildi</p>
            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-600">{email}</span> adresine giriş bağlantısı gönderdik.
              E-postanı kontrol et.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <Input
              label="E-posta adresi"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              autoComplete="email"
            />
            <Button type="submit" fullWidth loading={loading}>
              Giriş bağlantısı gönder
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Şifre gerekmez — e-postana güvenli bağlantı göndeririz.
            </p>
          </form>
        )}

      </div>
    </div>
  )
}
