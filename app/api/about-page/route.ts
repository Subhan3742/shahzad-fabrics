import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Get about page content
export async function GET() {
  try {
    // Check if aboutPage model exists
    if (!('aboutPage' in prisma)) {
      // Return default values if model doesn't exist
      return NextResponse.json({
        pageTitle: "About Shahzad Fabrics",
        pageSubtitle: "Since 1995, Shahzad Fabrics has been serving the people of Lahore with premium quality fabrics. Our commitment to excellence and customer satisfaction has made us a trusted name in the textile industry.",
        storyTitle: "Our Story",
        storyContent: "Established in 1995, Shahzad Fabrics Brand's Shop has been a cornerstone of Lahore's textile market for nearly three decades. What started as a small family business has grown into one of the most trusted fabric stores in the city, known for our extensive collection and exceptional service.\n\nLocated in the heart of Lahore at 26-Hajvery Center, Ichra Road, we have been serving customers with premium quality fabrics for both ladies and gents. Our collection includes everything from elegant lawn and chiffon for women to premium suiting and shirting for men.\n\nOur success is built on three pillars: quality, service, and trust. We carefully select each fabric in our collection, ensuring it meets our high standards. Our knowledgeable staff is always ready to help you find the perfect fabric for your needs, whether it's for everyday wear or a special occasion.",
        valuesTitle: "Our Values",
        value1Title: "Quality First",
        value1Content: "We source only the finest fabrics, ensuring every piece meets our high standards of quality and durability.",
        value2Title: "Customer Service",
        value2Content: "Our experienced staff is dedicated to helping you find exactly what you're looking for, with personalized attention and expert advice.",
        value3Title: "Trust & Integrity",
        value3Content: "For nearly 30 years, we've built our reputation on honesty, transparency, and building lasting relationships with our customers.",
      }, { status: 200 })
    }

    const aboutPage = await prisma.aboutPage.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    })

    if (!aboutPage) {
      // Return default values if no about page exists
      return NextResponse.json({
        pageTitle: "About Shahzad Fabrics",
        pageSubtitle: "Since 1995, Shahzad Fabrics has been serving the people of Lahore with premium quality fabrics. Our commitment to excellence and customer satisfaction has made us a trusted name in the textile industry.",
        storyTitle: "Our Story",
        storyContent: "Established in 1995, Shahzad Fabrics Brand's Shop has been a cornerstone of Lahore's textile market for nearly three decades. What started as a small family business has grown into one of the most trusted fabric stores in the city, known for our extensive collection and exceptional service.\n\nLocated in the heart of Lahore at 26-Hajvery Center, Ichra Road, we have been serving customers with premium quality fabrics for both ladies and gents. Our collection includes everything from elegant lawn and chiffon for women to premium suiting and shirting for men.\n\nOur success is built on three pillars: quality, service, and trust. We carefully select each fabric in our collection, ensuring it meets our high standards. Our knowledgeable staff is always ready to help you find the perfect fabric for your needs, whether it's for everyday wear or a special occasion.",
        valuesTitle: "Our Values",
        value1Title: "Quality First",
        value1Content: "We source only the finest fabrics, ensuring every piece meets our high standards of quality and durability.",
        value2Title: "Customer Service",
        value2Content: "Our experienced staff is dedicated to helping you find exactly what you're looking for, with personalized attention and expert advice.",
        value3Title: "Trust & Integrity",
        value3Content: "For nearly 30 years, we've built our reputation on honesty, transparency, and building lasting relationships with our customers.",
      }, { status: 200 })
    }

    return NextResponse.json(aboutPage, { status: 200 })
  } catch (error) {
    console.error('Error fetching about page:', error)
    // Return default values on error
    return NextResponse.json({
      pageTitle: "About Shahzad Fabrics",
      pageSubtitle: "Since 1995, Shahzad Fabrics has been serving the people of Lahore with premium quality fabrics. Our commitment to excellence and customer satisfaction has made us a trusted name in the textile industry.",
      storyTitle: "Our Story",
      storyContent: "Established in 1995, Shahzad Fabrics Brand's Shop has been a cornerstone of Lahore's textile market for nearly three decades. What started as a small family business has grown into one of the most trusted fabric stores in the city, known for our extensive collection and exceptional service.\n\nLocated in the heart of Lahore at 26-Hajvery Center, Ichra Road, we have been serving customers with premium quality fabrics for both ladies and gents. Our collection includes everything from elegant lawn and chiffon for women to premium suiting and shirting for men.\n\nOur success is built on three pillars: quality, service, and trust. We carefully select each fabric in our collection, ensuring it meets our high standards. Our knowledgeable staff is always ready to help you find the perfect fabric for your needs, whether it's for everyday wear or a special occasion.",
      valuesTitle: "Our Values",
      value1Title: "Quality First",
      value1Content: "We source only the finest fabrics, ensuring every piece meets our high standards of quality and durability.",
      value2Title: "Customer Service",
      value2Content: "Our experienced staff is dedicated to helping you find exactly what you're looking for, with personalized attention and expert advice.",
      value3Title: "Trust & Integrity",
      value3Content: "For nearly 30 years, we've built our reputation on honesty, transparency, and building lasting relationships with our customers.",
    }, { status: 200 })
  }
}

// Create or update about page content
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
      pageTitle,
      pageSubtitle,
      storyTitle,
      storyContent,
      valuesTitle,
      value1Title,
      value1Content,
      value2Title,
      value2Content,
      value3Title,
      value3Content,
    } = body

    // Validation
    if (!pageTitle || !storyTitle) {
      return NextResponse.json(
        { error: 'Page title and story title are required' },
        { status: 400 }
      )
    }

    // Check if aboutPage model exists
    if (!('aboutPage' in prisma)) {
      return NextResponse.json(
        { error: 'About page model not available. Please run: npm run db:push && npm run db:generate' },
        { status: 503 }
      )
    }

    // Check if about page already exists
    const existing = await prisma.aboutPage.findFirst({
      where: { active: true },
    })

    let aboutPage
    if (existing) {
      // Update existing
      aboutPage = await prisma.aboutPage.update({
        where: { id: existing.id },
        data: {
          pageTitle,
          pageSubtitle: pageSubtitle || null,
          storyTitle,
          storyContent: storyContent || null,
          valuesTitle: valuesTitle || null,
          value1Title: value1Title || null,
          value1Content: value1Content || null,
          value2Title: value2Title || null,
          value2Content: value2Content || null,
          value3Title: value3Title || null,
          value3Content: value3Content || null,
        },
      })
    } else {
      // Create new
      aboutPage = await prisma.aboutPage.create({
        data: {
          pageTitle,
          pageSubtitle: pageSubtitle || null,
          storyTitle,
          storyContent: storyContent || null,
          valuesTitle: valuesTitle || null,
          value1Title: value1Title || null,
          value1Content: value1Content || null,
          value2Title: value2Title || null,
          value2Content: value2Content || null,
          value3Title: value3Title || null,
          value3Content: value3Content || null,
        },
      })
    }

    return NextResponse.json(aboutPage, { status: 200 })
  } catch (error) {
    console.error('Error saving about page:', error)
    return NextResponse.json(
      { error: 'Failed to save about page' },
      { status: 500 }
    )
  }
}

