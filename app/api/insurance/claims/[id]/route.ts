import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/claims/[id] - Get a specific insurance claim
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

    const claim = await prisma.insuranceClaim.findUnique({
      where: { id },
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
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Insurance claim not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient || claim.card.patientId !== patient.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('Error fetching insurance claim:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance claim' }, { status: 500 })
  }
}

// PUT /api/insurance/claims/[id] - Update an insurance claim (process/approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const claim = await prisma.insuranceClaim.findUnique({
      where: { id },
      include: {
        card: true
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Insurance claim not found' }, { status: 404 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { status, approvedAmount, rejectionReason } = body

    // Calculate remaining balance if approving
    let updatedRemainingBalance = claim.card.remainingBalance
    let parsedApprovedAmount: number | undefined = undefined
    if (status === 'APPROVED' && approvedAmount !== undefined && approvedAmount !== null) {
      parsedApprovedAmount = Number(approvedAmount)
      if (isNaN(parsedApprovedAmount)) {
        return NextResponse.json({ error: 'Invalid approved amount' }, { status: 400 })
      }
      updatedRemainingBalance = claim.card.remainingBalance - parsedApprovedAmount
    }

    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id },
      data: {
        status,
        ...(parsedApprovedAmount !== undefined && { approvedAmount: parsedApprovedAmount }),
        ...(rejectionReason && { rejectionReason }),
        ...((status === 'APPROVED' || status === 'REJECTED') && { 
          processedById: session.user.id, 
          processedAt: new Date() 
        })
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
      }
    })

    // Update card remaining balance if claim is approved
    if (status === 'APPROVED' && parsedApprovedAmount !== undefined) {
      await prisma.insuranceCard.update({
        where: { id: claim.cardId },
        data: {
          remainingBalance: updatedRemainingBalance
        }
      })
    }

    return NextResponse.json({ 
      message: `Insurance claim ${status.toLowerCase()} successfully`,
      claim: updatedClaim 
    })
  } catch (error) {
    console.error('Error updating insurance claim:', error)
    return NextResponse.json({ error: 'Failed to update insurance claim' }, { status: 500 })
  }
}