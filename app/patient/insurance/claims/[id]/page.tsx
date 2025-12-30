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
  Calendar,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function ClaimDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [claim, setClaim] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    } else if (status === 'authenticated' && session?.user?.role !== 'PATIENT') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchClaimDetails()
    }
  }, [status, session, router, params.id])

  const fetchClaimDetails = async () => {
    try {
      const response = await fetch(`/api/insurance/claims/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch claim details')
      }
      
      setClaim(data.claim)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching claim details:', error)
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Claim Details</h1>
              <p className="text-gray-600 dark:text-gray-400">View your insurance claim information</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/patient/insurance">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading claim details...</div>
          </div>
        ) : !claim ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Claim not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">The requested insurance claim could not be found</p>
              <Button asChild>
                <Link href="/patient/insurance">
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl dark:text-white">Claim #{claim.id.slice(-6)}</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Submitted for {claim.card.provider.name}
                  </CardDescription>
                </div>
                {getStatusBadge(claim.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Service Name</span>
                    <span className="font-medium dark:text-white">{claim.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Claimed Amount</span>
                    <span className="font-medium dark:text-white">
                      <IndianRupee className="w-4 h-4 inline" />
                      {claim.claimedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {claim.approvedAmount !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Approved Amount</span>
                      <span className="font-medium dark:text-white">
                        <IndianRupee className="w-4 h-4 inline" />
                        {claim.approvedAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-medium dark:text-white">{claim.status}</span>
                  </div>
                  {claim.rejectionReason && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Rejection Reason</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{claim.rejectionReason}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Submitted On</span>
                    <span className="font-medium dark:text-white">
                      {new Date(claim.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Insurance Card</span>
                    <span className="font-medium dark:text-white">
                      {claim.card.holderName} ({claim.card.provider.name})
                    </span>
                  </div>
                  {claim.appointment && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Appointment</span>
                      <span className="font-medium dark:text-white">
                        {new Date(claim.appointment.date).toLocaleDateString('en-IN')} at {claim.appointment.time}
                      </span>
                    </div>
                  )}
                  {claim.processedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Processed By</span>
                      <span className="font-medium dark:text-white">
                        {claim.processedBy?.name || 'Admin'}
                      </span>
                    </div>
                  )}
                  {claim.processedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Processed On</span>
                      <span className="font-medium dark:text-white">
                        {new Date(claim.processedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}