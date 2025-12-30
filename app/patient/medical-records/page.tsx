'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, FileText, Download, Pill } from 'lucide-react'

export default function MedicalRecords() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  // Sample prescriptions with medicine names
  const prescriptions = [
    {
      id: '1',
      title: 'Common Cold Prescription',
      date: '2025-10-15',
      medicines: ['Paracetamol', 'Ibuprofen']
    },
    {
      id: '2',
      title: 'Stomach Infection',
      date: '2025-09-22',
      medicines: ['Amoxicillin', 'Omeprazole']
    }
  ]

  const reports = [
    {
      id: '1',
      title: 'Blood Test Report',
      date: '2025-10-15'
    },
    {
      id: '2',
      title: 'X-Ray Chest',
      date: '2025-09-22'
    }
  ]

  const handleViewMedicineInfo = (medicineName: string) => {
    // Navigate to medicine lookup page with pre-filled search
    router.push(`/patient/medicine-lookup?search=${encodeURIComponent(medicineName)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Medical Records</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>No prescriptions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{prescription.title}</h3>
                          <p className="text-sm text-gray-600">{prescription.date}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {prescription.medicines && prescription.medicines.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Medicines:</h4>
                          <div className="flex flex-wrap gap-2">
                            {prescription.medicines.map((medicine, index) => (
                              <div key={index} className="flex items-center bg-blue-50 rounded-full px-3 py-1">
                                <span className="text-sm text-blue-800">{medicine}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="ml-1 h-5 w-5 p-0 text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewMedicineInfo(medicine)}
                                >
                                  <Pill className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>No reports yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-600">{report.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No health history recorded
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}