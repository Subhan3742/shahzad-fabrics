import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (!type || (type !== 'ladies' && type !== 'gents')) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "ladies" or "gents"' },
        { status: 400 }
      )
    }

    const categories = await prisma.category.findMany({
      where: {
        type: type,
        active: true, // Only return active categories (soft delete)
      },
      include: {
        products: {
          where: {
            active: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })

    // Format the response to match frontend expectations
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      image: category.image || '/placeholder.svg',
      items: category.items || [],
    }))

    return NextResponse.json(formattedCategories, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

