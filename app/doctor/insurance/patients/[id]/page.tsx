'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  IndianRupee,
  FileText,
  User,
  Calendar,
  Phone
} from 'lucide-react'
import Link from 'next/link'

export default function PatientInsuranceDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [insuranceCards, setInsuranceCards] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    } else if (status === 'authenticated' && session?.user?.role !== 'DOCTOR') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchPatientDetails()
    }
  }, [status, session, router, params.id])

  const fetchPatientDetails = async () => {
    try {
      // In a real application, this would fetch patient details from the API
      // For now, we'll simulate some data
      const mockPatient = {
        id: params.id,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+91 98765 43210',
        dateOfBirth: '1985-06-15',
        insuranceCards: [
          {
            id: 'card1',
            provider: { name: 'Ayushman Bharat' },
            cardNumber: 'AB1234567890',
            holderName: 'John Smith',
            policyNumber: 'POL123456',
            expiryDate: '2026-12-31',
            coverageAmount: 500000,
            remainingBalance: 450000,
            status: 'APPROVED',
            documentUrl: '#'
          }
        ]
      }
      
      setPatient(mockPatient)
      setInsuranceCards(mockPatient.insuranceCards)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching patient details:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Insurance Details</h1>
              <p className="text-gray-600 dark:text-gray-400">View insurance information for {patient?.name || 'patient'}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/doctor/insurance">
                Back to Insurance
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading patient details...</div>
          </div>
        ) : !patient ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Patient not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">The requested patient could not be found</p>
              <Button asChild>
                <Link href="/doctor/insurance">
                  Back to Insurance
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Patient Information */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl dark:text-white">Patient Information</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-medium dark:text-white">{patient.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium dark:text-white">{patient.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium dark:text-white">{patient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="font-medium dark:text-white">
                          {new Date(patient.dateOfBirth).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Insurance Cards</h2>
              {insuranceCards.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No insurance cards found</h3>
                    <p className="text-gray-500 dark:text-gray-400">This patient has not added any insurance cards</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {insuranceCards.map((card) => (
                    <Card key={card.id} className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg dark:text-white">{card.provider.name}</CardTitle>
                            <CardDescription className="dark:text-gray-400">
                              {card.holderName}
                            </CardDescription>
                          </div>
                          {getStatusBadge(card.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Card Number</span>
                              <span className="font-medium dark:text-white">{card.cardNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Policy Number</span>
                              <span className="font-medium dark:text-white">{card.policyNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Expiry Date</span>
                              <span className="font-medium dark:text-white">
                                {new Date(card.expiryDate).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Coverage Amount</span>
                              <span className="font-medium dark:text-white">
                                <IndianRupee className="w-4 h-4 inline" />
                                {card.coverageAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Remaining Balance</span>
                              <span className="font-medium dark:text-white">
                                <IndianRupee className="w-4 h-4 inline" />
                                {card.remainingBalance.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={card.documentUrl} target="_blank" rel="noopener noreferrer">
                                  View Document
                                </a>
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/doctor/insurance/cards/${card.id}`}>
                                  Create Claim
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}