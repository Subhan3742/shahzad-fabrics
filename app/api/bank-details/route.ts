import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Get bank details
export async function GET() {
  try {
    // Check if bankDetails model exists
    if (!('bankDetails' in prisma)) {
      // Return default values if model doesn't exist (Prisma client not regenerated)
      return NextResponse.json({
        bankName: "Habib Bank Limited",
        accountNumber: "1234-5678-9012-3456",
        accountTitle: "Shahzad Fabrics",
        iban: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
        contactPhone: "0323 9348438",
      }, { status: 200 })
    }

    const bankDetails = await prisma.bankDetails.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    })

    if (!bankDetails) {
      // Return default values if no bank details exist
      return NextResponse.json({
        bankName: "Habib Bank Limited",
        accountNumber: "1234-5678-9012-3456",
        accountTitle: "Shahzad Fabrics",
        iban: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
        contactPhone: "0323 9348438",
      }, { status: 200 })
    }

    return NextResponse.json(bankDetails, { status: 200 })
  } catch (error) {
    console.error('Error fetching bank details:', error)
    // Return default values on error
    return NextResponse.json({
      bankName: "Habib Bank Limited",
      accountNumber: "1234-5678-9012-3456",
      accountTitle: "Shahzad Fabrics",
      iban: "",
      swiftCode: "",
      branchName: "",
      branchAddress: "",
      contactPhone: "0323 9348438",
    }, { status: 200 })
  }
}

// Create or update bank details
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
      bankName,
      accountNumber,
      accountTitle,
      iban,
      swiftCode,
      branchName,
      branchAddress,
      contactPhone,
    } = body

    // Validation
    if (!bankName || !accountNumber || !accountTitle) {
      return NextResponse.json(
        { error: 'Bank name, account number, and account title are required' },
        { status: 400 }
      )
    }

    // Check if bankDetails model exists
    if (!('bankDetails' in prisma)) {
      return NextResponse.json(
        { error: 'Bank details model not available. Please run: npm run db:push && npm run db:generate' },
        { status: 503 }
      )
    }

    // Check if bank details already exist
    const existing = await prisma.bankDetails.findFirst({
      where: { active: true },
    })

    let bankDetails
    if (existing) {
      // Update existing
      bankDetails = await prisma.bankDetails.update({
        where: { id: existing.id },
        data: {
          bankName,
          accountNumber,
          accountTitle,
          iban: iban || null,
          swiftCode: swiftCode || null,
          branchName: branchName || null,
          branchAddress: branchAddress || null,
          contactPhone: contactPhone || null,
        },
      })
    } else {
      // Create new
      bankDetails = await prisma.bankDetails.create({
        data: {
          bankName,
          accountNumber,
          accountTitle,
          iban: iban || null,
          swiftCode: swiftCode || null,
          branchName: branchName || null,
          branchAddress: branchAddress || null,
          contactPhone: contactPhone || null,
        },
      })
    }

    return NextResponse.json(bankDetails, { status: 200 })
  } catch (error) {
    console.error('Error saving bank details:', error)
    return NextResponse.json(
      { error: 'Failed to save bank details' },
      { status: 500 }
    )
  }
}

