# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shahzadcollection?schema=public"

# NextAuth Secret (REQUIRED)
NEXTAUTH_SECRET="your-secret-key-here"
AUTH_SECRET="your-secret-key-here"

# NextAuth URL
NEXTAUTH_URL="http://localhost:3000"
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online tool: https://generate-secret.vercel.app/32

## Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate and add your secret:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as the value for `NEXTAUTH_SECRET` and `AUTH_SECRET` in `.env`

3. Update `DATABASE_URL` with your PostgreSQL credentials

4. Restart your dev server:
   ```bash
   npm run dev
   ```

## Important Notes

- Never commit `.env` file to git
- Use different secrets for development and production
- The secret should be at least 32 characters long


