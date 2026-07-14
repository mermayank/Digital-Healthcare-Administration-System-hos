import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// SQLite's default journal mode locks the whole file on writes, which causes
// intermittent "database is disconnected" errors when many requests hit the
// API concurrently (e.g. during Specmatic's resiliency test runs). WAL mode
// allows concurrent readers alongside a writer and fixes this.
if (!globalForPrisma.prisma) {
  prisma.$executeRawUnsafe('PRAGMA journal_mode=WAL;').catch(() => {
    // Non-fatal: falls back to default journal mode if this fails.
  })
}