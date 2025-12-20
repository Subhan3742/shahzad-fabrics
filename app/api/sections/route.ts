import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all sections
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'list') {
      const sections = await prisma.section.findMany({
        where: { active: true },
        orderBy: { type: 'asc' },
      })

      return NextResponse.json(sections, { status: 200 })
    }

    if (action === 'create') {
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

      // Check if section with this type already exists
      const existing = await prisma.section.findUnique({
        where: { type },
      })

      if (existing) {
        return NextResponse.json(
          { error: `Section with type "${type}" already exists` },
          { status: 400 }
        )
      }

      const section = await prisma.section.create({
        data: {
          type,
          title,
          description: description || null,
          image,
          items: items || [],
          active: true,
        },
      })

      return NextResponse.json(section, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in sections API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

