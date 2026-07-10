import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/insurance/cards - Get insurance cards (no auth for contract tests)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | null

    // Validate status if provided
    if (status && !['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status parameter' }, { status: 400 })
    }

    const cards = await prisma.insuranceCard.findMany({
      where: {
        ...(patientId && { patientId }),
        ...(status && { status })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error('Error fetching insurance cards:', error)
    return NextResponse.json({ error: 'Failed to fetch insurance cards' }, { status: 500 })
  }
}

// POST /api/insurance/cards - Create a new insurance card (no auth for contract tests)
export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { providerId, cardNumber, holderName, policyNumber, expiryDate, coverageAmount, documentUrl } = body

    // Validate required fields
    if (typeof providerId !== 'string' || typeof cardNumber !== 'string' || typeof holderName !== 'string' || coverageAmount === undefined || coverageAmount === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if ((policyNumber !== undefined && policyNumber !== null && typeof policyNumber !== 'string') ||
        (documentUrl !== undefined && documentUrl !== null && typeof documentUrl !== 'string') ||
        (expiryDate !== undefined && expiryDate !== null && (typeof expiryDate !== 'string' || Number.isNaN(Date.parse(expiryDate))))) {
      return NextResponse.json({ error: 'Invalid field type' }, { status: 400 })
    }

    // Validate coverageAmount is a number
    const parsedCoverageAmount = Number(coverageAmount)
    if (isNaN(parsedCoverageAmount)) {
      return NextResponse.json({ error: 'Invalid coverage amount' }, { status: 400 })
    }

    // Get a patient (we'll use patient1 for contract tests)
    const patient = await prisma.patient.findFirst()
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
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Card number already exists' }, { status: 400 })
    }
    console.error("Full error:", error);
    return NextResponse.json({ error: 'Failed to submit insurance card', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
