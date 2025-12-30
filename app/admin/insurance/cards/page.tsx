'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default function InsuranceCards() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchInsuranceCards()
    }
  }, [status, session, router])

  const fetchInsuranceCards = async () => {
    try {
      // Try to fetch from API first
      const response = await fetch('/api/insurance/cards');
      
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
      } else {
        // Fallback to mock data if API fails
        console.warn('Failed to fetch from API, using mock data');
        const mockCards = [
          {
            id: 'card1',
            patient: { name: 'John Smith', email: 'john@example.com' },
            provider: { name: 'Ayushman Bharat' },
            cardNumber: 'AB1234567890',
            holderName: 'John Smith',
            coverageAmount: 500000,
            remainingBalance: 450000,
            status: 'APPROVED',
            submittedAt: '2023-06-15'
          },
          {
            id: 'card2',
            patient: { name: 'Sarah Johnson', email: 'sarah@example.com' },
            provider: { name: 'Star Health' },
            cardNumber: 'SH9876543210',
            holderName: 'Sarah Johnson',
            coverageAmount: 300000,
            remainingBalance: 300000,
            status: 'PENDING',
            submittedAt: '2023-06-14'
          },
          {
            id: 'card3',
            patient: { name: 'Michael Brown', email: 'michael@example.com' },
            provider: { name: 'HDFC Ergo' },
            cardNumber: 'HE4567891230',
            holderName: 'Michael Brown',
            coverageAmount: 250000,
            remainingBalance: 200000,
            status: 'REJECTED',
            submittedAt: '2023-06-13',
            rejectionReason: 'Invalid card number'
          }
        ];
        setCards(mockCards);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insurance cards:', error);
      // Fallback to mock data on error
      const mockCards = [
        {
          id: 'card1',
          patient: { name: 'John Smith', email: 'john@example.com' },
          provider: { name: 'Ayushman Bharat' },
          cardNumber: 'AB1234567890',
          holderName: 'John Smith',
          coverageAmount: 500000,
          remainingBalance: 450000,
          status: 'APPROVED',
          submittedAt: '2023-06-15'
        },
        {
          id: 'card2',
          patient: { name: 'Sarah Johnson', email: 'sarah@example.com' },
          provider: { name: 'Star Health' },
          cardNumber: 'SH9876543210',
          holderName: 'Sarah Johnson',
          coverageAmount: 300000,
          remainingBalance: 300000,
          status: 'PENDING',
          submittedAt: '2023-06-14'
        }
      ];
      setCards(mockCards);
      setLoading(false);
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

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'ALL' || card.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Cards</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage patient insurance cards</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cards..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label className="dark:text-gray-300">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading insurance cards...</div>
          </div>
        ) : filteredCards.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No cards found</h3>
              <p className="text-gray-500 dark:text-gray-400">No insurance cards match your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg dark:text-white">{card.patient.name}</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {card.provider.name} • {card.holderName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(card.status)}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/insurance/cards/${card.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Card Number</span>
                        <span className="font-medium dark:text-white">****{card.cardNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Submitted</span>
                        <span className="font-medium dark:text-white">
                          {new Date(card.submittedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {card.rejectionReason && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Rejection Reason</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{card.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
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
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Patient Email</span>
                        <span className="font-medium dark:text-white">{card.patient.email}</span>
                      </div>
                    </div>
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