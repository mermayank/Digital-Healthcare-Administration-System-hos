'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminDoctors() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'doctor123',
    specialization: '',
    experience: '',
    consultationFee: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated') {
      fetchDoctors()
    }
  }, [status, router])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors')
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Doctor added successfully!')
        setShowForm(false)
        setFormData({
          name: '',
          email: '',
          password: 'doctor123',
          specialization: '',
          experience: '',
          consultationFee: ''
        })
        fetchDoctors()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add doctor')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
              <h1 className="text-2xl font-bold">Manage Doctors</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />{showForm ? 'Cancel' : 'Add Doctor'}</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add New Doctor</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    placeholder="Dr. John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialization *</Label>
                  <Input 
                    placeholder="Cardiology" 
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years) *</Label>
                  <Input 
                    type="number" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Consultation Fee (₹) *</Label>
                  <Input 
                    type="number" 
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Doctor'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Doctors List</CardTitle></CardHeader>
          <CardContent>
            {doctors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No doctors yet. Add your first doctor!</div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor: any) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Dr. {doctor.user.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.experience} years exp.</p>
                      <p className="text-sm text-gray-500">₹{doctor.consultationFee} per consultation</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
