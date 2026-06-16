'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type MijozMalumot = {
  ism: string
  telefon: string
  davlat: string
  shahar: string
  tuman: string
  manzil: string
  domYashash: boolean
  domNomeri?: string
  kvartira?: string
  qavat?: string
}

export type BuyurtmaItem = {
  id: string
  nomi: string
  soni: number
  narx: number
}

export type Buyurtma = {
  id: string
  sana: string
  mijoz: MijozMalumot
  mahsulotlar: BuyurtmaItem[]
  jami: number
  holat: 'Yangi' | 'Tasdiqlangan' | 'Yetkazildi' | 'Bekor qilindi'
}

type BuyurtmaContextType = {
  buyurtmalar: Buyurtma[]
  buyurtmaQoshish: (mijoz: MijozMalumot, mahsulotlar: BuyurtmaItem[], jami: number) => void
  holatOzgartirish: (id: string, holat: Buyurtma['holat']) => void
}

const BuyurtmaContext = createContext<BuyurtmaContextType | null>(null)

export function BuyurtmaProvider({ children }: { children: ReactNode }) {
  const [buyurtmalar, setBuyurtmalar] = useState<Buyurtma[]>([])

  const buyurtmaQoshish = useCallback((
    mijoz: MijozMalumot,
    mahsulotlar: BuyurtmaItem[],
    jami: number
  ) => {
    const yangi: Buyurtma = {
      id: '#' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      sana: new Date().toLocaleString('uz-UZ'),
      mijoz,
      mahsulotlar,
      jami,
      holat: 'Yangi',
    }
    setBuyurtmalar(prev => [yangi, ...prev])
  }, [])

  const holatOzgartirish = useCallback((id: string, holat: Buyurtma['holat']) => {
    setBuyurtmalar(prev => prev.map(b => b.id === id ? { ...b, holat } : b))
  }, [])

  return (
    <BuyurtmaContext.Provider value={{ buyurtmalar, buyurtmaQoshish, holatOzgartirish }}>
      {children}
    </BuyurtmaContext.Provider>
  )
}

export function useBuyurtma() {
  const ctx = useContext(BuyurtmaContext)
  if (!ctx) throw new Error('useBuyurtma BuyurtmaProvider ichida ishlatilishi kerak')
  return ctx
}
