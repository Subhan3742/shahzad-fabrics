import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'list') {
      const users = await prisma.user.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(users, { status: 200 })
    }

    if (action === 'create') {
      const { email, name, password, type } = data

      if (!email || !name || !password || !type) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      if (type !== 'admin' && type !== 'employee') {
        return NextResponse.json(
          { error: 'Invalid user type. Must be "admin" or "employee"' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          type,
          active: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          type: true,
          createdAt: true,
        },
      })

      return NextResponse.json(user, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}


