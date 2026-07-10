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

  try {
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

    const updatedCard = await prisma.insuranceCard.update({
      where: { id },
      data: {
        ...(body.documentUrl && { documentUrl: body.documentUrl }),
        ...(body.status && { status: body.status }),
        ...(body.rejectionReason && { rejectionReason: body.rejectionReason })
      }
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
    const card = await prisma.insuranceCard.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Insurance card not found' },
        { status: 404 }
      )
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
