'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  IndianRupee,
  Calendar,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { InsuranceCardDisplay } from '@/components/insurance-card-display'

export default function InsuranceCardDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [card, setCard] = useState<any>(null)
  const [claims, setClaims] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    } else if (status === 'authenticated' && session?.user?.role !== 'PATIENT') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchCardDetails()
    }
  }, [status, session, router, params.id])

  const fetchCardDetails = async () => {
    try {
      // Fetch insurance card details
      const cardResponse = await fetch(`/api/insurance/cards/${params.id}`)
      const cardData = await cardResponse.json()
      
      if (!cardResponse.ok) {
        throw new Error(cardData.error || 'Failed to fetch card details')
      }
      
      setCard(cardData.card)

      // Fetch claims for this card
      const claimsResponse = await fetch(`/api/insurance/claims?cardId=${params.id}`)
      const claimsData = await claimsResponse.json()
      setClaims(claimsData.claims || [])

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
      // toast({
      //   title: 'Success',
      //   description: 'Insurance card updated successfully'
      // });
    } catch (error) {
      console.error('Error saving card:', error);
      // toast({
      //   title: 'Error',
      //   description: 'Failed to update insurance card',
      //   variant: 'destructive'
      // });
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
              <p className="text-gray-600 dark:text-gray-400">View your insurance card information</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/patient/insurance">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
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
                <Link href="/patient/insurance">
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Card Details */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <InsuranceCardDisplay 
                  card={card} 
                  editable={true}
                  onSave={handleSaveCard}
                />
                
                <div className="mt-8 flex justify-between items-center">
                  <div>
                    {getStatusBadge(card.status)}
                  </div>
                  <div>
                    {card.documentUrl && (
                      <Button variant="outline" asChild>
                        <a href={card.documentUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download Card
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Submitted On</span>
                      <span className="font-medium dark:text-white">
                        {new Date(card.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {card.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Expiry Date</span>
                        <span className="font-medium dark:text-white">
                          {new Date(card.expiryDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                    {card.rejectionReason && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Rejection Reason</span>
                        <span className="font-medium text-red-600 dark:text-red-400">{card.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
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
                    {card.verifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Verified By</span>
                        <span className="font-medium dark:text-white">
                          {card.verifiedBy?.name || 'Admin'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claims for this card */}
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Claims History</h2>
              {claims.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No claims found</h3>
                    <p className="text-gray-500 dark:text-gray-400">No claims have been submitted for this card yet</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent>
                    <div className="space-y-4">
                      {claims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                          <div>
                            <h3 className="font-medium dark:text-white">{claim.serviceName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(claim.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium dark:text-white">
                                <IndianRupee className="w-4 h-4 inline" />
                                {claim.claimedAmount.toLocaleString('en-IN')}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getStatusBadge(claim.status)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/patient/insurance/claims/${claim.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}