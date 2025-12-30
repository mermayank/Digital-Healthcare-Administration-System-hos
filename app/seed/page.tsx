'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const seedDoctors = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/seed/doctors', {
        method: 'POST'
      })
      const data = await response.json()
      if (response.ok) {
        setMessage(`✅ ${data.message}. Created ${data.count} doctors.`)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Error seeding doctors')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button below to add sample doctors to the database.
          </p>
          <Button onClick={seedDoctors} disabled={loading} className="w-full">
            {loading ? 'Seeding...' : 'Seed Sample Doctors'}
          </Button>
          {message && (
            <div className="p-3 text-sm bg-blue-50 border border-blue-200 rounded-md">
              {message}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-4">
            <p>This will create 5 sample doctors:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Dr. John Smith - Cardiology</li>
              <li>Dr. Sarah Johnson - Neurology</li>
              <li>Dr. Mike Brown - Orthopedics</li>
              <li>Dr. Emily Davis - Pediatrics</li>
              <li>Dr. Robert Wilson - Dermatology</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
