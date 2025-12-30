'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DoctorSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    specialization: '',
    experience: '',
    consultationFee: '',
    bio: ''
  })

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
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Specialization</Label><Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} /></div>
              <div className="space-y-2"><Label>Experience (years)</Label><Input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} /></div>
              <div className="space-y-2"><Label>Consultation Fee</Label><Input type="number" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Bio</Label><textarea className="flex min-h-[100px] w-full rounded-md border border-input px-3 py-2 text-sm" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
          <CardContent><Button variant="destructive">Delete Account</Button></CardContent>
        </Card>
      </main>
    </div>
  )
}
