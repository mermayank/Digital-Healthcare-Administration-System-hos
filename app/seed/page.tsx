'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const seedAll = async () => {
    setLoading(true)
    setMessage('')
    try {
      // Seed doctors
      const doctorResponse = await fetch('/api/seed/doctors', { method: 'POST' })
      const doctorData = await doctorResponse.json()
      
      // Seed admin (if not exists)
      const adminResponse = await fetch('/api/seed/admin', { method: 'POST' })
      const adminData = await adminResponse.json()
      
      // Seed patient
      const patientResponse = await fetch('/api/seed/patient', { method: 'POST' })
      const patientData = await patientResponse.json()

      setMessage(
        `✅ ${doctorData.message || 'Doctors created'}. ` +
        `${adminData.message || 'Admin created'}. ` +
        `${patientData.message || 'Patient created'}.`
      )
    } catch (error) {
      setMessage('❌ Error seeding data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button to add sample data to the database.
          </p>
          <Button onClick={seedAll} disabled={loading} className="w-full">
            {loading ? 'Seeding...' : 'Seed All Data'}
          </Button>
          {message && (
            <div className="p-3 text-sm bg-blue-50 border border-blue-200 rounded-md">
              {message}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-4 space-y-3">
            <div>
              <p className="font-semibold">Credentials to sign in:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Admin:</strong> admin@hospital.com / admin123</li>
                <li><strong>Patient:</strong> patient@hospital.com / patient123</li>
                <li><strong>Doctors:</strong> e.g. john.smith@hospital.com / doctor123</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">This will create:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>1 Admin user</li>
                <li>1 Patient user</li>
                <li>5 Sample doctors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
