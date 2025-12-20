import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Get store info
export async function GET() {
  try {
    // Check if storeInfo model exists
    if (!('storeInfo' in prisma)) {
      // Return default values if model doesn't exist
      return NextResponse.json({
        title: "Visit Our Store in Lahore",
        description: "Experience the finest quality fabrics in person at our flagship store located in the heart of Lahore. Our expert staff is ready to help you find the perfect fabric for your needs.",
        image: "/shop-cover.jpeg",
        location: "26-Hajvery Center, Ichra Road, Lahore",
        contactPhone: "0323 9348438",
        email: "info@shahzadfabrics.com",
        storeHours: "Mon - Sat: 10:00 AM - 9:00 PM\nSunday: 11:00 AM - 7:00 PM",
        facebookUrl: "",
        instagramUrl: "",
        tiktokUrl: "",
      }, { status: 200 })
    }

    const storeInfo = await prisma.storeInfo.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    })

    if (!storeInfo) {
      // Return default values if no store info exists
      return NextResponse.json({
        title: "Visit Our Store in Lahore",
        description: "Experience the finest quality fabrics in person at our flagship store located in the heart of Lahore. Our expert staff is ready to help you find the perfect fabric for your needs.",
        image: "/shop-cover.jpeg",
        location: "26-Hajvery Center, Ichra Road, Lahore",
        contactPhone: "0323 9348438",
        email: "info@shahzadfabrics.com",
        storeHours: "Mon - Sat: 10:00 AM - 9:00 PM\nSunday: 11:00 AM - 7:00 PM",
        facebookUrl: "",
        instagramUrl: "",
        tiktokUrl: "",
      }, { status: 200 })
    }

    return NextResponse.json(storeInfo, { status: 200 })
  } catch (error) {
    console.error('Error fetching store info:', error)
    // Return default values on error
    return NextResponse.json({
      title: "Visit Our Store in Lahore",
      description: "Experience the finest quality fabrics in person at our flagship store located in the heart of Lahore. Our expert staff is ready to help you find the perfect fabric for your needs.",
      image: "/shop-cover.jpeg",
      location: "26-Hajvery Center, Ichra Road, Lahore",
      contactPhone: "0323 9348438",
      storeHours: "Mon - Sat: 10:00 AM - 9:00 PM\nSunday: 11:00 AM - 7:00 PM",
    }, { status: 200 })
  }
}

// Create or update store info
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
    const {
      title,
      description,
      image,
      location,
      contactPhone,
      email,
      storeHours,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
    } = body

    // Validation
    if (!title || !location || !contactPhone) {
      return NextResponse.json(
        { error: 'Title, location, and contact phone are required' },
        { status: 400 }
      )
    }

    // Check if storeInfo model exists
    if (!('storeInfo' in prisma)) {
      return NextResponse.json(
        { error: 'Store info model not available. Please run: npm run db:push && npm run db:generate' },
        { status: 503 }
      )
    }

    // Check if store info already exists
    const existing = await prisma.storeInfo.findFirst({
      where: { active: true },
    })

    let storeInfo
    if (existing) {
      // Update existing
      storeInfo = await prisma.storeInfo.update({
        where: { id: existing.id },
        data: {
          title,
          description: description || null,
          image: image || null,
          location,
          contactPhone,
          email: email || null,
          storeHours: storeHours || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          tiktokUrl: tiktokUrl || null,
        },
      })
    } else {
      // Create new
      storeInfo = await prisma.storeInfo.create({
        data: {
          title,
          description: description || null,
          image: image || null,
          location,
          contactPhone,
          email: email || null,
          storeHours: storeHours || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          tiktokUrl: tiktokUrl || null,
        },
      })
    }

    return NextResponse.json(storeInfo, { status: 200 })
  } catch (error) {
    console.error('Error saving store info:', error)
    return NextResponse.json(
      { error: 'Failed to save store info' },
      { status: 500 }
    )
  }
}

