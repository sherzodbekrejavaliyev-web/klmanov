'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'sherzodbekrejavaliyev@gmail.com'
const ADMIN_PAROL = 'Xojiakbar344'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [parol, setParol] = useState('')
  const [xato, setXato] = useState('')

  function kirish() {
    if (email === ADMIN_EMAIL && parol === ADMIN_PAROL) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_kirgan', '1')
      }
      router.push('/admin')
    } else {
      setXato("Email yoki parol noto'g'ri!")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Admin panel</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">KLMINOV do'koni boshqaruvi</p>

        {xato && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
            {xato}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Parol</label>
            <input
              type="password"
              value={parol}
              onChange={e => setParol(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && kirish()}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
            />
          </div>
          <button
            onClick={kirish}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Kirish
          </button>
          <a
            href="/"
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Do'konga qaytish
          </a>
        </div>
      </div>
    </div>
  )
}
