'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Save, Plus, Package, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { narxFormat, sotuvNarx, type Product } from '@/lib/products'
import { useBuyurtma } from '@/lib/buyurtma-context'

const SUPABASE_URL = 'https://vvegadsrhgfsvabssljq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZWdhZHNyaGdmc3ZhYnNzbGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzU2MjgsImV4cCI6MjA5NzExMTYyOH0.OzbVdYDj3u6z1a925rzNSwWLQ6bXwRAZmU68fsTiZwk'

const kategoriyalar = ['Mexanik', 'Geyming', 'Simsiz', 'Ofis'] as const

async function dbGet(): Promise<Product[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  })
  const rows = await res.json()
  return rows.map((r: any) => r.data)
}

async function dbSave(products: Product[]) {
  for (const p of products) {
    await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: p.id, data: p }),
    })
  }
}

export function AdminPanel() {
  const router = useRouter()
  const { buyurtmalar, holatOzgartirish } = useBuyurtma()
  const [tab, setTab] = useState<'mahsulotlar' | 'buyurtmalar'>('buyurtmalar')
  const [items, setItems] = useState<Product[]>([])
  const [saqlandi, setSaqlandi] = useState(false)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [yangiBoshlangich, setYangiBoshlangich] = useState(false)
  const [yangi, setYangi] = useState({
    nomi: '', kategoriya: 'Mexanik' as Product['kategoriya'],
    bazaNarx: 0, ustamaFoiz: 30, ustamaSumma: 0,
    tavsif: '', reyting: 4.5,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('admin_kirgan')) {
        router.push('/admin/login')
        return
      }
    }
    dbGet().then(data => {
      if (data.length > 0) setItems(data)
    })
  }, [router])

  function yangilash(id: string, maydon: 'bazaNarx' | 'ustamaFoiz' | 'ustamaSumma', qiymat: number) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, [maydon]: qiymat } : p))
    setSaqlandi(false)
  }

  async function saqlash() {
    setYuklanmoqda(true)
    try {
      await dbSave(items)
      setSaqlandi(true)
      setTimeout(() => setSaqlandi(false), 3000)
    } catch (error) {
      console.error(error)
      alert("Xatolik yuz berdi!")
    } finally {
      setYuklanmoqda(false)
    }
  }

  function mahsulotQosh() {
    if (!yangi.nomi || !yangi.bazaNarx) return
    const id = 'kb-' + Math.random().toString(36).slice(2, 6)
    setItems(prev => [...prev, {
      id,
      nomi: yangi.nomi,
      kategoriya: yangi.kategoriya,
      bazaNarx: yangi.bazaNarx,
      ustamaFoiz: yangi.ustamaFoiz,
      ustamaSumma: yangi.ustamaSumma,
      rasm: '/placeholder.jpg',
      tavsif: yangi.tavsif,
      reyting: yangi.reyting,
    }])
    setYangi({ nomi: '', kategoriya: 'Mexanik', bazaNarx: 0, ustamaFoiz: 30, ustamaSumma: 0, tavsif: '', reyting: 4.5 })
    setYangiBoshlangich(false)
    setSaqlandi(false)
  }

  function chiqish() {
    if (typeof window !== 'undefined') localStorage.removeItem('admin_kirgan')
    router.push('/admin/login')
  }

  const holatRangi = (h: string) => {
    if (h === 'Yangi') return 'bg-green-500/10 text-green-400 border border-green-500/20'
    if (h === 'Tasdiqlangan') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    if (h === 'Yetkazildi') return 'bg-primary/10 text-primary border border-primary/20'
    return 'bg-destructive/10 text-destructive border border-destructive/20'
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            Do'konga qaytish
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">KLMINOV do'koni boshqaruvi</p>
        </div>
        <button onClick={chiqish} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chiqish</button>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('buyurtmalar')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${tab === 'buyurtmalar' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          <ShoppingBag className="size-4" />
          Buyurtmalar
          {buyurtmalar.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {buyurtmalar.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('mahsulotlar')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${tab === 'mahsulotlar' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          <Package className="size-4" />
          Mahsulotlar
        </button>
      </div>

      {tab === 'buyurtmalar' && (
        <div>
          {buyurtmalar.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-16 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto mb-3 size-10 opacity-40" />
              <p>Hozircha buyurtmalar yo'q</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buyurtmalar.map(b => (
                <div key={b.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{b.id} — {b.mijoz.ism}</p>
                      <p className="text-sm text-muted-foreground">{b.sana}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${holatRangi(b.holat)}`}>{b.holat}</span>
                      <select
                        value={b.holat}
                        onChange={e => holatOzgartirish(b.id, e.target.value as any)}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none"
                      >
                        <option>Yangi</option>
                        <option>Tasdiqlangan</option>
                        <option>Yetkazildi</option>
                        <option>Bekor qilindi</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="mb-1 text-xs text-muted-foreground">Manzil</p>
                      <p className="text-sm text-foreground">{b.mijoz.davlat}, {b.mijoz.shahar}</p>
                      <p className="text-sm text-foreground">{b.mijoz.tuman}, {b.mijoz.manzil}</p>
                      {b.mijoz.domYashash && (
                        <p className="mt-1 text-xs text-primary">Dom {b.mijoz.domNomeri}, kv.{b.mijoz.kvartira}, {b.mijoz.qavat}-qavat</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="mb-1 text-xs text-muted-foreground">Telefon</p>
                      <p className="text-sm text-foreground">{b.mijoz.telefon}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="mb-1 text-xs text-muted-foreground">Jami summa</p>
                      <p className="text-sm font-bold text-primary">{narxFormat(b.jami)}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="mb-2 text-xs text-muted-foreground">Mahsulotlar:</p>
                    <div className="space-y-1">
                      {b.mahsulotlar.map((m, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{m.nomi} × {m.soni}</span>
                          <span className="text-foreground">{narxFormat(m.narx * m.soni)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'mahsulotlar' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{items.length} ta mahsulot</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setYangiBoshlangich(!yangiBoshlangich)}>
                <Plus className="size-4" />
                Yangi mahsulot
              </Button>
              <Button size="sm" disabled={yuklanmoqda} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={saqlash}>
                <Save className="size-4" />
                {yuklanmoqda ? 'Saqlanmoqda...' : saqlandi ? 'Saqlandi! ✓' : 'Saqlash'}
              </Button>
            </div>
          </div>

          {yangiBoshlangich && (
            <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Yangi mahsulot qo'shish</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Nomi *</label>
                  <input value={yangi.nomi} onChange={e => setYangi(p => ({ ...p, nomi: e.target.value }))} placeholder="Klaviatura nomi" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Kategoriya</label>
                  <select value={yangi.kategoriya} onChange={e => setYangi(p => ({ ...p, kategoriya: e.target.value as any }))} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring">
                    {kategoriyalar.map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Tannarx (so'm) *</label>
                  <input type="number" value={yangi.bazaNarx || ''} onChange={e => setYangi(p => ({ ...p, bazaNarx: Number(e.target.value) }))} placeholder="500000" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Ustama %</label>
                  <input type="number" value={yangi.ustamaFoiz} onChange={e => setYangi(p => ({ ...p, ustamaFoiz: Number(e.target.value) }))} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-muted-foreground">Tavsif</label>
                  <input value={yangi.tavsif} onChange={e => setYangi(p => ({ ...p, tavsif: e.target.value }))} placeholder="Mahsulot tavsifi" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={mahsulotQosh} className="bg-primary text-primary-foreground hover:bg-primary/90">Qo'shish</Button>
                <Button size="sm" variant="outline" onClick={() => setYangiBoshlangich(false)}>Bekor</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Mahsulot</th>
                  <th className="p-4 font-medium">Tannarx (so'm)</th>
                  <th className="p-4 font-medium">Ustama %</th>
                  <th className="p-4 font-medium">Ustama (so'm)</th>
                  <th className="p-4 font-medium">Sotuv narxi</th>
                  <th className="p-4 font-medium">Foyda</th>
                  <th className="p-4 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const sotuv = sotuvNarx(p)
                  const foyda = sotuv - p.bazaNarx
                  return (
                    <tr key={p.id} className="border-b border-border/50 last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                            <Image src={p.rasm || '/placeholder.svg'} alt={p.nomi} fill className="object-contain p-1" sizes="48px" />
                          </div>
                          <span className="font-medium text-card-foreground">{p.nomi}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <input type="number" value={p.bazaNarx} onChange={e => yangilash(p.id, 'bazaNarx', Number(e.target.value))} className="w-28 rounded-md border border-input bg-background px-2 py-1.5 text-foreground outline-none focus:border-ring" />
                      </td>
                      <td className="p-4">
                        <input type="number" value={p.ustamaFoiz} onChange={e => yangilash(p.id, 'ustamaFoiz', Number(e.target.value))} className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-foreground outline-none focus:border-ring" />
                      </td>
                      <td className="p-4">
                        <input type="number" value={p.ustamaSumma} onChange={e => yangilash(p.id, 'ustamaSumma', Number(e.target.value))} className="w-28 rounded-md border border-input bg-background px-2 py-1.5 text-foreground outline-none focus:border-ring" />
                      </td>
                      <td className="p-4 font-semibold text-foreground">{narxFormat(sotuv)}</td>
                      <td className="p-4 font-semibold text-primary">{narxFormat(foyda)}</td>
                      <td className="p-4">
                        {(p as any).aliexpressUrl && (
                          <a href={(p as any).aliexpressUrl} target="_blank" rel="noopener noreferrer" className="inline-flex text-muted-foreground transition-colors hover:text-foreground">
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}