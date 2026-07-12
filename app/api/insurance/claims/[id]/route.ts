import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/claims/[id] - Get a specific insurance claim (no auth for contract tests)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Insurance claim not found' }, { status: 404 })
    }

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('Error fetching insurance claim:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance claim' }, { status: 500 })
  }
}

// PUT /api/insurance/claims/[id] - Update an insurance claim (no auth for contract tests)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Parse and validate request body
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { status, approvedAmount, rejectionReason } = body

  if (status !== undefined && (status === null || typeof status !== 'string' || !['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'].includes(status))) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  if (approvedAmount !== undefined && (approvedAmount === null || typeof approvedAmount !== 'number' || !Number.isFinite(approvedAmount))) {
    return NextResponse.json({ error: 'Invalid approved amount' }, { status: 400 })
  }

  if (rejectionReason !== undefined && (rejectionReason === null || typeof rejectionReason !== 'string')) {
    return NextResponse.json({ error: 'Invalid rejectionReason' }, { status: 400 })
  }

  // Check if claim exists
  const claim = await prisma.insuranceClaim.findUnique({
    where: { id }
  })

  if (!claim) {
    return NextResponse.json({ error: 'Insurance claim not found' }, { status: 404 })
  }

  // Calculate remaining balance if approving
  let updatedRemainingBalance
  let parsedApprovedAmount: number | undefined = undefined
  if (status === 'APPROVED' && approvedAmount !== undefined) {
    parsedApprovedAmount = approvedAmount
  }

  // Update claim in database
  try {
    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id },
      data: {
        status,
        ...(parsedApprovedAmount !== undefined && { approvedAmount: parsedApprovedAmount }),
        ...(rejectionReason !== undefined && { rejectionReason })
      }
    })

    // Update card remaining balance if claim is approved
    if (status === 'APPROVED' && parsedApprovedAmount !== undefined) {
      const card = await prisma.insuranceCard.findUnique({
        where: { id: updatedClaim.cardId }
      })
      if (card) {
        updatedRemainingBalance = card.remainingBalance - parsedApprovedAmount
        await prisma.insuranceCard.update({
          where: { id: updatedClaim.cardId },
          data: {
            remainingBalance: updatedRemainingBalance
          }
        })
      }
    }

    return NextResponse.json({
      message: status ? `Insurance claim ${status.toLowerCase()} successfully` : 'Insurance claim updated successfully',
      claim: updatedClaim
    })
  } catch (error) {
    console.error('Error updating insurance claim:', error)
    return NextResponse.json({ error: 'Failed to update insurance claim' }, { status: 500 })
  }
}
