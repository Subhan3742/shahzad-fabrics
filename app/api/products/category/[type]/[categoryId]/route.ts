import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; categoryId: string }> }
) {
  try {
    const { type, categoryId } = await params
    const body = await request.json()

    if (!type || (type !== 'ladies' && type !== 'gents')) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "ladies" or "gents"' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
        type: type,
        active: true, // Only return active products (soft delete)
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })

    // Format the response to match frontend expectations
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
    }))

    return NextResponse.json(formattedProducts, { status: 200 })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

