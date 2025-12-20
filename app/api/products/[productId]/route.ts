import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET product by ID
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const id = parseInt(productId)

    // Check if this is an update request (has update fields in body)
    if (body.name || body.price || body.active !== undefined || body.featured !== undefined) {
      // This is an update request
      console.log(`Updating product ${id} with data:`, body)
      
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      
      console.log(`Current featured status: ${existingProduct.featured}, New featured status: ${body.featured}`)

      // If body contains active: false, it's a soft delete
      if (body.active === false) {
        const updated = await prisma.product.update({
          where: { id },
          data: { active: false },
        })
        return NextResponse.json(updated, { status: 200 })
      }

      // Otherwise, update the product
      const updateData: any = {}
      if (body.name !== undefined) updateData.name = body.name
      if (body.description !== undefined) updateData.description = body.description
      if (body.fullDescription !== undefined) updateData.fullDescription = body.fullDescription
      if (body.price !== undefined) updateData.price = body.price
      if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice
      if (body.image !== undefined) updateData.image = body.image
      if (body.images !== undefined) updateData.images = body.images
      if (body.categoryId !== undefined) updateData.categoryId = parseInt(body.categoryId)
      if (body.type !== undefined) {
        if (body.type !== 'ladies' && body.type !== 'gents') {
          return NextResponse.json(
            { error: 'Type must be "ladies" or "gents"' },
            { status: 400 }
          )
        }
        updateData.type = body.type
      }
      if (body.inStock !== undefined) updateData.inStock = body.inStock
      if (body.stockQuantity !== undefined) updateData.stockQuantity = parseInt(body.stockQuantity) || null
      if (body.material !== undefined) updateData.material = body.material
      if (body.width !== undefined) updateData.width = body.width
      if (body.weight !== undefined) updateData.weight = body.weight
      if (body.care !== undefined) updateData.care = body.care
      if (body.origin !== undefined) updateData.origin = body.origin
      if (body.colors !== undefined) updateData.colors = body.colors
      if (body.sizes !== undefined) updateData.sizes = body.sizes
      if (body.features !== undefined) updateData.features = body.features
      if (body.rating !== undefined) updateData.rating = body.rating ? parseFloat(body.rating) : null
      if (body.reviews !== undefined) updateData.reviews = body.reviews ? parseInt(body.reviews) : null
      if (body.featured !== undefined) updateData.featured = Boolean(body.featured)
      if (body.active !== undefined) updateData.active = body.active

      // Ensure updateData is not empty
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'No fields to update' },
          { status: 400 }
        )
      }

      console.log(`Update data:`, updateData)
      
      const updated = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      })

      console.log(`Product updated successfully. New featured status: ${updated.featured}`)

      // Format response to match frontend expectations
      const formattedProduct = {
        id: updated.id,
        name: updated.name,
        price: updated.price,
        originalPrice: updated.originalPrice || undefined,
        image: updated.image,
        images: updated.images || [],
        description: updated.description,
        fullDescription: updated.fullDescription || updated.description,
        category: updated.category.name,
        type: updated.type as 'ladies' | 'gents',
        inStock: updated.inStock,
        stockQuantity: updated.stockQuantity || undefined,
        featured: updated.featured || false,
        active: updated.active,
      }

      return NextResponse.json(formattedProduct, { status: 200 })
    }

    // This is a GET request (fetch product)
    const product = await prisma.product.findFirst({
      where: {
        id,
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
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Format the response to match frontend expectations
    const formattedProduct = {
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
    }

    return NextResponse.json(formattedProduct, { status: 200 })
  } catch (error) {
    console.error('Error with product:', error)
    return NextResponse.json(
      { error: 'Failed to process product request' },
      { status: 500 }
    )
  }
}

