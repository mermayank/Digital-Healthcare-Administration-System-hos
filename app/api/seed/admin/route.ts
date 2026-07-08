import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@hospital.com' }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        admin: existingAdmin
      }, { status: 200 })
    }

    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: hashedPassword,
        role: 'ADMIN',
        staff: {
          create: {
            position: 'Hospital Administrator',
            department: 'Administration'
          }
        }
      },
      include: {
        staff: true
      }
    })

    return NextResponse.json({ 
      message: 'Admin created successfully',
      admin
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding admin:', error)
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 })
  }
}
