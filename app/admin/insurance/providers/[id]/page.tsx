'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function EditInsuranceProvider({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
    isActive: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchProviderDetails()
    }
  }, [status, session, router, params.id])

  const fetchProviderDetails = async () => {
    try {
      // In a real application, this would fetch provider details from the API
      // For now, we'll simulate some data
      const mockProvider = {
        id: params.id,
        name: 'Ayushman Bharat',
        description: 'Government health insurance scheme',
        website: 'https://abdm.gov.in',
        phone: '+91-11-23978000',
        isActive: true
      }
      
      setProvider(mockProvider)
      setFormData({
        name: mockProvider.name,
        description: mockProvider.description,
        website: mockProvider.website,
        phone: mockProvider.phone,
        isActive: mockProvider.isActive
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching provider details:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real application, this would submit to the API
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Insurance provider updated successfully'
      })
      
      router.push('/admin/insurance/providers')
    } catch (error) {
      console.error('Error updating provider:', error)
      toast({
        title: 'Error',
        description: 'Failed to update insurance provider',
        variant: 'destructive'
      })
    } finally {
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Insurance Provider</h1>
              <p className="text-gray-600 dark:text-gray-400">Update health insurance provider information</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/insurance/providers">
                Back to Providers
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !provider ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading provider details...</div>
          </div>
        ) : !provider ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Provider not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">The requested insurance provider could not be found</p>
              <Button asChild>
                <Link href="/admin/insurance/providers">
                  Back to Providers
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Provider Information</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update details for {provider.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">Provider Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Ayushman Bharat"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of the insurance provider"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="dark:text-gray-300">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91-XXXXXXXXXX"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="isActive" className="dark:text-gray-300">Active Provider</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/admin/insurance/providers">
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? 'Updating...' : 'Update Provider'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}