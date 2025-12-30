'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Plus, FileText } from 'lucide-react'

export default function DoctorPrescriptions() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [medications, setMedications] = useState([''])
  const [patients, setPatients] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    } else if (status === 'authenticated') {
      fetchPatients()
      fetchPrescriptions()
    }
  }, [status, router])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/doctors/patients')
      const data = await response.json()
      if (data.patients) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions')
      const data = await response.json()
      if (data.prescriptions) {
        setPrescriptions(data.prescriptions)
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    }
  }

  const addMedication = () => {
    setMedications([...medications, ''])
  }

  const handleMedicationChange = (index: number, value: string) => {
    const newMedications = [...medications]
    newMedications[index] = value
    setMedications(newMedications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty medications
    const validMedications = medications.filter(med => med.trim() !== '')
    
    if (!selectedPatient || validMedications.length === 0) {
      alert('Please select a patient and add at least one medication')
      return
    }
    
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          medications: validMedications,
          dosage: '', // This would typically be part of each medication entry
          instructions
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert('Prescription created successfully!')
        setShowForm(false)
        // Reset form
        setSelectedPatient('')
        setMedications([''])
        setInstructions('')
        // Refresh prescriptions
        fetchPrescriptions()
      } else {
        alert(`Error: ${data.error || 'Failed to create prescription'}`)
      }
    } catch (error) {
      console.error('Error creating prescription:', error)
      alert('Failed to create prescription')
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Prescriptions</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'New Prescription'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <select 
                    id="patient"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((patient: any) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Medications *</Label>
                    <Button type="button" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {medications.map((med, idx) => (
                    <Input 
                      key={idx} 
                      placeholder="Medication name, dosage, frequency" 
                      value={med}
                      onChange={(e) => handleMedicationChange(idx, e.target.value)}
                      required={idx === 0} // First medication is required
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <textarea
                    id="instructions"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Additional instructions..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">Create Prescription</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p>No prescriptions created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription: any) => (
                  <div key={prescription.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Prescription for {prescription.patient.user.name}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium">Medications:</p>
                      <ul className="list-disc list-inside mt-1">
                        {JSON.parse(prescription.medications).map((med: string, idx: number) => (
                          <li key={idx} className="text-gray-700">{med}</li>
                        ))}
                      </ul>
                    </div>
                    {prescription.instructions && (
                      <div className="mt-2">
                        <p className="font-medium">Instructions:</p>
                        <p className="text-gray-700">{prescription.instructions}</p>
                      </div>
                    )}
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