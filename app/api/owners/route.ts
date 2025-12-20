import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Get all owners
export async function GET() {
  try {
    // Check if owner model exists
    if (!('owner' in prisma)) {
      // Return default values if model doesn't exist
      return NextResponse.json([
        {
          id: 1,
          name: "Owner 1",
          image: "/owner1.jpeg",
          description: "Founder and Managing Director of Shahzad Fabrics. With decades of experience in the textile industry, he brings expertise in premium fabric selection and customer relations.",
          order: 0,
        },
        {
          id: 2,
          name: "Owner 2",
          image: "/owner2.jpeg",
          description: "Co-founder and Operations Director. Specializing in quality control and maintaining relationships with fabric suppliers, ensuring only the finest materials reach our customers.",
          order: 1,
        },
        {
          id: 3,
          name: "Owner 3",
          image: "/owner3.jpeg",
          description: "Co-founder and Business Development Director. Focused on expanding our collection and bringing the latest trends in fabrics to our valued customers in Lahore.",
          order: 2,
        },
      ], { status: 200 })
    }

    const owners = await prisma.owner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(owners, { status: 200 })
  } catch (error) {
    console.error('Error fetching owners:', error)
    // Return default values on error
    return NextResponse.json([
      {
        id: 1,
        name: "Owner 1",
        image: "/owner1.jpeg",
        description: "Founder and Managing Director of Shahzad Fabrics. With decades of experience in the textile industry, he brings expertise in premium fabric selection and customer relations.",
        order: 0,
      },
    ], { status: 200 })
  }
}

// Create owner
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, name, image, description, order, ownerId } = body

    // Check if owner model exists
    if (!('owner' in prisma)) {
      return NextResponse.json(
        { error: 'Owner model not available. Please run: npm run db:push && npm run db:generate' },
        { status: 503 }
      )
    }

    if (action === 'create') {
      // Validation
      if (!name) {
        return NextResponse.json(
          { error: 'Owner name is required' },
          { status: 400 }
        )
      }

      // Get max order to add new owner at the end
      const maxOrderOwner = await prisma.owner.findFirst({
        where: { active: true },
        orderBy: { order: 'desc' },
      })
      const newOrder = maxOrderOwner ? maxOrderOwner.order + 1 : 0

      const owner = await prisma.owner.create({
        data: {
          name,
          image: image || null,
          description: description || null,
          order: order !== undefined ? order : newOrder,
        },
      })

      return NextResponse.json(owner, { status: 201 })
    } else if (action === 'update' && ownerId) {
      // Update owner
      if (!name) {
        return NextResponse.json(
          { error: 'Owner name is required' },
          { status: 400 }
        )
      }

      const owner = await prisma.owner.update({
        where: { id: parseInt(ownerId) },
        data: {
          name,
          image: image || null,
          description: description || null,
          order: order !== undefined ? order : undefined,
        },
      })

      return NextResponse.json(owner, { status: 200 })
    } else if (action === 'delete' && ownerId) {
      // Soft delete
      await prisma.owner.update({
        where: { id: parseInt(ownerId) },
        data: { active: false },
      })

      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing ownerId' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing owners:', error)
    return NextResponse.json(
      { error: 'Failed to manage owners' },
      { status: 500 }
    )
  }
}

