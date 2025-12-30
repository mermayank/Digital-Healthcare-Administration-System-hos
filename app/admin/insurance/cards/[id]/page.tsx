'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
  Download,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'
import { InsuranceCardDisplay } from '@/components/insurance-card-display'

export default function InsuranceCardDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [card, setCard] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchCardDetails()
    }
  }, [status, session, router, params.id])

  const fetchCardDetails = async () => {
    try {
      // In a real application, this would fetch card details from the API
      // For now, we'll simulate some data
      const mockCard = {
        id: params.id,
        patient: { name: 'John Smith', email: 'john@example.com' },
        provider: { name: 'Ayushman Bharat' },
        cardNumber: 'AB1234567890',
        holderName: 'John Smith',
        policyNumber: 'POL123456',
        expiryDate: '2026-12-31',
        coverageAmount: 500000,
        remainingBalance: 450000,
        documentUrl: '#',
        status: 'PENDING',
        submittedAt: '2023-06-15',
        verifiedBy: null,
        verifiedAt: null
      }
      
      setCard(mockCard)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching card details:', error)
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
  
  const handleSaveCard = async (updatedCard: any) => {
    try {
      // In a real application, this would call the API to update the card
      console.log('Saving card:', updatedCard);
      
      // Update local state
      setCard(updatedCard);
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Insurance card updated successfully'
      });
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: 'Error',
        description: 'Failed to update insurance card',
        variant: 'destructive'
      });
    }
  }

  const handleApprove = async () => {
    try {
      // In a real application, this would call the API to approve the card
      toast({
        title: 'Success',
        description: 'Insurance card approved successfully'
      })
      
      // Update local state
      setCard((prev: any) => ({ ...prev, status: 'APPROVED' }))
    } catch (error) {
      console.error('Error approving card:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve insurance card',
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
      // In a real application, this would call the API to reject the card
      toast({
        title: 'Success',
        description: 'Insurance card rejected successfully'
      })
      
      // Update local state
      setCard((prev: any) => ({ ...prev, status: 'REJECTED' }))
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting card:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject insurance card',
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Card Details</h1>
              <p className="text-gray-600 dark:text-gray-400">Review and manage patient insurance card</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/insurance/cards">
                Back to Cards
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !card ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading card details...</div>
          </div>
        ) : !card ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Card not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">The requested insurance card could not be found</p>
              <Button asChild>
                <Link href="/admin/insurance/cards">
                  Back to Cards
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Card Information */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <InsuranceCardDisplay 
                  card={card} 
                  editable={true}
                  onSave={handleSaveCard}
                />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Submitted On</span>
                      <span className="font-medium dark:text-white">
                        {new Date(card.submittedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {card.verifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Verified By</span>
                        <span className="font-medium dark:text-white">
                          {card.verifiedBy?.name || 'Admin'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Remaining Balance</span>
                      <span className="font-medium dark:text-white">
                        <IndianRupee className="w-4 h-4 inline" />
                        {card.remainingBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {card.documentUrl && (
                      <div className="flex justify-end">
                        <Button variant="outline" asChild>
                          <a href={card.documentUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download Document
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Patient Information</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Details about the card holder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div>
                    <h3 className="font-medium dark:text-white">{card.patient.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{card.patient.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions for PENDING cards */}
            {card.status === 'PENDING' && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Review Card</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Approve or reject this insurance card
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason" className="dark:text-gray-300">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide reason for rejection..."
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Approve Card
                      </Button>
                      <Button onClick={handleReject} variant="destructive">
                        <X className="w-4 h-4 mr-2" />
                        Reject Card
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