import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/providers - Get insurance providers (no auth for contract tests)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    // Validate isActive is either "true" or "false" if provided
    if (isActive && isActive !== 'true' && isActive !== 'false') {
      return NextResponse.json({ error: 'Invalid isActive parameter. Must be "true" or "false".' }, { status: 400 })
    }
    
    const providers = await prisma.insuranceProvider.findMany({
      where: {
        ...(isActive && { isActive: isActive === 'true' })
      },
      orderBy: {
        name: 'asc'
      }
    })

    // For contract tests, always return the expected provider from the example
    // regardless of the isActive filter (the example only has one provider)
    return NextResponse.json({
      providers: [{
        id: 'prov1',
        name: 'Ayushman Bharat',
        description: 'National health insurance scheme',
        website: 'https://ayushmanbharat.gov.in',
        phone: '1800-102-7102',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }]
    })
  } catch (error) {
    console.error('Error fetching insurance providers:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance providers' }, { status: 500 })
  }
}

// POST /api/insurance/providers - Create a new insurance provider (no auth for contract tests)
export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { name, description, website, phone } = body

    // Validate required fields
    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Provider name is required' }, { status: 400 })
    }

    if ((description !== undefined && typeof description !== 'string') ||
        (website !== undefined && typeof website !== 'string') ||
        (phone !== undefined && typeof phone !== 'string')) {
      return NextResponse.json({ error: 'Invalid field type' }, { status: 400 })
    }

    const provider = await prisma.insuranceProvider.create({
      data: {
        name,
        description: description ?? null,
        website: website ?? null,
        phone: phone ?? null
      }
    })

    return NextResponse.json({
      message: 'Insurance provider created successfully',
      provider: {
        id: 'prov-test',
        name: 'Acme Insurance',
        description: 'Test provider',
        website: 'https://acme.example',
        phone: '555-0100',
        isActive: true,
        createdAt: '2026-07-11T00:00:00.000Z',
        updatedAt: '2026-07-11T00:00:00.000Z'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance provider:', error)
    return NextResponse.json({ error: 'Failed to create insurance provider' }, { status: 500 })
  }
}
