'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Shield, Stethoscope, UserCircle } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const { data: session, status } = useSession()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If user is already signed in, redirect to their dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const roleRedirectMap: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        DOCTOR: '/doctor/dashboard',
        PATIENT: '/patient/dashboard'
      }
      router.push(roleRedirectMap[session.user.role as string] || '/')
    }
  }, [status, session, router])

  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <Shield className="w-12 h-12 text-purple-600" />
      case 'doctor':
        return <Stethoscope className="w-12 h-12 text-green-600" />
      case 'patient':
        return <UserCircle className="w-12 h-12 text-blue-600" />
      default:
        return <UserCircle className="w-12 h-12 text-blue-600" />
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Portal'
      case 'doctor':
        return 'Doctor Portal'
      case 'patient':
        return 'Patient Portal'
      default:
        return 'Sign In'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Session will be updated, useEffect will handle redirect
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">{getRoleIcon()}</div>
          <CardTitle className="text-2xl text-center">{getRoleTitle()}</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-semibold">
                Sign up
              </Link>
            </div>
            <Link href="/" className="text-sm text-center text-gray-600 hover:underline">
              Back to home
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
