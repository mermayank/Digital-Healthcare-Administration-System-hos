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
  Search
} from 'lucide-react'
import Link from 'next/link'

export default function DoctorInsuranceVerification() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    } else if (status === 'authenticated' && session?.user?.role !== 'DOCTOR') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchPatientsWithInsurance()
    }
  }, [status, session, router])

  const fetchPatientsWithInsurance = async () => {
    try {
      // In a real application, this would fetch patients with insurance cards
      // For now, we'll simulate some data
      const mockPatients = [
        {
          id: '1',
          name: 'John Smith',
          insuranceCard: {
            id: 'card1',
            provider: { name: 'Ayushman Bharat' },
            status: 'APPROVED',
            coverageAmount: 500000,
            remainingBalance: 450000
          }
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          insuranceCard: {
            id: 'card2',
            provider: { name: 'Star Health' },
            status: 'PENDING',
            coverageAmount: 300000,
            remainingBalance: 300000
          }
        },
        {
          id: '3',
          name: 'Michael Brown',
          insuranceCard: {
            id: 'card3',
            provider: { name: 'HDFC Ergo' },
            status: 'APPROVED',
            coverageAmount: 250000,
            remainingBalance: 200000
          }
        }
      ]
      
      setPatients(mockPatients)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching patients:', error)
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

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.insuranceCard.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Verification</h1>
              <p className="text-gray-600 dark:text-gray-400">Check patient insurance coverage</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/doctor/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients or insurance providers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading patient data...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No patients found</h3>
              <p className="text-gray-500 dark:text-gray-400">No patients with insurance cards match your search</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg dark:text-white">{patient.name}</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {patient.insuranceCard.provider.name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(patient.insuranceCard.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Coverage</span>
                      <span className="font-medium dark:text-white">
                        <IndianRupee className="w-4 h-4 inline" />
                        {patient.insuranceCard.coverageAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                      <span className="font-medium dark:text-white">
                        <IndianRupee className="w-4 h-4 inline" />
                        {patient.insuranceCard.remainingBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/doctor/insurance/patients/${patient.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}