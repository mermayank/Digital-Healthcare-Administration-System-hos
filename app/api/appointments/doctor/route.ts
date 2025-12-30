import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get doctor ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { doctor: true }
    })

    if (!user?.doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: user.doctor.id
      },
      include: {
        patient: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}