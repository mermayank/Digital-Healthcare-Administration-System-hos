'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

export default function InsuranceProviders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchProviders()
    }
  }, [status, session, router])

  const fetchProviders = async () => {
    try {
      // In a real application, this would fetch providers from the API
      // For now, we'll simulate some data
      const mockProviders = [
        { id: '1', name: 'Ayushman Bharat', description: 'Government health insurance scheme', website: 'https://abdm.gov.in', phone: '+91-11-23978000', isActive: true },
        { id: '2', name: 'Star Health', description: 'Private health insurance provider', website: 'https://www.starhealth.in', phone: '+91-022-68544000', isActive: true },
        { id: '3', name: 'HDFC Ergo', description: 'General insurance company', website: 'https://www.hdfcergo.com', phone: '+91-124-6186186', isActive: true },
        { id: '4', name: 'ICICI Lombard', description: 'General insurance company', website: 'https://www.icicilombard.com', phone: '+91-22-26758000', isActive: false }
      ]
      
      setProviders(mockProviders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching providers:', error)
      setLoading(false)
    }
  }

  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Providers</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage health insurance providers</p>
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
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search providers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading providers...</div>
          </div>
        ) : filteredProviders.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No providers found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding a new insurance provider</p>
              <Button asChild>
                <Link href="/admin/insurance/providers/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provider
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg dark:text-white">{provider.name}</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {provider.description}
                      </CardDescription>
                    </div>
                    {provider.isActive ? (
                      <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>
                    ) : (
                      <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {provider.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Website</span>
                        <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                          Visit
                        </a>
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Phone</span>
                        <span className="font-medium dark:text-white">{provider.phone}</span>
                      </div>
                    )}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/insurance/providers/${provider.id}`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
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