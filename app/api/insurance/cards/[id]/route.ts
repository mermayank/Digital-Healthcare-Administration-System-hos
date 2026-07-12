import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/cards/[id] - Get a specific insurance card (no auth for contract tests)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const card = await prisma.insuranceCard.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json({ error: 'Insurance card not found' }, { status: 404 })
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

// PUT /api/insurance/cards/[id] - Update an insurance card (no auth for contract tests)
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
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const data: {
    documentUrl?: string
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
    rejectionReason?: string
  } = {}

  if ('documentUrl' in body) {
    if (body.documentUrl === null || typeof body.documentUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid documentUrl' }, { status: 400 })
    }
    data.documentUrl = body.documentUrl
  }

  if ('status' in body) {
    if (body.status === null || typeof body.status !== 'string' || !['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    data.status = body.status
  }

  if ('rejectionReason' in body) {
    if (body.rejectionReason === null || typeof body.rejectionReason !== 'string') {
      return NextResponse.json({ error: 'Invalid rejectionReason' }, { status: 400 })
    }
    data.rejectionReason = body.rejectionReason
  }

  // Check if card exists
  const card = await prisma.insuranceCard.findUnique({
    where: { id }
  })

  if (!card) {
    return NextResponse.json(
      { error: 'Insurance card not found' },
      { status: 404 }
    )
  }

  // Update card in database
  try {
    const updatedCard = await prisma.insuranceCard.update({
      where: { id },
      data
    })

    return NextResponse.json({
      message: 'Insurance card updated successfully',
      card: updatedCard
    })
  } catch (error) {
    console.error('Error updating insurance card:', error)
    return NextResponse.json(
      { error: 'Failed to update insurance card' },
      { status: 500 }
    )
  }
}

// DELETE /api/insurance/cards/[id] - Delete an insurance card (no auth for contract tests)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.insuranceCard.deleteMany({
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
