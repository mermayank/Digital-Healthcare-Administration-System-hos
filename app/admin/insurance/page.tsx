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
  Plus,
  Users,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function AdminInsuranceDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<any[]>([])
  const [pendingCards, setPendingCards] = useState<any[]>([])
  const [pendingClaims, setPendingClaims] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchInsuranceData()
    }
  }, [status, session, router])

  const fetchInsuranceData = async () => {
    try {
      // In a real application, this would fetch data from the API
      // For now, we'll simulate some data
      const mockProviders = [
        { id: '1', name: 'Ayushman Bharat', isActive: true, cardCount: 124 },
        { id: '2', name: 'Star Health', isActive: true, cardCount: 87 },
        { id: '3', name: 'HDFC Ergo', isActive: true, cardCount: 65 }
      ]
      
      const mockPendingCards = [
        { id: 'card1', patientName: 'John Smith', provider: 'Ayushman Bharat', submittedAt: '2023-06-15' },
        { id: 'card2', patientName: 'Sarah Johnson', provider: 'Star Health', submittedAt: '2023-06-14' },
        { id: 'card3', patientName: 'Michael Brown', provider: 'HDFC Ergo', submittedAt: '2023-06-13' }
      ]
      
      const mockPendingClaims = [
        { id: 'claim1', patientName: 'John Smith', provider: 'Ayushman Bharat', amount: 15000, submittedAt: '2023-06-15' },
        { id: 'claim2', patientName: 'Sarah Johnson', provider: 'Star Health', amount: 8500, submittedAt: '2023-06-14' },
        { id: 'claim3', patientName: 'Michael Brown', provider: 'HDFC Ergo', amount: 22000, submittedAt: '2023-06-13' }
      ]
      
      setProviders(mockProviders)
      setPendingCards(mockPendingCards)
      setPendingClaims(mockPendingClaims)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching insurance data:', error)
      setLoading(false)
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage insurance providers, cards, and claims</p>
            </div>
            <Button asChild>
              <Link href="/admin/insurance/providers/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Provider
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading insurance data...</div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-400">Total Providers</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{providers.length}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active insurance providers</p>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-400">Pending Cards</CardTitle>
                  <Clock className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{pendingCards.length}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cards awaiting verification</p>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-400">Pending Claims</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{pendingClaims.length}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Claims awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Insurance Providers */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold dark:text-white">Insurance Providers</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/insurance/providers">
                      View All
                    </Link>
                  </Button>
                </div>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent>
                    {providers.length === 0 ? (
                      <div className="py-8 text-center">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No providers found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first insurance provider to get started</p>
                        <Button asChild>
                          <Link href="/admin/insurance/providers/add">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Provider
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {providers.map((provider) => (
                          <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                            <div>
                              <h3 className="font-medium dark:text-white">{provider.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {provider.cardCount} cards
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {provider.isActive ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : (
                                <Badge variant="destructive">Inactive</Badge>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/insurance/providers/${provider.id}`}>
                                  Manage
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Pending Cards */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold dark:text-white">Pending Insurance Cards</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/insurance/cards?status=PENDING">
                      View All
                    </Link>
                  </Button>
                </div>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent>
                    {pendingCards.length === 0 ? (
                      <div className="py-8 text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending cards</h3>
                        <p className="text-gray-500 dark:text-gray-400">All insurance cards are verified</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingCards.map((card) => (
                          <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                            <div>
                              <h3 className="font-medium dark:text-white">{card.patientName}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {card.provider} • {new Date(card.submittedAt).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/insurance/cards/${card.id}`}>
                                Review
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pending Claims */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Pending Claims</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/insurance/claims?status=PENDING">
                    View All
                  </Link>
                </Button>
              </div>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent>
                  {pendingClaims.length === 0 ? (
                    <div className="py-8 text-center">
                      <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending claims</h3>
                      <p className="text-gray-500 dark:text-gray-400">All claims are processed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                          <div>
                            <h3 className="font-medium dark:text-white">{claim.patientName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {claim.provider} • {new Date(claim.submittedAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium dark:text-white">
                              <IndianRupee className="w-4 h-4 inline" />
                              {claim.amount.toLocaleString('en-IN')}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/insurance/claims/${claim.id}`}>
                                Review
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}