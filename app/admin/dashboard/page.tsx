'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Users, Stethoscope, Building, UserCog, DollarSign, BarChart, MessageSquare, Star, Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppointmentChart } from '@/components/charts/appointment-chart'
import { RevenueChart } from '@/components/charts/revenue-chart'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      alert('Access denied. This portal is for admins only.')
      router.push('/')
    } else if (status === 'authenticated') {
      // Simulate data loading
      setTimeout(() => setLoading(false), 1000)
    }
  }, [status, session, router])

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

  const managementCards = [
    {
      title: 'Manage Doctors',
      description: 'Add, edit, and manage doctors',
      icon: Stethoscope,
      href: '/admin/doctors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Manage Patients',
      description: 'View patient information',
      icon: Users,
      href: '/admin/patients',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Departments',
      description: 'Manage hospital departments',
      icon: Building,
      href: '/admin/departments',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Staff Management',
      description: 'Manage nurses and staff',
      icon: UserCog,
      href: '/admin/staff',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Services',
      description: 'Manage hospital services',
      icon: Building,
      href: '/admin/services',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Payments',
      description: 'View payment history',
      icon: DollarSign,
      href: '/admin/payments',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Messages',
      description: 'Send announcements',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Feedback',
      description: 'View patient feedback',
      icon: Star,
      href: '/admin/feedback',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const ErrorFallback = () => (
    <div className="col-span-full">
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Charts</CardTitle>
          <CardDescription>There was an issue loading the analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load chart data. Please try again later.</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Healthcare Administration System</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome, {session.user?.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = '/api/auth/signout'
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Doctors</CardTitle>
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white">42</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active doctors</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white">1,248</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered patients</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Appointments</CardTitle>
                  <BarChart className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white">142</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white">₹2,45,680</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {managementCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <Link key={card.title} href={card.href}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
                        <CardHeader>
                          <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                            <Icon className={`h-6 w-6 ${card.color}`} />
                          </div>
                          <CardTitle className="text-base dark:text-white">{card.title}</CardTitle>
                          <CardDescription className="text-sm">{card.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>

            <ErrorBoundary fallback={<ErrorFallback />}>
              <Suspense fallback={
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="skeleton h-96"></Card>
                  <Card className="skeleton h-96"></Card>
                </div>
              }>
                <div className="mt-8">
                  <AppointmentChart />
                </div>
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<ErrorFallback />}>
              <Suspense fallback={
                <div className="mt-8">
                  <Card className="skeleton h-96"></Card>
                </div>
              }>
                <div className="mt-8">
                  <RevenueChart />
                </div>
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </main>
    </div>
  )
}