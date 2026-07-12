import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check insurance providers
    const providers = await prisma.insuranceProvider.findMany()
    
    // Check insurance cards
    const cards = await prisma.insuranceCard.findMany({
      include: {
        provider: true,
        patient: {
          include: {
            user: true
          }
        }
      }
    })
    
    // Check users
    const users = await prisma.user.findMany()
    
    return NextResponse.json({ 
      providers: providers.length,
      cards: cards.length,
      users: users.length,
      providerList: providers.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })),
      cardList: cards.map((c: { id: string; cardNumber: string; provider: { name: string }; patient?: { user?: { name: string | null } | null } }) => ({ 
        id: c.id, 
        cardNumber: c.cardNumber, 
        provider: c.provider.name, 
        patient: c.patient?.user?.name || 'Unknown' 
      }))
    })
  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json({ error: 'Failed to check database', details: (error as Error).message }, { status: 500 })
  }
}