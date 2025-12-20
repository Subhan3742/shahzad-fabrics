import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verify prisma.order exists
    if (!prisma.order) {
      console.error('Prisma Order model not available. Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))
      return NextResponse.json(
        { error: 'Order model not available. Please restart the server.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { status, limit } = body

    const where: any = {
      active: true, // Only return active orders (soft delete)
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}


