import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/coverage/[id] - Get a specific coverage rule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rule = await prisma.coverageRule.findUnique({
      where: { id: params.id },
      include: {
        provider: true
      }
    })

    if (!rule) {
      return NextResponse.json({ error: 'Coverage rule not found' }, { status: 404 })
    }

    return NextResponse.json({ rule })
  } catch (error) {
    console.error('Error fetching coverage rule:', error)
    return NextResponse.json({ error: 'Failed to fetch coverage rule' }, { status: 500 })
  }
}

// PUT /api/insurance/coverage/[id] - Update a coverage rule (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.coverageRule.findUnique({
      where: { id: params.id }
    })

    if (!rule) {
      return NextResponse.json({ error: 'Coverage rule not found' }, { status: 404 })
    }

    const body = await request.json()
    const { serviceName, coveragePercent, maxAmount, isActive } = body

    const updatedRule = await prisma.coverageRule.update({
      where: { id: params.id },
      data: {
        ...(serviceName && { serviceName }),
        ...(coveragePercent !== undefined && { coveragePercent: parseFloat(coveragePercent) }),
        ...(maxAmount !== undefined && { maxAmount: maxAmount ? parseFloat(maxAmount) : null }),
        ...(isActive !== undefined && { isActive: isActive === 'true' || isActive === true })
      },
      include: {
        provider: true
      }
    })

    return NextResponse.json({ 
      message: 'Coverage rule updated successfully',
      rule: updatedRule 
    })
  } catch (error) {
    console.error('Error updating coverage rule:', error)
    return NextResponse.json({ error: 'Failed to update coverage rule' }, { status: 500 })
  }
}

// DELETE /api/insurance/coverage/[id] - Delete a coverage rule (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.coverageRule.findUnique({
      where: { id: params.id }
    })

    if (!rule) {
      return NextResponse.json({ error: 'Coverage rule not found' }, { status: 404 })
    }

    await prisma.coverageRule.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Coverage rule deleted successfully' })
  } catch (error) {
    console.error('Error deleting coverage rule:', error)
    return NextResponse.json({ error: 'Failed to delete coverage rule' }, { status: 500 })
  }
}