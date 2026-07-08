import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/claims - Get insurance claims
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')
    const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | null

    // Validate status if provided
    if (status && !['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status parameter' }, { status: 400 })
    }

    // For patients, only show claims for their own cards
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
      }

      const claims = await prisma.insuranceClaim.findMany({
        where: {
          card: {
            patientId: patient.id
          },
          ...(status && { status })
        },
        include: {
          card: {
            include: {
              provider: true
            }
          },
          appointment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ claims })
    }

    // For admins, allow filtering by cardId
    if (session.user.role === 'ADMIN') {
      const claims = await prisma.insuranceClaim.findMany({
        where: {
          ...(cardId && { cardId }),
          ...(status && { status })
        },
        include: {
          card: {
            include: {
              patient: {
                include: {
                  user: true
                }
              },
              provider: true
            }
          },
          appointment: true,
          processedBy: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ claims })
    }

    // For other roles, deny access
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching insurance claims:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance claims' }, { status: 500 })
  }
}

// POST /api/insurance/claims - Create a new insurance claim
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { cardId, appointmentId, serviceName, claimedAmount } = body

    // Validate required fields
    if (!cardId || !serviceName || claimedAmount === undefined || claimedAmount === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate claimedAmount is a number
    const parsedClaimedAmount = Number(claimedAmount)
    if (isNaN(parsedClaimedAmount)) {
      return NextResponse.json({ error: 'Invalid claimed amount' }, { status: 400 })
    }

    // Validate card exists and belongs to patient (if patient)
    const card = await prisma.insuranceCard.findUnique({
      where: { id: cardId },
      include: {
        patient: true
      }
    })

    if (!card) {
      return NextResponse.json({ error: 'Insurance card not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient || card.patientId !== patient.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Validate appointment if provided
    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
      }
    }

    const claim = await prisma.insuranceClaim.create({
      data: {
        cardId,
        ...(appointmentId && { appointmentId }),
        serviceName,
        claimedAmount: parsedClaimedAmount
      }
    })

    return NextResponse.json({ 
      message: 'Insurance claim submitted successfully',
      claim 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance claim:', error)
    return NextResponse.json({ error: 'Failed to submit insurance claim' }, { status: 500 })
  }
}