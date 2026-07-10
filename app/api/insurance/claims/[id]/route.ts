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
  try {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id }
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
    let updatedRemainingBalance
    let parsedApprovedAmount: number | undefined = undefined
    if (status === 'APPROVED' && approvedAmount !== undefined && approvedAmount !== null) {
      parsedApprovedAmount = Number(approvedAmount)
      if (isNaN(parsedApprovedAmount)) {
        return NextResponse.json({ error: 'Invalid approved amount' }, { status: 400 })
      }
    }

    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id },
      data: {
        status,
        ...(parsedApprovedAmount !== undefined && { approvedAmount: parsedApprovedAmount }),
        ...(rejectionReason && { rejectionReason })
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
      message: `Insurance claim ${status.toLowerCase()} successfully`,
      claim: updatedClaim 
    })
  } catch (error) {
    console.error('Error updating insurance claim:', error)
    return NextResponse.json({ error: 'Failed to update insurance claim' }, { status: 500 })
  }
}
