import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/insurance/cards - Get insurance cards for a patient or all cards (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')

    // For patients, only show their own cards
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
      }

      const cards = await prisma.insuranceCard.findMany({
        where: {
          patientId: patient.id,
          ...(status && { status })
        },
        include: {
          provider: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ cards })
    }

    // For admins, allow filtering by patientId
    if (session.user.role === 'ADMIN') {
      const cards = await prisma.insuranceCard.findMany({
        where: {
          ...(patientId && { patientId }),
          ...(status && { status })
        },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          provider: true,
          verifiedBy: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ cards })
    }

    // For other roles, deny access
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching insurance cards:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance cards' }, { status: 500 })
  }
}

// POST /api/insurance/cards - Create a new insurance card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { providerId, cardNumber, holderName, policyNumber, expiryDate, coverageAmount, documentUrl } = body

    // Validate required fields
    if (!providerId || !cardNumber || !holderName || coverageAmount === undefined || coverageAmount === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate coverageAmount is a number
    const parsedCoverageAmount = Number(coverageAmount)
    if (isNaN(parsedCoverageAmount)) {
      return NextResponse.json({ error: 'Invalid coverage amount' }, { status: 400 })
    }

    // Get patient
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Validate provider exists
    const provider = await prisma.insuranceProvider.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Insurance provider not found' }, { status: 404 })
    }

    // Create card
    const card = await prisma.insuranceCard.create({
      data: {
        patientId: patient.id,
        providerId,
        cardNumber,
        holderName,
        policyNumber: policyNumber || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        coverageAmount: parsedCoverageAmount,
        remainingBalance: parsedCoverageAmount,
        documentUrl: documentUrl || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ 
      message: 'Insurance card submitted successfully',
      card 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance card:', error)
    return NextResponse.json({ error: 'Failed to submit insurance card' }, { status: 500 })
  }
}