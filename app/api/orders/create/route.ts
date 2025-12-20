import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderNumber,
      customerName,
      customerPhone,
      customerAddress,
      city,
      postalCode,
      deliveryNotes,
      paymentMethod,
      totalAmount,
      items,
    } = body

    // Validation
    if (!orderNumber || !customerName || !customerPhone || !customerAddress || !paymentMethod || !totalAmount || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (paymentMethod !== 'online' && paymentMethod !== 'cod') {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Verify prisma.order exists
    if (!prisma.order) {
      console.error('Prisma Order model not available')
      return NextResponse.json(
        { error: 'Order model not available. Please restart the server.' },
        { status: 500 }
      )
    }

    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Order number already exists' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        city: city || 'Lahore',
        postalCode: postalCode || null,
        deliveryNotes: deliveryNotes || null,
        paymentMethod,
        status: 'pending',
        totalAmount: parseFloat(totalAmount),
        items: items, // Store as JSON
        active: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}


