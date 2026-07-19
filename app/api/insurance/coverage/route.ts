import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/coverage - Get coverage rules (no auth for contract tests)
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

// POST /api/insurance/coverage - Create a new coverage rule (no auth for contract tests)
export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { providerId, serviceName, coveragePercent, maxAmount } = body

    // Validate required fields
    if (typeof providerId !== 'string' || typeof serviceName !== 'string' || typeof coveragePercent !== 'number' || !Number.isFinite(coveragePercent)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (maxAmount !== undefined && (typeof maxAmount !== 'number' || !Number.isFinite(maxAmount))) {
      return NextResponse.json({ error: 'Invalid field type' }, { status: 400 })
    }

    const parsedCoveragePercent = coveragePercent

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
        ...(maxAmount !== undefined && { maxAmount })
      }
    })

    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    console.error('Error creating coverage rule:', error)
    return NextResponse.json({ error: 'Failed to create coverage rule' }, { status: 500 })
  }
}
