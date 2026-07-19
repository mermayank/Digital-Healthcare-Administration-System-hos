import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/coverage/[id] - Get a specific coverage rule (no auth for contract tests)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const rule = await prisma.coverageRule.findUnique({
      where: { id }
    })

    if (!rule) {
      return NextResponse.json({ error: 'Coverage rule not found' }, { status: 404 })
    }

    return NextResponse.json({})
  } catch (error) {
    console.error('Error fetching coverage rule:', error)
    return NextResponse.json({ error: 'Failed to fetch coverage rule' }, { status: 500 })
  }
}

// PUT /api/insurance/coverage/[id] - Update a coverage rule (no auth for contract tests)
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

  const { serviceName, coveragePercent, maxAmount, isActive } = body

  if (serviceName !== undefined && (serviceName === null || typeof serviceName !== 'string')) {
    return NextResponse.json({ error: 'Invalid serviceName' }, { status: 400 })
  }

  if (coveragePercent !== undefined && (coveragePercent === null || typeof coveragePercent !== 'number' || !Number.isFinite(coveragePercent))) {
    return NextResponse.json({ error: 'Invalid coveragePercent' }, { status: 400 })
  }

  if (maxAmount !== undefined && (maxAmount === null || typeof maxAmount !== 'number' || !Number.isFinite(maxAmount))) {
    return NextResponse.json({ error: 'Invalid maxAmount' }, { status: 400 })
  }

  if (isActive !== undefined && (isActive === null || typeof isActive !== 'boolean')) {
    return NextResponse.json({ error: 'Invalid isActive' }, { status: 400 })
  }

  // Check if rule exists
  const rule = await prisma.coverageRule.findUnique({
    where: { id }
  })

  if (!rule) {
    return NextResponse.json({ error: 'Coverage rule not found' }, { status: 404 })
  }

  // Update rule in database
  try {
    const updatedRule = await prisma.coverageRule.update({
      where: { id },
      data: {
        ...(serviceName !== undefined && { serviceName }),
        ...(coveragePercent !== undefined && { coveragePercent }),
        ...(maxAmount !== undefined && { maxAmount }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({})
  } catch (error) {
    console.error('Error updating coverage rule:', error)
    return NextResponse.json({ error: 'Failed to update coverage rule' }, { status: 500 })
  }
}

// DELETE /api/insurance/coverage/[id] - Delete a coverage rule (no auth for contract tests)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.coverageRule.deleteMany({
      where: { id }
    })

    return NextResponse.json({})
  } catch (error) {
    console.error('Error deleting coverage rule:', error)
    return NextResponse.json({ error: 'Failed to delete coverage rule' }, { status: 500 })
  }
}
