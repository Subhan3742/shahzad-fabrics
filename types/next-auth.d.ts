import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      type: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    type: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    type: string
  }
}


