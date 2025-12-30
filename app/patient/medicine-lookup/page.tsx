'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Pill, AlertTriangle, Info, Clock, Package, User, Utensils, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MedicineInfo {
  id: string
  name: string
  composition: string[]
  purpose: string
  mechanism: string
  precautions: {
    pregnancy: string
    allergies: string[]
    interactions: string[]
  }
  sideEffects: string[]
  dosage: {
    adults: string
    children: string
    elderly: string
  }
  alternatives: string[]
  foodInteractions: string[]
  overdoseInfo: string
  usageInstructions: string[]
}

export default function MedicineLookupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check for pre-filled search term from URL
  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      setSearchTerm(searchQuery)
      // Automatically search for the medicine
      searchMedicine(searchQuery)
    }
  }, [searchParams])

  if (status === 'unauthenticated') {
    router.push('/auth/signin?role=patient')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const searchMedicine = async (term: string) => {
    if (!term.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/medicine?name=${encodeURIComponent(term)}`)
      const result = await response.json()
      
      if (result.success) {
        setMedicineInfo(result.data)
      } else {
        setError(result.error || 'Medicine not found. Please try another search term.')
        setMedicineInfo(null)
      }
    } catch (err) {
      setError('An error occurred while searching for medicine information. Please try again.')
      setMedicineInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    searchMedicine(searchTerm)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setMedicineInfo(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medicine Information</h1>
              <p className="text-gray-600">Search and learn about your medications</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Medicine
            </CardTitle>
            <CardDescription>
              Enter the name of a medicine to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              {medicineInfo && (
                <Button type="button" variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </form>
            {error && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medicine Information Display */}
        {medicineInfo && (
          <div className="space-y-6">
            {/* Medicine Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-500" />
                  {medicineInfo.name} Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Composition</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-700">
                    {medicineInfo.composition.map((comp, index) => (
                      <li key={index}>{comp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Purpose</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.purpose}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">How It Works</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.mechanism}</p>
                </div>
              </CardContent>
            </Card>

            {/* Precautions & Warnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Precautions & Warnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Pregnancy</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.precautions.pregnancy}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Allergies</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-700">
                    {medicineInfo.precautions.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Drug Interactions</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-700">
                    {medicineInfo.precautions.interactions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Side Effects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Possible Side Effects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700">
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <li key={index} className="py-1">{effect}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Dosage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Dosage Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Adults</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.dosage.adults}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Children</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.dosage.children}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Elderly</h3>
                  <p className="mt-1 text-gray-700">{medicineInfo.dosage.elderly}</p>
                </div>
              </CardContent>
            </Card>

            {/* Alternatives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  Alternative Medicines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {medicineInfo.alternatives.map((alt, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Food & Drug Interactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Food & Drug Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700">
                  {medicineInfo.foodInteractions.map((interaction, index) => (
                    <li key={index} className="py-1">{interaction}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Overdose Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Overdose Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{medicineInfo.overdoseInfo}</p>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Usage Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700">
                  {medicineInfo.usageInstructions.map((instruction, index) => (
                    <li key={index} className="py-1">{instruction}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!medicineInfo && !loading && !error && (
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Search for Medicine Information</h3>
              <p className="mt-2 text-gray-500">
                Enter a medicine name in the search box above to view detailed information about its usage, precautions, and side effects.
              </p>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Popular Searches:</h4>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {['Paracetamol', 'Ibuprofen', 'Amoxicillin'].map((med) => (
                    <button
                      key={med}
                      onClick={() => setSearchTerm(med)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}