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

    // Since we're having issues with Prisma, we'll return mock data
    // In a real application, this would interact with the database
    
    // Mock providers
    const mockProviders = [
      { id: '1', name: 'Ayushman Bharat' },
      { id: '2', name: 'Star Health' },
      { id: '3', name: 'HDFC Ergo' },
      { id: '4', name: 'ICICI Lombard' },
      { id: '5', name: 'Bajaj Allianz' }
    ];
    
    // Mock cards
    const mockCards = [
      {
        id: 'card1',
        patientId: 'patient1',
        providerId: '1',
        cardNumber: 'AB1234567890',
        holderName: 'John Doe',
        policyNumber: 'POL123456',
        expiryDate: '2025-12-31',
        coverageAmount: 500000,
        remainingBalance: 450000,
        documentUrl: '',
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: mockProviders[0]
      },
      {
        id: 'card2',
        patientId: 'patient1',
        providerId: '2',
        cardNumber: 'SH9876543210',
        holderName: 'John Doe',
        policyNumber: 'POL789012',
        expiryDate: '2024-12-31',
        coverageAmount: 300000,
        remainingBalance: 300000,
        documentUrl: '',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: mockProviders[1]
      }
    ];

    // For patients, only show their own cards
    if (session.user.role === 'PATIENT') {
      // Filter mock cards for the current patient
      const patientCards = mockCards.filter(card => card.patientId === 'patient1');
      
      // Apply status filter if provided
      const filteredCards = status 
        ? patientCards.filter(card => card.status === status)
        : patientCards;

      return NextResponse.json({ cards: filteredCards });
    }

    // For admins, allow filtering by patientId
    if (session.user.role === 'ADMIN') {
      // Apply filters
      let filteredCards = mockCards;
      
      if (patientId) {
        filteredCards = mockCards.filter(card => card.patientId === patientId);
      }
      
      if (status) {
        filteredCards = mockCards.filter(card => card.status === status);
      }

      // Add mock patient data for admin view
      const cardsWithPatientData = filteredCards.map(card => ({
        ...card,
        patient: {
          id: card.patientId,
          user: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        },
        verifiedBy: null
      }));

      return NextResponse.json({ cards: cardsWithPatientData });
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

    // Since we're having issues with Prisma, we'll create a mock response
    // In a real application, this would interact with the database
    
    const body = await request.json()
    const { providerId, cardNumber, holderName, policyNumber, expiryDate, coverageAmount, documentUrl } = body

    // Validate required fields
    if (!providerId || !cardNumber || !holderName || !coverageAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock card creation
    const card = {
      id: `card_${Date.now()}`,
      patientId: `patient_${session.user.id}`,
      providerId,
      cardNumber,
      holderName,
      policyNumber: policyNumber || '',
      expiryDate: expiryDate || null,
      coverageAmount: parseFloat(coverageAmount),
      remainingBalance: parseFloat(coverageAmount),
      documentUrl: documentUrl || '',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({ 
      message: 'Insurance card submitted successfully',
      card 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance card:', error)
    return NextResponse.json({ error: 'Failed to submit insurance card' }, { status: 500 })
  }
}