'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'

export default function AdminFeedback() {
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
            <h1 className="text-2xl font-bold">Patient Feedback</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader><CardTitle>Reviews & Ratings</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p>No feedback yet</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
