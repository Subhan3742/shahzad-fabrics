// This file contains auth helpers for credential verification
// Note: This file uses Node.js APIs (Prisma, bcryptjs) and should only be used in API routes

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function verifyCredentials(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.active) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

