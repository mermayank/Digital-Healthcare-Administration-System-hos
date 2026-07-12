import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database...');

    // Delete existing test data in reverse order of dependencies
    await prisma.insuranceClaim.deleteMany();
    await prisma.insuranceCard.deleteMany();
    await prisma.coverageRule.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
    await prisma.insuranceProvider.deleteMany();

    // Create test data
    const existingProv1 = await prisma.insuranceProvider.findUnique({ where: { id: 'prov1' } });
    if (!existingProv1) {
      await prisma.insuranceProvider.create({
        data: {
          id: 'prov1',
          name: 'Ayushman Bharat',
          description: 'National health insurance scheme',
          website: 'https://ayushmanbharat.gov.in',
          phone: '1800-102-7102',
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      });
    }

    const existingProv2 = await prisma.insuranceProvider.findUnique({ where: { id: 'prov2' } });
    if (!existingProv2) {
      await prisma.insuranceProvider.create({
        data: {
          id: 'prov2',
          name: 'Star Health',
          description: 'Private health insurance provider',
          website: 'https://starhealth.in',
          phone: '1800-425-2255',
          isActive: true,
          createdAt: new Date('2024-01-02T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        },
      });
    }

    // Create sample user
    let patientUser = await prisma.user.findUnique({ where: { email: 'patient@hospital.com' } });
    if (!patientUser) {
      patientUser = await prisma.user.create({
        data: {
          email: 'patient@hospital.com',
          password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // admin123
          name: 'John Doe',
          role: 'PATIENT',
        },
      });
    }

    // Create patient
    let patient = await prisma.patient.findUnique({ where: { userId: patientUser.id } });
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          id: 'patient1',
          userId: patientUser.id,
          bloodGroup: 'O+',
          allergies: 'None',
          medicalHistory: 'No significant medical history',
        },
      });
    }

    // Create insurance card
    const existingCard1 = await prisma.insuranceCard.findUnique({ where: { id: 'card1' } });
    if (!existingCard1) {
      await prisma.insuranceCard.create({
        data: {
          id: 'card1',
          patientId: patient.id,
          providerId: 'prov1',
          cardNumber: 'AB1234567890',
          holderName: 'John Doe',
          policyNumber: 'POL123456',
          expiryDate: new Date('2025-12-31T00:00:00Z'),
          coverageAmount: 500000,
          remainingBalance: 450000,
          documentUrl: '/uploads/card1.jpg',
          status: 'APPROVED',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      });
    }

    const existingDeleteCard = await prisma.insuranceCard.findUnique({ where: { id: 'card-delete' } });
    if (!existingDeleteCard) {
      await prisma.insuranceCard.create({
        data: { id: 'card-delete', patientId: patient.id, providerId: 'prov1', cardNumber: 'DELETE-CARD-001', holderName: 'Delete Test', coverageAmount: 1, remainingBalance: 1 }
      });
    }

    // Create coverage rule
    const existingRule1 = await prisma.coverageRule.findUnique({ where: { id: 'rule1' } });
    if (!existingRule1) {
      await prisma.coverageRule.create({
        data: {
          id: 'rule1',
          providerId: 'prov1',
          serviceName: 'General Consultation',
          coveragePercent: 80,
          maxAmount: 1000,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      });
    }

    const existingDeleteRule = await prisma.coverageRule.findUnique({ where: { id: 'rule-delete' } });
    if (!existingDeleteRule) {
      await prisma.coverageRule.create({ data: { id: 'rule-delete', providerId: 'prov1', serviceName: 'Delete Test Rule', coveragePercent: 1 } });
    }

    // Create insurance claim
    const existingClaim1 = await prisma.insuranceClaim.findUnique({ where: { id: 'claim1' } });
    if (!existingClaim1) {
      await prisma.insuranceClaim.create({
        data: {
          id: 'claim1',
          cardId: 'card1',
          appointmentId: null,
          serviceName: 'General Consultation',
          claimedAmount: 500,
          approvedAmount: null,
          status: 'PENDING',
          rejectionReason: null,
          processedById: null,
          processedAt: null,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      });
    }

    // Ensure card1 exists for contract tests (always recreate to ensure correct state)
    await prisma.insuranceCard.deleteMany({ where: { id: 'card1' } });
    if (patient) {
      await prisma.insuranceCard.create({
        data: {
          id: 'card1',
          patientId: patient.id,
          providerId: 'prov1',
          cardNumber: 'AB1234567890',
          holderName: 'John Doe',
          policyNumber: 'POL123456',
          expiryDate: new Date('2025-12-31T00:00:00Z'),
          coverageAmount: 500000,
          remainingBalance: 450000,
          documentUrl: '/uploads/card1.jpg',
          status: 'APPROVED',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
