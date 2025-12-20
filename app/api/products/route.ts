import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all products or featured products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { featured, type, limit } = body

    const where: any = {
      active: true, // Only return active products (soft delete)
    }

    if (featured === true) {
      where.featured = true
    }

    if (type && (type === 'ladies' || type === 'gents')) {
      where.type = type
    }

    const products = await prisma.product.findMany({
      where,
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
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    // Format the response to match frontend expectations
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      images: product.images || [],
      description: product.description,
      fullDescription: product.fullDescription || product.description,
      category: product.category.name,
      type: product.type as 'ladies' | 'gents',
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || undefined,
      featured: product.featured || false,
      specifications: {
        material: product.material || '',
        width: product.width || '',
        weight: product.weight || undefined,
        care: product.care || '',
        origin: product.origin || undefined,
      },
      colors: product.colors || [],
      sizes: product.sizes || [],
      features: product.features || [],
      rating: product.rating || undefined,
      reviews: product.reviews || undefined,
    }))

    return NextResponse.json(formattedProducts, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

