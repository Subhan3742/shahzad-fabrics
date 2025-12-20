import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret-change-in-production",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth: Missing email or password")
          return null
        }

        try {
          // Dynamic import to avoid Edge runtime issues - only loads in Node.js runtime (API routes)
          const bcrypt = (await import("bcryptjs")).default
          const { prisma } = await import("@/lib/prisma")

          const email = credentials.email as string
          console.log("Auth: Attempting login for email:", email)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.error("Auth: User not found with email:", email)
            return null
          }

          if (!user.active) {
            console.error("Auth: User is not active:", email)
            return null
          }

          console.log("Auth: User found, verifying password...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.error("Auth: Invalid password for email:", email)
            return null
          }

          console.log("Auth: Login successful for:", email)
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
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.type = user.type
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.type = token.type as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig

