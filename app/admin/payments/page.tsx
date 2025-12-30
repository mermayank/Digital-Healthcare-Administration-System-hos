'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const pages = [
  { path: 'payments', title: 'Payment Overview', description: 'View all transactions and payment history' },
  { path: 'messages', title: 'Messages & Announcements', description: 'Send messages to doctors and staff' },
  { path: 'feedback', title: 'Patient Feedback', description: 'View patient ratings and reviews' }
]

export default function AdminPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => { if (status === 'unauthenticated') router.push('/auth/signin?role=admin') }, [status, router])
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!session) return null
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-2xl font-bold capitalize">{params.slug}</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader><CardTitle>Content</CardTitle></CardHeader>
          <CardContent><div className="text-center py-12 text-gray-500">Feature coming soon</div></CardContent>
        </Card>
      </main>
    </div>
  )
}
