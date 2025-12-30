'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  IndianRupee,
  Calendar,
  User,
  FileText,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function InsuranceClaimDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [claim, setClaim] = useState<any>(null)
  const [approvedAmount, setApprovedAmount] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchClaimDetails()
    }
  }, [status, session, router, params.id])

  const fetchClaimDetails = async () => {
    try {
      // In a real application, this would fetch claim details from the API
      // For now, we'll simulate some data
      const mockClaim = {
        id: params.id,
        patient: { name: 'John Smith', email: 'john@example.com' },
        provider: { name: 'Ayushman Bharat' },
        card: { 
          holderName: 'John Smith',
          cardNumber: 'AB1234567890',
          coverageAmount: 500000,
          remainingBalance: 450000
        },
        serviceName: 'General Consultation',
        claimedAmount: 15000,
        approvedAmount: null,
        status: 'PENDING',
        submittedAt: '2023-06-15',
        processedBy: null,
        processedAt: null
      }
      
      setClaim(mockClaim)
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

  const handleApprove = async () => {
    const amount = parseFloat(approvedAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid approved amount',
        variant: 'destructive'
      })
      return
    }

    if (amount > claim.claimedAmount) {
      toast({
        title: 'Error',
        description: 'Approved amount cannot exceed claimed amount',
        variant: 'destructive'
      })
      return
    }

    try {
      // In a real application, this would call the API to approve the claim
      toast({
        title: 'Success',
        description: 'Insurance claim approved successfully'
      })
      
      // Update local state
      setClaim((prev: any) => ({ 
        ...prev, 
        status: 'APPROVED',
        approvedAmount: amount
      }))
      setApprovedAmount('')
    } catch (error) {
      console.error('Error approving claim:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve insurance claim',
        variant: 'destructive'
      })
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive'
      })
      return
    }

    try {
      // In a real application, this would call the API to reject the claim
      toast({
        title: 'Success',
        description: 'Insurance claim rejected successfully'
      })
      
      // Update local state
      setClaim((prev: any) => ({ 
        ...prev, 
        status: 'REJECTED'
      }))
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting claim:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject insurance claim',
        variant: 'destructive'
      })
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
              <p className="text-gray-600 dark:text-gray-400">Review and process insurance claim</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/insurance/claims">
                Back to Claims
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !claim ? (
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
                <Link href="/admin/insurance/claims">
                  Back to Claims
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Claim Information */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl dark:text-white">Claim #{claim.id.slice(-6)}</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      {claim.provider.name} • {claim.serviceName}
                    </CardDescription>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Patient</span>
                      <span className="font-medium dark:text-white">{claim.patient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Card Holder</span>
                      <span className="font-medium dark:text-white">{claim.card.holderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Card Number</span>
                      <span className="font-medium dark:text-white">****{claim.card.cardNumber.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
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
                      <span className="text-gray-500 dark:text-gray-400">Submitted On</span>
                      <span className="font-medium dark:text-white">
                        {new Date(claim.submittedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {claim.processedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Processed By</span>
                        <span className="font-medium dark:text-white">
                          {claim.processedBy?.name || 'Admin'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Card Summary */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Insurance Coverage</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Card details and remaining balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium dark:text-white">{claim.provider.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Coverage</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium dark:text-white">
                        <IndianRupee className="w-4 h-4 inline" />
                        {claim.card.coverageAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remaining: <IndianRupee className="w-3 h-3 inline" />
                        {claim.card.remainingBalance.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions for PENDING claims */}
            {claim.status === 'PENDING' && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Process Claim</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Approve or reject this insurance claim
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="approvedAmount" className="dark:text-gray-300">Approved Amount (₹)</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="approvedAmount"
                            type="number"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(e.target.value)}
                            placeholder="Enter approved amount"
                            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rejectionReason" className="dark:text-gray-300">Rejection Reason</Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide reason for rejection..."
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Approve Claim
                      </Button>
                      <Button onClick={handleReject} variant="destructive">
                        <X className="w-4 h-4 mr-2" />
                        Reject Claim
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}