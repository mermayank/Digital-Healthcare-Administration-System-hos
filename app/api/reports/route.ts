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

    // Check if user is doctor or patient
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { doctor: true, patient: true }
    })

    if (!user?.doctor && !user?.patient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let reports;
    
    if (user.doctor) {
      // Doctor - get reports they created
      reports = await prisma.medicalReport.findMany({
        where: {
          doctorId: user.doctor.id
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Patient - get their reports
      reports = await prisma.medicalReport.findMany({
        where: {
          patientId: user.patient!.id
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { patientId, title, diagnosis, treatment, notes } = body

    // Get doctor ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { doctor: true }
    })

    if (!user?.doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const report = await prisma.medicalReport.create({
      data: {
        patientId,
        doctorId: user.doctor.id,
        title,
        diagnosis,
        treatment: treatment || '',
        notes: notes || ''
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
      message: 'Medical report created successfully',
      report 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}