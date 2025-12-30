'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Calendar, FileText, MessageSquare, Star, CreditCard, Bell, Pill, Moon, Sun, Heart, Stethoscope, Award, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    } else if (status === 'authenticated' && session?.user?.role !== 'PATIENT') {
      alert('Access denied. This portal is for patients only.')
      router.push('/')
    } else if (status === 'authenticated') {
      // Simulate data loading
      setTimeout(() => setLoading(false), 1000)
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading your dashboard...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const dashboardCards = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment with a doctor',
      icon: Calendar,
      href: '/patient/appointments/book',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Appointments',
      description: 'View and manage your appointments',
      icon: Calendar,
      href: '/patient/appointments',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Medical Records',
      description: 'Access your prescriptions and reports',
      icon: FileText,
      href: '/patient/medical-records',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Chat with Doctor',
      description: 'Message your healthcare providers',
      icon: MessageSquare,
      href: '/patient/chat',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Reviews & Ratings',
      description: 'Rate your doctor visits',
      icon: Star,
      href: '/patient/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Payment History',
      description: 'View bills and payment records',
      icon: CreditCard,
      href: '/patient/payments',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Medicine Lookup',
      description: 'Search medicine information and details',
      icon: Pill,
      href: '/patient/medicine-lookup',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900/50',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Insurance Cards',
      description: 'Manage your health insurance cards',
      icon: Shield,
      href: '/patient/insurance',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/50',
      gradient: 'from-cyan-500 to-cyan-600'
    }
  ]

  const healthTips = [
    { icon: Heart, tip: "Drink 8 glasses of water daily" },
    { icon: Stethoscope, tip: "Get regular health checkups" },
    { icon: Award, tip: "Maintain a balanced diet" }
  ]

  const ErrorFallback = () => (
    <div className="col-span-full">
      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200">Error Loading Content</CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">There was an issue loading some content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 dark:text-red-300">Failed to load content. Please try again later.</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Digital Healthcare Administration System</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {session.user?.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <Bell className="h-5 w-5 dark:text-gray-300" />
              </Button>
              <Link href="/patient/profile">
                <Button variant="outline" className="rounded-full">Profile</Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Appointments</CardTitle>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">2</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Next: Dr. Smith, Tomorrow 10:00 AM</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Medical Records</CardTitle>
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">8</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reports & Prescriptions</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</CardTitle>
                    <CreditCard className="h-5 w-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">₹1,250</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">1 unpaid bill</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Score</CardTitle>
                    <Heart className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">85%</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Excellent health</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dashboard Cards */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {dashboardCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                      <Link key={card.title} href={card.href} className="group">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full group-hover:-translate-y-1">
                          <CardHeader>
                            <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                              <Icon className={`h-7 w-7 ${card.color}`} />
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">{card.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Health Tips */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Health Tips
                    </CardTitle>
                    <CardDescription className="text-blue-100">Stay healthy with these tips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthTips.map((tip, index) => {
                        const Icon = tip.icon
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="mt-1">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white text-sm">{tip.tip}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <ErrorBoundary fallback={<ErrorFallback />}>
                  <Suspense fallback={
                    <Card className="skeleton h-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"></Card>
                  }>
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Your latest health interactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Appointment with Dr. Smith confirmed</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Prescription for antibiotics received</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">1 day ago</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="mt-1 w-3 h-3 rounded-full bg-purple-500"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Lab results available for review</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">2 days ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}