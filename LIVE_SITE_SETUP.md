# Live Site Environment Variables Setup

## Problem
NextAuth error: "There was a problem with the server configuration" on live site.

## Solution

On your live server, you need to ensure `.env.master` file has all the correct environment variables.

### Required Environment Variables for Live Site

Create or update `/var/www/public/shahzad-fabrics/.env.master` with:

```bash
# Database - Live Site
DATABASE_URL="postgresql://db_postgres:db_postgres@192.168.194.202:5440/shahzadcollection?schema=public"

# NextAuth Secret (IMPORTANT: Must match the one in your code)
NEXTAUTH_SECRET="565799d8f6f3475b"
AUTH_SECRET="565799d8f6f3475b"

# NextAuth URL - CRITICAL: Must be your actual live site URL
# Replace with your actual live site URL (e.g., https://yourdomain.com)
NEXTAUTH_URL="https://your-actual-live-site-url.com"

# Next.js
NEXT_PUBLIC_API_URL="https://your-actual-live-site-url.com"

# Docker/Deployment
ENV=production
PORT=3000
DOCKER_NAME=shahzad-fabrics
```

## Steps to Fix on Live Server

1. **SSH into your live server**

2. **Navigate to the project directory:**
   ```bash
   cd /var/www/public/shahzad-fabrics
   ```

3. **Edit the .env.master file:**
   ```bash
   nano .env.master
   # or
   vi .env.master
   ```

4. **Make sure these variables are set correctly:**
   - `NEXTAUTH_URL` - Must be your actual live site URL (NOT localhost)
   - `NEXTAUTH_SECRET` - Must match the secret in your code
   - `DATABASE_URL` - Must be the live database connection string

5. **After updating, rebuild and restart:**
   ```bash
   ./build.sh
   ```

## Common Issues

### Issue 1: NEXTAUTH_URL is set to localhost
**Symptom:** "There was a problem with the server configuration" error

**Fix:** Set `NEXTAUTH_URL` to your actual live site URL:
```bash
NEXTAUTH_URL="https://yourdomain.com"
```

### Issue 2: NEXTAUTH_SECRET is missing or different
**Symptom:** Authentication fails or sessions don't persist

**Fix:** Ensure `NEXTAUTH_SECRET` matches in both `.env.master` and your code:
```bash
NEXTAUTH_SECRET="565799d8f6f3475b"
```

### Issue 3: Environment variables not loading
**Symptom:** App works locally but fails on live site

**Fix:** 
1. Check that `.env.master` exists in `/var/www/public/shahzad-fabrics/`
2. Verify the build script copies it: `cp -rf /var/www/public/shahzad-fabrics/.env.master .env`
3. Restart the Docker containers after updating

## Verification

After setting up, verify the environment variables are loaded:

```bash
# Check if .env.master exists
ls -la /var/www/public/shahzad-fabrics/.env.master

# Check Docker container environment
docker exec ${DOCKER_NAME} env | grep NEXTAUTH
```

## Important Notes

- Never commit `.env.master` to git (it should be in `.gitignore`)
- The `NEXTAUTH_URL` must match exactly the URL where your site is accessible
- If using HTTPS, make sure `NEXTAUTH_URL` uses `https://` not `http://`
- After changing environment variables, always rebuild and restart the containers

