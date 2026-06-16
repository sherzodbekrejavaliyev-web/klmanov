import { BuyurtmaProvider } from '@/lib/buyurtma-context'
import { AdminPanel } from '@/components/admin-panel'

export const metadata = {
  title: 'Admin panel — KLMINOV',
}

export default function AdminPage() {
  return (
    <BuyurtmaProvider>
      <main className="min-h-screen bg-background">
        <AdminPanel />
      </main>
    </BuyurtmaProvider>
  )
}
