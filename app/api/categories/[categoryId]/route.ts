import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const body = await request.json()

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const id = parseInt(categoryId)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // If body contains active: false, it's a soft delete
    if (body.active === false) {
      const updated = await prisma.category.update({
        where: { id },
        data: { active: false },
      })
      return NextResponse.json(updated, { status: 200 })
    }

    // Otherwise, update the category
    const { name, description, image, type, items, active } = body

    if (type && type !== 'ladies' && type !== 'gents') {
      return NextResponse.json(
        { error: 'Type must be "ladies" or "gents"' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (type !== undefined) updateData.type = type
    if (items !== undefined) updateData.items = items
    if (active !== undefined) updateData.active = active

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

