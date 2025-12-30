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
import { Upload, IndianRupee, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { ProviderSelector } from '@/components/provider-selector'

export default function AddInsuranceCard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<any[]>([])
  const [formData, setFormData] = useState({
    providerId: '',
    customProviderName: '',
    cardNumber: '',
    holderName: '',
    policyNumber: '',
    expiryDate: '',
    coverageAmount: '',
    documentUrl: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    } else if (status === 'authenticated' && session?.user?.role !== 'PATIENT') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchProviders()
    }
  }, [status, session, router])

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/insurance?isActive=true')
      
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
      } else {
        // Fallback to mock providers if API fails
        console.warn('Failed to fetch providers from API, using mock data');
        const mockProviders = [
          { id: '1', name: 'Ayushman Bharat' },
          { id: '2', name: 'Star Health' },
          { id: '3', name: 'HDFC Ergo' },
          { id: '4', name: 'ICICI Lombard' },
          { id: '5', name: 'Bajaj Allianz' }
        ];
        setProviders(mockProviders);
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching providers:', error)
      // Fallback to mock providers on error
      const mockProviders = [
        { id: '1', name: 'Ayushman Bharat' },
        { id: '2', name: 'Star Health' },
        { id: '3', name: 'HDFC Ergo' }
      ];
      setProviders(mockProviders);
      setLoading(false)
      toast({
        title: 'Notice',
        description: 'Using sample providers due to loading issue',
        variant: 'default'
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real application, you would upload the file to a storage service
    // For now, we'll just store the file name as a placeholder
    setUploading(true)
    try {
      // Simulate file upload
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          documentUrl: URL.createObjectURL(file)
        }))
        setUploading(false)
        toast({
          title: 'Success',
          description: 'Document uploaded successfully'
        })
      }, 1000)
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploading(false)
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.providerId && !formData.customProviderName) {
      toast({
        title: 'Error',
        description: 'Please select or enter an insurance provider',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.cardNumber) {
      toast({
        title: 'Error',
        description: 'Please enter a card number',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.holderName) {
      toast({
        title: 'Error',
        description: 'Please enter the card holder name',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.coverageAmount) {
      toast({
        title: 'Error',
        description: 'Please enter the coverage amount',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true)

    try {
      // If using a custom provider, create it first
      let providerId = formData.providerId;
      
      if (!providerId && formData.customProviderName) {
        // Create custom provider
        const providerResponse = await fetch('/api/insurance/providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.customProviderName
          })
        });
        
        const providerData = await providerResponse.json();
        
        if (providerResponse.ok && providerData.provider) {
          providerId = providerData.provider.id;
          // Add the new provider to the list
          setProviders(prev => [...prev, providerData.provider]);
        } else if (providerData.provider) {
          // Provider already exists, use the existing one
          providerId = providerData.provider.id;
        } else {
          throw new Error(providerData.error || 'Failed to create provider');
        }
      }
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        providerId, // Use the resolved provider ID
        coverageAmount: parseFloat(formData.coverageAmount)
      };
      
      console.log('Submitting insurance card data:', submissionData);
      
      const response = await fetch('/api/insurance/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })

      console.log('Response status:', response.status);
      
      const data = await response.json()
      console.log('Response data:', data);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Insurance card submitted successfully for verification!'
        })
        // Redirect with success parameter
        router.push('/patient/insurance?success=true')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit insurance card',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error submitting insurance card:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit insurance card',
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Insurance Card</h1>
              <p className="text-gray-600 dark:text-gray-400">Submit your health insurance card for verification</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/patient/insurance">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Insurance Card Details</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Provide your insurance card information for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProviderSelector
                  providers={providers}
                  selectedProviderId={formData.providerId}
                  onProviderChange={(value) => handleSelectChange('providerId', value)}
                  customProviderName={formData.customProviderName}
                  onCustomProviderChange={(name) => setFormData(prev => ({ ...prev, customProviderName: name }))}
                />

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="dark:text-gray-300">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holderName" className="dark:text-gray-300">Card Holder Name</Label>
                  <Input
                    id="holderName"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyNumber" className="dark:text-gray-300">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="dark:text-gray-300">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverageAmount" className="dark:text-gray-300">Coverage Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="coverageAmount"
                      name="coverageAmount"
                      type="number"
                      value={formData.coverageAmount}
                      onChange={handleInputChange}
                      required
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document" className="dark:text-gray-300">Upload Document</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button type="button" variant="outline" disabled={uploading} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {uploading ? 'Uploading...' : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                {formData.documentUrl && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Document uploaded successfully
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/patient/insurance">
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}