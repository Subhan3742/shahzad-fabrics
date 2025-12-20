import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      fullDescription,
      price,
      originalPrice,
      image,
      images,
      categoryId,
      type,
      inStock,
      stockQuantity,
      material,
      width,
      weight,
      care,
      origin,
      colors,
      sizes,
      features,
      rating,
      reviews,
      featured,
      active,
    } = body

    // Validation
    if (!name || !description || !price || !image || !categoryId || !type) {
      return NextResponse.json(
        { error: 'Name, description, price, image, categoryId, and type are required' },
        { status: 400 }
      )
    }

    if (type !== 'ladies' && type !== 'gents') {
      return NextResponse.json(
        { error: 'Type must be "ladies" or "gents"' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        fullDescription: fullDescription || null,
        price,
        originalPrice: originalPrice || null,
        image,
        images: images || [],
        categoryId: parseInt(categoryId),
        type,
        inStock: inStock !== undefined ? inStock : true,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : null,
        material: material || null,
        width: width || null,
        weight: weight || null,
        care: care || null,
        origin: origin || null,
        colors: colors || [],
        sizes: sizes || [],
        features: features || [],
        rating: rating ? parseFloat(rating) : null,
        reviews: reviews ? parseInt(reviews) : null,
        featured: featured !== undefined ? featured : false,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

