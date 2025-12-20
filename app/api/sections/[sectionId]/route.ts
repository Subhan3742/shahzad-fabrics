import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sectionId } = await params
    const body = await request.json()
    const { action } = body

    if (action === 'update') {
      const { type, title, description, image, items } = body

      if (!type || !title || !image) {
        return NextResponse.json(
          { error: 'Missing required fields: type, title, image' },
          { status: 400 }
        )
      }

      if (type !== 'ladies' && type !== 'gents') {
        return NextResponse.json(
          { error: 'Type must be "ladies" or "gents"' },
          { status: 400 }
        )
      }

      // Check if another section with this type exists (excluding current)
      const existing = await prisma.section.findUnique({
        where: { type },
      })

      if (existing && existing.id !== parseInt(sectionId)) {
        return NextResponse.json(
          { error: `Section with type "${type}" already exists` },
          { status: 400 }
        )
      }

      const section = await prisma.section.update({
        where: { id: parseInt(sectionId) },
        data: {
          type,
          title,
          description: description || null,
          image,
          items: items || [],
        },
      })

      return NextResponse.json(section, { status: 200 })
    }

    if (action === 'delete') {
      // Soft delete
      await prisma.section.update({
        where: { id: parseInt(sectionId) },
        data: { active: false },
      })

      return NextResponse.json({ message: 'Section deleted successfully' }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in section API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

