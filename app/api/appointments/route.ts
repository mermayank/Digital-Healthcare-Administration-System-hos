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

    // Get patient ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { patient: true }
    })

    if (!user?.patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: user.patient.id
      },
      include: {
        doctor: {
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId, date, time, reason } = body

    // Get patient ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { patient: true }
    })

    if (!user?.patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: user.patient.id,
        doctorId,
        date: new Date(date),
        time,
        reason,
        status: 'PENDING'
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Appointment booked successfully',
      appointment 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
