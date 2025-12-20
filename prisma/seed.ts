import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const { Pool } = pg

// Create connection pool for Prisma 7
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create default admin user
  const defaultPassword = 'admin123' // Default password
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shahzadcollection.com' },
    update: {},
    create: {
      email: 'admin@shahzadcollection.com',
      name: 'Admin User',
      password: hashedPassword,
      type: 'admin',
      active: true,
    },
  })

  console.log('Default admin user created:', {
    email: adminUser.email,
    name: adminUser.name,
    type: adminUser.type,
    password: defaultPassword, // Log for reference
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })


