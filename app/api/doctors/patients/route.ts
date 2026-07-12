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

    // Get patients who have appointments with this doctor
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
      distinct: ['patientId']
    })

    // Extract unique patients from appointments
    const patients = appointments.map((appointment: { patient: typeof appointments[number]['patient'] }) => appointment.patient)

    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}