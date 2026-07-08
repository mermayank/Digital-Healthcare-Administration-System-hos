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

    // Validate isActive is either "true" or "false" if provided
    if (isActive && isActive !== 'true' && isActive !== 'false') {
      return NextResponse.json({ error: 'Invalid isActive parameter. Must be "true" or "false".' }, { status: 400 })
    }
    
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

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { providerId, serviceName, coveragePercent, maxAmount } = body

    // Validate required fields
    if (!providerId || !serviceName || coveragePercent === undefined || coveragePercent === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate coveragePercent is a number
    const parsedCoveragePercent = Number(coveragePercent)
    if (isNaN(parsedCoveragePercent)) {
      return NextResponse.json({ error: 'Invalid coverage percent' }, { status: 400 })
    }

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
        coveragePercent: parsedCoveragePercent,
        ...(maxAmount !== undefined && maxAmount !== null && { maxAmount: Number(maxAmount) })
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