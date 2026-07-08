import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/cards/[id] - Get a specific insurance card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const card = await prisma.insuranceCard.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        provider: true,
        claims: true,
        verifiedBy: true
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

    return NextResponse.json({ card })
  } catch (error) {
    console.error('Error fetching insurance card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insurance card' },
      { status: 500 }
    )
  }
}

// PUT /api/insurance/cards/[id] - Update an insurance card (verify/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)

    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'PATIENT')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const card = await prisma.insuranceCard.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Insurance card not found' },
        { status: 404 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // If patient is updating their own card
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient || card.patientId !== patient.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Patients can only update documentUrl
      if (body.documentUrl) {
        const updatedCard = await prisma.insuranceCard.update({
          where: { id },
          data: {
            documentUrl: body.documentUrl
          }
        })

        return NextResponse.json({
          message: 'Insurance card updated successfully',
          card: updatedCard
        })
      }

      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // If admin is updating the card (verification)
    if (session.user.role === 'ADMIN') {
      const { status, rejectionReason } = body

      const updatedCard = await prisma.insuranceCard.update({
        where: { id },
        data: {
          status,
          ...(rejectionReason && { rejectionReason }),
          ...(status === 'APPROVED' && {
            verifiedById: session.user.id,
            verifiedAt: new Date()
          })
        },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          provider: true,
          verifiedBy: true
        }
      })

      return NextResponse.json({
        message: `Insurance card ${status.toLowerCase()} successfully`,
        card: updatedCard
      })
    }

    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  } catch (error) {
    console.error('Error updating insurance card:', error)
    return NextResponse.json(
      { error: 'Failed to update insurance card' },
      { status: 500 }
    )
  }
}

// DELETE /api/insurance/cards/[id] - Delete an insurance card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const card = await prisma.insuranceCard.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Insurance card not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient || card.patientId !== patient.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    } else if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await prisma.insuranceCard.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Insurance card deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting insurance card:', error)
    return NextResponse.json(
      { error: 'Failed to delete insurance card' },
      { status: 500 }
    )
  }
}