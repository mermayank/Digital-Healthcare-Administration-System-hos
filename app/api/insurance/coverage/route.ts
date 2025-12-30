import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/coverage - Get coverage rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const isActive = searchParams.get('isActive')
    
    const rules = await prisma.coverageRule.findMany({
      where: {
        ...(providerId && { providerId }),
        ...(isActive && { isActive: isActive === 'true' })
      },
      include: {
        provider: true
      },
      orderBy: {
        serviceName: 'asc'
      }
    })

    return NextResponse.json({ rules })
  } catch (error) {
    console.error('Error fetching coverage rules:', error)
    return NextResponse.json({ error: 'Failed to fetch coverage rules' }, { status: 500 })
  }
}

// POST /api/insurance/coverage - Create a new coverage rule (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { providerId, serviceName, coveragePercent, maxAmount } = body

    // Validate provider exists
    const provider = await prisma.insuranceProvider.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Insurance provider not found' }, { status: 404 })
    }

    const rule = await prisma.coverageRule.create({
      data: {
        providerId,
        serviceName,
        coveragePercent: parseFloat(coveragePercent),
        ...(maxAmount && { maxAmount: parseFloat(maxAmount) })
      }
    })

    return NextResponse.json({ 
      message: 'Coverage rule created successfully',
      rule 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating coverage rule:', error)
    return NextResponse.json({ error: 'Failed to create coverage rule' }, { status: 500 })
  }
}