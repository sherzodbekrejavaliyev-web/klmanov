'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useBuyurtma, type MijozMalumot } from '@/lib/buyurtma-context'
import { narxFormat } from '@/lib/products'

type Props = {
  ochiq: boolean
  yopish: () => void
}

export function CheckoutModal({ ochiq, yopish }: Props) {
  const { items, jamiNarx, tozalash } = useCart()
  const { buyurtmaQoshish } = useBuyurtma()
  const [muvaffaqiyat, setMuvaffaqiyat] = useState(false)
  const [domYashash, setDomYashash] = useState(false)

  const [f, setF] = useState({
    ism: '', telefon: '', davlat: "O'zbekiston",
    shahar: '', tuman: '', manzil: '',
    domNomeri: '', kvartira: '', qavat: '',
  })

  const o = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }))

  if (!ochiq) return null

  function yuborish() {
    if (!f.ism || !f.telefon || !f.shahar || !f.tuman || !f.manzil) return

    const mijoz: MijozMalumot = {
      ...f,
      domYashash,
    }

    buyurtmaQoshish(
      mijoz,
      items.map(i => ({ id: i.id, nomi: i.nomi, soni: i.soni, narx: i.narx })),
      jamiNarx
    )

    tozalash()
    setMuvaffaqiyat(true)
    setTimeout(() => {
      setMuvaffaqiyat(false)
      setF({ ism: '', telefon: '', davlat: "O'zbekiston", shahar: '', tuman: '', manzil: '', domNomeri: '', kvartira: '', qavat: '' })
      setDomYashash(false)
      yopish()
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={yopish} />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          {muvaffaqiyat ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Sparkles className="size-12 text-primary" />
              <p className="text-xl font-bold text-foreground">Buyurtma qabul qilindi!</p>
              <p className="text-sm text-muted-foreground">Tez orada operatorlarimiz siz bilan bog'lanadi.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Buyurtma berish</h2>
                <button onClick={yopish} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-5" />
                </button>
              </div>

              {/* Savatcha xulosasi */}
              <div className="mb-6 rounded-xl border border-border bg-card p-4 space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.nomi} × {item.soni}</span>
                    <span className="text-foreground font-medium">{narxFormat(item.narx * item.soni)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                  <span>Jami:</span>
                  <span className="text-primary">{narxFormat(jamiNarx)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Ism-familiya *</label>
                  <input value={f.ism} onChange={o('ism')} placeholder="Ismingizni kiriting"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Telefon *</label>
                  <input value={f.telefon} onChange={o('telefon')} placeholder="+998 90 000 00 00"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Davlat</label>
                  <input value={f.davlat} onChange={o('davlat')}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Shahar *</label>
                    <input value={f.shahar} onChange={o('shahar')} placeholder="Toshkent"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Tuman *</label>
                    <input value={f.tuman} onChange={o('tuman')} placeholder="Yunusobod"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Uy manzili *</label>
                  <input value={f.manzil} onChange={o('manzil')} placeholder="Ko'cha nomi, uy raqami"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                </div>

                {/* Dom checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={domYashash}
                    onChange={e => setDomYashash(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">Ko'p qavatli uyda (domda) yashayman</span>
                </label>

                {domYashash && (
                  <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dom ma'lumotlari</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">Dom №</label>
                        <input value={f.domNomeri} onChange={o('domNomeri')} placeholder="5"
                          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">Kvartira</label>
                        <input value={f.kvartira} onChange={o('kvartira')} placeholder="42"
                          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">Qavat</label>
                        <input value={f.qavat} onChange={o('qavat')} placeholder="7"
                          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={yuborish}
                >
                  Buyurtmani tasdiqlash
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
