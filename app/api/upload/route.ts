import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Image configuration
// Set to true to use external image server, false for local storage
const USE_EXTERNAL_IMAGE_SERVER = false

// External image server settings (when USE_EXTERNAL_IMAGE_SERVER = true)
const IMAGE_BASE_URL = 'https://image.futuredevsolutions.com/shahzad-fabrics'
const IMAGE_UPLOAD_PATH = '/var/www/public/shahzad-fabrics'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'sections' // Default to sections

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Validate folder name (security)
    const allowedFolders = ['sections', 'categories', 'products', 'store-info', 'owners']
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`

    // Determine upload directory based on configuration
    const uploadsDir = USE_EXTERNAL_IMAGE_SERVER
      ? join(IMAGE_UPLOAD_PATH, 'uploads', folder)
      : join(process.cwd(), 'public', 'uploads', folder)
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Return URL based on configuration
    const publicUrl = USE_EXTERNAL_IMAGE_SERVER
      ? `${IMAGE_BASE_URL}/uploads/${folder}/${filename}`
      : `/uploads/${folder}/${filename}`

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

