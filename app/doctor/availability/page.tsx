'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DoctorAvailability() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [schedule, setSchedule] = useState({
    monday: { available: true, start: '09:00', end: '17:00' },
    tuesday: { available: true, start: '09:00', end: '17:00' },
    wednesday: { available: true, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '09:00', end: '17:00' },
    friday: { available: true, start: '09:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    }
  }, [status, router])

  const handleSave = () => {
    alert('Availability updated successfully!')
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard">
                <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
              </Link>
              <h1 className="text-2xl font-bold">Availability</h1>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(schedule).map(([day, config]) => (
              <div key={day} className="flex items-center gap-4 p-4 border rounded">
                <div className="w-32">
                  <Label className="capitalize">{day}</Label>
                </div>
                <input
                  type="checkbox"
                  checked={config.available}
                  onChange={(e) => setSchedule({...schedule, [day]: {...config, available: e.target.checked}})}
                  className="w-4 h-4"
                />
                <input type="time" value={config.start} disabled={!config.available} className="border rounded px-2 py-1" />
                <span>to</span>
                <input type="time" value={config.end} disabled={!config.available} className="border rounded px-2 py-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
