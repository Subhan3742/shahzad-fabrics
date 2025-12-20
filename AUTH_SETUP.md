# Authentication Setup Guide

## Installation Steps

1. **Install Required Packages**
   ```bash
   npm install next-auth@beta bcryptjs @types/bcryptjs tsx
   ```

2. **Add Environment Variables**
   Add to your `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/shahzadcollection?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here" # Generate a random string
   NEXTAUTH_URL="http://localhost:3000" # Your app URL
   ```

   To generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

3. **Push Database Schema**
   ```bash
   npm run db:push
   ```

4. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

5. **Run Seed File to Create Default Admin User**
   ```bash
   npx tsx prisma/seed.ts
   ```

   Or add to package.json scripts:
   ```json
   "db:seed": "tsx prisma/seed.ts"
   ```

## Default Admin Credentials

After running the seed file:
- **Email:** admin@shahzadcollection.com
- **Password:** admin123

**Important:** Change the default password after first login!

## Features

- ✅ NextAuth authentication with credentials provider
- ✅ User model with email, name, password, and type (admin/employee)
- ✅ Login page at `/login`
- ✅ Protected dashboard routes (middleware)
- ✅ User management page (admin only)
- ✅ Create, edit, and delete users
- ✅ Password hashing with bcryptjs
- ✅ Soft delete for users (active flag)

## User Types

- **Admin:** Full access to all features including user management
- **Employee:** Access to dashboard but cannot manage users

## API Routes

- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `POST /api/users` - List or create users (admin only)
- `POST /api/users/[userId]` - Update or delete user (admin only)

## Pages

- `/login` - Login page
- `/dashboard/users` - User management (admin only)


