'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function DoctorMessages() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    }
  }, [status, router])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/doctor/dashboard">
              <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader><CardTitle>Conversations</CardTitle></CardHeader>
            <CardContent><div className="text-center py-8 text-gray-500">No messages</div></CardContent>
          </Card>
          <Card className="md:col-span-2 h-[600px] flex flex-col">
            <CardHeader><CardTitle>Chat</CardTitle></CardHeader>
            <CardContent className="flex-1"><div className="text-center py-12 text-gray-500">Select a conversation</div></CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
