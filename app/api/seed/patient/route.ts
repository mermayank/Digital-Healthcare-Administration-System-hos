import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash('patient123', 10)

    // Check if patient already exists
    const existingPatient = await prisma.user.findUnique({
      where: { email: 'patient@hospital.com' }
    })

    if (existingPatient) {
      return NextResponse.json({ 
        message: 'Patient already exists',
        patient: existingPatient
      }, { status: 200 })
    }

    const patient = await prisma.user.create({
      data: {
        name: 'John Patient',
        email: 'patient@hospital.com',
        password: hashedPassword,
        role: 'PATIENT',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State',
        patient: {
          create: {
            bloodGroup: 'O+'
          }
        }
      },
      include: {
        patient: true
      }
    })

    return NextResponse.json({ 
      message: 'Patient created successfully',
      patient
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding patient:', error)
    return NextResponse.json({ error: 'Failed to seed patient' }, { status: 500 })
  }
}
