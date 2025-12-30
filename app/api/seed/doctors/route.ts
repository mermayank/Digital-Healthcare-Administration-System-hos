import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash('doctor123', 10)

    const sampleDoctors = [
      {
        name: 'Dr. John Smith',
        email: 'john.smith@hospital.com',
        specialization: 'Cardiology',
        experience: 15,
        fee: 150
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        specialization: 'Neurology',
        experience: 12,
        fee: 180
      },
      {
        name: 'Dr. Mike Brown',
        email: 'mike.brown@hospital.com',
        specialization: 'Orthopedics',
        experience: 10,
        fee: 120
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@hospital.com',
        specialization: 'Pediatrics',
        experience: 8,
        fee: 100
      },
      {
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@hospital.com',
        specialization: 'Dermatology',
        experience: 14,
        fee: 130
      }
    ]

    const createdDoctors = []

    for (const doc of sampleDoctors) {
      // Check if doctor already exists
      const existing = await prisma.user.findUnique({
        where: { email: doc.email }
      })

      if (!existing) {
        const doctor = await prisma.user.create({
          data: {
            name: doc.name,
            email: doc.email,
            password: hashedPassword,
            role: 'DOCTOR',
            doctor: {
              create: {
                specialization: doc.specialization,
                license: `LIC-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                experience: doc.experience,
                education: 'MBBS, MD',
                consultationFee: doc.fee
              }
            }
          },
          include: {
            doctor: true
          }
        })
        createdDoctors.push(doctor)
      }
    }

    return NextResponse.json({ 
      message: 'Sample doctors created successfully',
      count: createdDoctors.length,
      doctors: createdDoctors
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding doctors:', error)
    return NextResponse.json({ error: 'Failed to seed doctors' }, { status: 500 })
  }
}
