import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database contents...');
    
    // Check insurance providers
    const providers: any[] = await (prisma as any).insuranceProvider.findMany();
    console.log(`Insurance Providers: ${providers.length}`);
    providers.forEach((p: any) => console.log(`  - ${p.name}`));
    
    // Check insurance cards
    const cards: any[] = await (prisma as any).insuranceCard.findMany({
      include: {
        provider: true,
        patient: {
          include: {
            user: true
          }
        }
      }
    });
    console.log(`Insurance Cards: ${cards.length}`);
    cards.forEach((c: any) => console.log(`  - ID: ${c.id}, CardNumber: ${c.cardNumber} (${c.provider.name}) for ${c.patient?.user?.name || 'Unknown'}`));
    
    // Check claims
    const claims: any[] = await (prisma as any).insuranceClaim.findMany({
      include: {
        card: true
      }
    });
    console.log(`Insurance Claims: ${claims.length}`);
    claims.forEach((c: any) => console.log(`  - ID: ${c.id}, CardID: ${c.cardId}, Service: ${c.serviceName}`));
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`Users: ${users.length}`);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();