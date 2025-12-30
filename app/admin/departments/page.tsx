'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default function AdminDepartments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin?role=admin')
  }, [status, router])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
              <h1 className="text-2xl font-bold">Departments</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Department</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add Department</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2"><Label>Department Name</Label><Input placeholder="Cardiology" /></div>
                <div className="space-y-2"><Label>Description</Label><Input /></div>
                <Button>Add Department</Button>
              </form>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Departments List</CardTitle></CardHeader>
          <CardContent><div className="text-center py-12 text-gray-500">No departments yet</div></CardContent>
        </Card>
      </main>
    </div>
  )
}
