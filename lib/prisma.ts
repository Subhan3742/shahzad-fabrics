import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.')
}

// Create a connection pool
const pool = new Pool({
  connectionString: databaseUrl,
})

// Create the adapter
const adapter = new PrismaPg(pool)

// Initialize PrismaClient with the adapter
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Error creating PrismaClient:', error)
    throw error
  }
}

// In development, check if all models exist, if not recreate client
let prismaInstance = globalForPrisma.prisma

const nodeEnv = process.env.NODE_ENV || 'development'
const isDevelopment = nodeEnv === 'development'
const isProduction = nodeEnv === 'production'

if (!prismaInstance) {
  prismaInstance = createPrismaClient()
  if (!isProduction) {
    globalForPrisma.prisma = prismaInstance
  }
} else if (isDevelopment) {
  // Check if models exist, recreate if needed
  try {
    // Try to access models to verify they exist
    if (!('order' in prismaInstance) || !('user' in prismaInstance) || !('section' in prismaInstance) || !('bankDetails' in prismaInstance) || !('storeInfo' in prismaInstance) || !('aboutPage' in prismaInstance) || !('owner' in prismaInstance)) {
      prismaInstance = createPrismaClient()
      if (!isProduction) {
        globalForPrisma.prisma = prismaInstance
      }
    }
  } catch (error) {
    // If there's an error, recreate the client
    prismaInstance = createPrismaClient()
    if (!isProduction) {
      globalForPrisma.prisma = prismaInstance
    }
  }
}

export const prisma = prismaInstance

