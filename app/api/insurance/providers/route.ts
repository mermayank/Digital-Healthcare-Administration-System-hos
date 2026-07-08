import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/providers - Get insurance providers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    
    const providers = await prisma.insuranceProvider.findMany({
      where: {
        ...(isActive && { isActive: isActive === 'true' })
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ providers })
  } catch (error) {
    console.error('Error fetching insurance providers:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance providers' }, { status: 500 })
  }
}

// POST /api/insurance/providers - Create a new insurance provider
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Allow both admins and patients to create providers (patients might need this for custom providers)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { name, description, website, phone } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Provider name is required' }, { status: 400 })
    }

    const provider = await prisma.insuranceProvider.create({
      data: {
        name,
        description: description || null,
        website: website || null,
        phone: phone || null
      }
    })

    return NextResponse.json({ 
      message: 'Insurance provider created successfully',
      provider 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance provider:', error)
    return NextResponse.json({ error: 'Failed to create insurance provider' }, { status: 500 })
  }
}