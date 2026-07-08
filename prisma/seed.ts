import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Check if providers already exist
    const existingProviders = await prisma.insuranceProvider.findMany();
    
    if (existingProviders.length === 0) {
      const providers = await prisma.insuranceProvider.createMany({
        data: [
          {
            name: 'Ayushman Bharat',
            description: 'Government health insurance scheme',
            website: 'https://www.pmindia.gov.in/en/healthcare/',
            phone: '1800-180-1104',
            isActive: true
          },
          {
            name: 'Star Health',
            description: 'Private health insurance provider',
            website: 'https://www.starhealth.in/',
            phone: '1800-425-2255',
            isActive: true
          },
          {
            name: 'HDFC Ergo',
            description: 'General insurance company',
            website: 'https://www.hdfcergo.com/',
            phone: '1800-222-222',
            isActive: true
          }
        ]
      });
      console.log(`Created ${providers.count} insurance providers`);
    } else {
      console.log('Insurance providers already exist');
    }
    
    // Create sample users
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@hospital.com' },
      update: {},
      create: {
        email: 'admin@hospital.com',
        password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // admin123
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
    
    const patientUser = await prisma.user.upsert({
      where: { email: 'patient@hospital.com' },
      update: {},
      create: {
        email: 'patient@hospital.com',
        password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // admin123
        name: 'John Doe',
        role: 'PATIENT'
      }
    });
    
    // Create patient
    const patient = await prisma.patient.upsert({
      where: { userId: patientUser.id },
      update: {},
      create: {
        userId: patientUser.id,
        bloodGroup: 'O+',
        allergies: 'None',
        medicalHistory: 'No significant medical history'
      }
    });
    
    // Get providers
    const allProviders = await prisma.insuranceProvider.findMany();
    
    // Check if cards already exist
    const existingCards = await prisma.insuranceCard.findMany();
    if (allProviders.length > 0 && existingCards.length === 0) {
      const cards = await prisma.insuranceCard.createMany({
        data: [
          {
            patientId: patient.id,
            providerId: allProviders[0].id,
            cardNumber: 'AB1234567890',
            holderName: 'John Doe',
            policyNumber: 'POL123456',
            coverageAmount: 500000,
            remainingBalance: 450000,
            status: 'APPROVED'
          },
          {
            patientId: patient.id,
            providerId: allProviders[1].id,
            cardNumber: 'SH9876543210',
            holderName: 'John Doe',
            policyNumber: 'POL987654',
            coverageAmount: 300000,
            remainingBalance: 300000,
            status: 'PENDING'
          }
        ]
      });
      
      console.log(`Created ${cards.count} insurance cards`);
    } else {
      console.log('Insurance cards already exist');
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();