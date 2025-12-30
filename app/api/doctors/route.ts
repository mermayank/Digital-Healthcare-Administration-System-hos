import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
        department: true
      },
      where: {
        isActive: true
      }
    })

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, specialization, experience, consultationFee } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Doctor with this email already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'doctor123', 10)

    // Create doctor with user
    const doctor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization: specialization || 'General Medicine',
            license: `LIC-${Date.now()}`,
            experience: parseInt(experience) || 5,
            education: 'MBBS, MD',
            consultationFee: parseFloat(consultationFee) || 100
          }
        }
      },
      include: {
        doctor: true
      }
    })

    return NextResponse.json({ 
      message: 'Doctor created successfully',
      doctor 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor:', error)
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 })
  }
}
