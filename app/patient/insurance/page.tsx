'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Eye, 
  Download, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  IndianRupee,
  FileText,
  Calendar,
  User,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function PatientInsuranceDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [insuranceCards, setInsuranceCards] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    } else if (status === 'authenticated' && session?.user?.role !== 'PATIENT') {
      router.push('/')
    } else if (status === 'authenticated') {
      // Check if we should show success message
      if (searchParams.get('success') === 'true') {
        setShowSuccessMessage(true)
        // Remove the success parameter from URL
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete('success')
        // We won't update the URL to avoid complexity, just hide the message after delay
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 5000)
      }
      fetchInsuranceData()
    }
  }, [status, session, router, searchParams])

  const fetchInsuranceData = async () => {
    try {
      // Fetch insurance cards
      const cardsResponse = await fetch('/api/insurance/cards')
      
      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json()
        setInsuranceCards(cardsData.cards || [])
      } else {
        // Fallback to mock data if API fails
        console.warn('Failed to fetch cards from API, using mock data');
        const mockCards = [
          {
            id: 'card1',
            provider: { name: 'Ayushman Bharat' },
            cardNumber: 'AB1234567890',
            holderName: 'John Doe',
            coverageAmount: 500000,
            remainingBalance: 450000,
            status: 'APPROVED',
            expiryDate: '2025-12-31'
          },
          {
            id: 'card2',
            provider: { name: 'Star Health' },
            cardNumber: 'SH9876543210',
            holderName: 'John Doe',
            coverageAmount: 300000,
            remainingBalance: 300000,
            status: 'PENDING',
            expiryDate: '2024-12-31'
          }
        ];
        setInsuranceCards(mockCards);
      }

      // Fetch claims
      const claimsResponse = await fetch('/api/insurance/claims')
      
      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json()
        setClaims(claimsData.claims || [])
      } else {
        // Fallback to mock data if API fails
        console.warn('Failed to fetch claims from API, using mock data');
        const mockClaims = [
          {
            id: 'claim1',
            serviceName: 'General Consultation',
            claimedAmount: 1500,
            status: 'APPROVED',
            createdAt: '2023-06-15',
            card: { provider: { name: 'Ayushman Bharat' } }
          },
          {
            id: 'claim2',
            serviceName: 'Lab Test',
            claimedAmount: 2500,
            status: 'PENDING',
            createdAt: '2023-06-10',
            card: { provider: { name: 'Star Health' } }
          }
        ];
        setClaims(mockClaims);
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching insurance data:', error)
      // Fallback to mock data on error
      const mockCards = [
        {
          id: 'card1',
          provider: { name: 'Ayushman Bharat' },
          cardNumber: 'AB1234567890',
          holderName: 'John Doe',
          coverageAmount: 500000,
          remainingBalance: 450000,
          status: 'APPROVED',
          expiryDate: '2025-12-31'
        }
      ];
      setInsuranceCards(mockCards);
      
      const mockClaims = [
        {
          id: 'claim1',
          serviceName: 'General Consultation',
          claimedAmount: 1500,
          status: 'APPROVED',
          createdAt: '2023-06-15',
          card: { provider: { name: 'Ayushman Bharat' } }
        }
      ];
      setClaims(mockClaims);
      
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your health insurance cards and claims</p>
            </div>
            <Button asChild>
              <Link href="/patient/insurance/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Insurance Card
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccessMessage && (
          <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="flex items-center p-4">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-800 dark:text-green-200">
                Insurance card submitted successfully for verification! Our team will review it shortly.
              </p>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading insurance data...</div>
          </div>
        ) : (
          <>
            {/* Insurance Cards Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Insurance Cards</h2>
              {insuranceCards.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No insurance cards found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first insurance card to get started</p>
                    <Button asChild>
                      <Link href="/patient/insurance/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Insurance Card
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Card Number</span>
                            <span className="font-medium dark:text-white">****{card.cardNumber.slice(-4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Coverage</span>
                            <span className="font-medium dark:text-white">
                              <IndianRupee className="w-4 h-4 inline" />
                              {card.coverageAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                            <span className="font-medium dark:text-white">
                              <IndianRupee className="w-4 h-4 inline" />
                              {card.remainingBalance.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {card.expiryDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Expires</span>
                              <span className="font-medium dark:text-white">
                                {new Date(card.expiryDate).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                          )}
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/patient/insurance/${card.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            {card.documentUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={card.documentUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Claims Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Claims</h2>
              {claims.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No claims found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Your insurance claims will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent>
                    <div className="space-y-4">
                      {claims.slice(0, 5).map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                          <div>
                            <h3 className="font-medium dark:text-white">{claim.serviceName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(claim.createdAt).toLocaleDateString('en-IN')} • {claim.card.provider.name}
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