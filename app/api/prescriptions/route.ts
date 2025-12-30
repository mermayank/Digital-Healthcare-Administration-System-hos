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

    const prescriptions = await prisma.prescription.findMany({
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
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { patientId, medications, dosage, instructions } = body

    // Get doctor ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { doctor: true }
    })

    if (!user?.doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: user.doctor.id,
        medications: JSON.stringify(medications),
        dosage: dosage || '',
        instructions: instructions || ''
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Prescription created successfully',
      prescription 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating prescription:', error)
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 })
  }
}