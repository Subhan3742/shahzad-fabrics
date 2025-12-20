import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    const { userId } = await params
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'update') {
      const { name, email, password, type, active } = data

      const updateData: any = {}

      if (name !== undefined) updateData.name = name
      if (email !== undefined) updateData.email = email
      if (type !== undefined) {
        if (type !== 'admin' && type !== 'employee') {
          return NextResponse.json(
            { error: 'Invalid user type. Must be "admin" or "employee"' },
            { status: 400 }
          )
        }
        updateData.type = type
      }
      if (active !== undefined) updateData.active = active
      if (password !== undefined && password !== '') {
        updateData.password = await bcrypt.hash(password, 10)
      }

      // Check if email is being changed and already exists
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (existingUser && existingUser.id !== parseInt(userId)) {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 400 }
          )
        }
      }

      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          type: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return NextResponse.json(user, { status: 200 })
    }

    if (action === 'delete') {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { active: false },
      })

      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in user API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}


