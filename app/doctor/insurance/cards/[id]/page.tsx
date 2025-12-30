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
import { IndianRupee, FileText } from 'lucide-react'
import Link from 'next/link'
import { InsuranceCardDisplay } from '@/components/insurance-card-display'

export default function CreateInsuranceClaim({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [card, setCard] = useState<any>(null)
  const [formData, setFormData] = useState({
    serviceName: '',
    claimedAmount: '',
    description: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    } else if (status === 'authenticated' && session?.user?.role !== 'DOCTOR') {
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
        provider: { name: 'Ayushman Bharat' },
        holderName: 'John Smith',
        coverageAmount: 500000,
        remainingBalance: 450000
      }
      
      setCard(mockCard)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching card details:', error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real application, this would submit the claim to the API
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Insurance claim submitted successfully'
      })
      
      router.push('/doctor/insurance')
    } catch (error) {
      console.error('Error submitting claim:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit insurance claim',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Insurance Claim</h1>
              <p className="text-gray-600 dark:text-gray-400">Submit a claim for {card?.holderName || 'patient'}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/doctor/insurance">
                Back to Insurance
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Link href="/doctor/insurance">
                  Back to Insurance
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Claim Details</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Create a new insurance claim for {card.provider.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Card Summary */}
              <div className="mb-6">
                <InsuranceCardDisplay 
                  card={{
                    ...card,
                    cardNumber: '**** **** **** ****',
                    policyNumber: 'N/A',
                    expiryDate: '2025-12-31',
                    status: 'ACTIVE'
                  }} 
                  editable={true}
                  onSave={handleSaveCard}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceName" className="dark:text-gray-300">Service Name</Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., General Consultation, Surgery, Lab Test"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimedAmount" className="dark:text-gray-300">Claimed Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="claimedAmount"
                      name="claimedAmount"
                      type="number"
                      value={formData.claimedAmount}
                      onChange={handleInputChange}
                      required
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about the treatment or service"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/doctor/insurance">
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? 'Submitting...' : 'Submit Claim'}
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