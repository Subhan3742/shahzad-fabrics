import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const id = parseInt(orderId)

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // If body contains active: false, it's a soft delete
    if (body.active === false) {
      const updated = await prisma.order.update({
        where: { id },
        data: { active: false },
      })
      return NextResponse.json(updated, { status: 200 })
    }

    // Otherwise, update the order status
    const { status } = body

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}



