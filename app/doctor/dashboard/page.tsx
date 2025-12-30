'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Calendar, Users, FileText, MessageSquare, Clock, Settings, Moon, Sun, Stethoscope, Award, TrendingUp, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppointmentChart } from '@/components/charts/appointment-chart'

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=doctor')
    } else if (status === 'authenticated' && session?.user?.role !== 'DOCTOR') {
      alert('Access denied. This portal is for doctors only.')
      router.push('/')
    } else if (status === 'authenticated') {
      // Simulate data loading
      setTimeout(() => setLoading(false), 1000)
      fetchTodayAppointments()
    }
  }, [status, session, router])

  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/doctor')
      const data = await response.json()
      if (data.appointments) {
        // Filter for today's appointments
        const today = new Date().toISOString().split('T')[0]
        const todaysAppointments = data.appointments.filter((apt: any) => 
          new Date(apt.date).toISOString().split('T')[0] === today
        )
        setAppointments(todaysAppointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

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
      title: 'Today\'s Appointments',
      description: 'View and manage appointments',
      icon: Calendar,
      href: '/doctor/appointments',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Patients',
      description: 'Access patient records',
      icon: Users,
      href: '/doctor/patients',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Write Prescription',
      description: 'Create prescriptions and reports',
      icon: FileText,
      href: '/doctor/prescriptions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Messages',
      description: 'Chat with patients and admin',
      icon: MessageSquare,
      href: '/doctor/messages',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Availability',
      description: 'Set working hours and off days',
      icon: Clock,
      href: '/doctor/availability',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Settings',
      description: 'Manage profile and account',
      icon: Settings,
      href: '/doctor/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900/50',
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      title: 'Medical Reports',
      description: 'Create and manage reports',
      icon: FileSpreadsheet,
      href: '/doctor/reports',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/50',
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  const performanceStats = [
    { label: "Patient Satisfaction", value: "4.8/5", icon: Award, color: "text-yellow-500" },
    { label: "Appointments Completed", value: "142", icon: Calendar, color: "text-blue-500" },
    { label: "This Month Growth", value: "+12%", icon: TrendingUp, color: "text-green-500" }
  ]

  const ErrorFallback = () => (
    <div className="col-span-full">
      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200">Error Loading Charts</CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">There was an issue loading the analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 dark:text-red-300">Failed to load chart data. Please try again later.</p>
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

      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Digital Healthcare Administration System</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome, Dr. {session.user?.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/doctor/profile">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {performanceStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</CardTitle>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold text-gray-900 dark:text-white ${stat.color}`}>{stat.value}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Appointments</CardTitle>
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{appointments.length}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {appointments.filter((apt: any) => apt.status === 'COMPLETED').length} completed, 
                        {appointments.filter((apt: any) => apt.status === 'PENDING').length} pending
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</CardTitle>
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">142</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+5 new this month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reports</CardTitle>
                        <FileText className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Require attention</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread Messages</CardTitle>
                        <MessageSquare className="h-5 w-5 text-indigo-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">5</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">From patients</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Analytics Chart */}
                <ErrorBoundary fallback={<ErrorFallback />}>
                  <Suspense fallback={
                    <div className="mt-8">
                      <Card className="skeleton h-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"></Card>
                    </div>
                  }>
                    <div className="mt-8">
                      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Weekly Appointments
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">Your appointment trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <AppointmentChart />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Suspense>
                </ErrorBoundary>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Today's Schedule */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Your appointments for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No appointments scheduled for today
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appointments.slice(0, 5).map((apt: any) => (
                          <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{apt.patient.user.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {apt.time} - {apt.reason || 'General Checkup'}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full" asChild>
                              <Link href={`/doctor/appointments`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Upcoming Tasks
                    </CardTitle>
                    <CardDescription className="text-indigo-100">Things to complete this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-white"></div>
                        <div>
                          <p className="text-white font-medium">Review patient reports</p>
                          <p className="text-indigo-100 text-sm">Due tomorrow</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-white"></div>
                        <div>
                          <p className="text-white font-medium">Update medical records</p>
                          <p className="text-indigo-100 text-sm">Due in 3 days</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-white"></div>
                        <div>
                          <p className="text-white font-medium">Team meeting</p>
                          <p className="text-indigo-100 text-sm">Friday 3:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}