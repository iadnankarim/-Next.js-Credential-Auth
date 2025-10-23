# Environment Setup Guide

To fix the 401 authentication error, you need to set up the following environment variables:

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database URL (required for Better Auth)
DATABASE_URL="postgresql://username:password@localhost:5432/nextauth"

# Better Auth Secret (required)
BETTER_AUTH_SECRET="your_secret_key_here"

# Better Auth URL (required)
BETTER_AUTH_URL="http://localhost:3000"

# Arcjet Key (optional - only needed for signup protection)
ARCJET_KEY="your_arcjet_key_here"
```

## Setup Instructions

1. **Database Setup:**

   - Make sure you have PostgreSQL running
   - Update the `DATABASE_URL` with your actual database credentials
   - Run `npx prisma db push` to create the database tables

2. **Better Auth Secret:**

   - Generate a random secret key (you can use: `openssl rand -base64 32`)
   - Replace `your_secret_key_here` with your generated secret

3. **Arcjet (Optional):**
   - Only needed if you want signup protection
   - Get your key from https://app.arcjet.com
   - If you don't have an Arcjet key, the authentication will work without it

## Quick Fix for Development

If you just want to test the authentication without setting up a database, you can temporarily modify the auth configuration to use a different adapter or disable database requirements.

The main issue was that the authentication route was applying signup protection to sign-in requests, which has been fixed.
