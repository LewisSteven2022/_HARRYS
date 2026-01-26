# Complete Project Setup Guide - Harry's PT

A comprehensive guide to set up this Next.js personal training booking application from scratch.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Initialization](#2-project-initialization)
3. [External Services Setup](#3-external-services-setup)
4. [Environment Configuration](#4-environment-configuration)
5. [Database Setup](#5-database-setup)
6. [Running the Application](#6-running-the-application)
7. [Project Structure](#7-project-structure)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

### Install Node.js

Download and install Node.js (v18 or higher):
- **macOS**: `brew install node` or download from https://nodejs.org
- **Windows**: Download from https://nodejs.org
- **Linux**: `sudo apt install nodejs npm` or use nvm

Verify installation:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

### Install Git

```bash
# macOS
brew install git

# Windows
# Download from https://git-scm.com

# Linux
sudo apt install git
```

---

## 2. Project Initialization

### Clone or Create Project

```bash
# If cloning existing repo
git clone <repository-url>
cd harrys

# If starting fresh
npx create-next-app@latest harrys --typescript --tailwind --eslint --app --src-dir
cd harrys
```

### Install Dependencies

```bash
npm install
```

### Key Dependencies

This project uses:

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.4 | React framework with App Router |
| `react` | 19.2.3 | UI library |
| `typescript` | ^5 | Type safety |
| `tailwindcss` | ^4 | CSS styling |
| `@prisma/client` | ^7.3.0 | Database ORM |
| `@supabase/supabase-js` | ^2.91.1 | Authentication |
| `@supabase/ssr` | ^0.8.0 | Server-side Supabase client |
| `zustand` | ^5.0.10 | State management (basket) |

### Install Additional Dependencies (if starting fresh)

```bash
# Prisma ORM
npm install prisma @prisma/client @prisma/adapter-pg

# Supabase Auth
npm install @supabase/supabase-js @supabase/ssr

# State management
npm install zustand

# Dev dependencies
npm install -D tsx
```

---

## 3. External Services Setup

### 3.1 Supabase (Database & Authentication)

1. Go to https://supabase.com and create an account
2. Create a new project
3. Note down these values from Project Settings → API:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: `eyJhbG...`
4. Note down the database connection string from Project Settings → Database:
   - **Connection String**: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

#### Configure Supabase Auth

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000` (development) or your production URL
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

### 3.2 SumUp (Payment Processing)

1. Create a SumUp developer account at https://developer.sumup.com
2. Create an application to get:
   - **Merchant Code**: Found in your SumUp profile
   - **API Key**: Generate in the developer portal

---

## 4. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# ===================
# Supabase Configuration
# ===================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database connection (from Supabase Dashboard → Settings → Database)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# ===================
# SumUp Payment
# ===================
SUMUP_MERCHANT_CODE=your-merchant-code
SUMUP_API_KEY=sup_sk_your-api-key

# ===================
# Application
# ===================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Database Setup

### 5.1 Initialize Prisma

If starting fresh:
```bash
npx prisma init
```

### 5.2 Push Schema to Database

Push the Prisma schema to create tables:

```bash
npx prisma db push
```

This creates the following tables:
- `User` - User accounts (synced with Supabase Auth)
- `SessionType` - Workout types (Power Play, Lift and Shift)
- `Session` - Individual time slots
- `Order` - Payment/order tracking
- `Booking` - Session bookings
- `SiteConfig` - Site configuration

### 5.3 Seed the Database

Populate initial data (session types, time slots, etc.):

```bash
npm run db:seed
```

### 5.4 Sync Supabase Auth Users with Prisma

**Critical Step**: Supabase Auth creates users in its internal `auth.users` table, but our app needs them in the Prisma `User` table for foreign key relationships.

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Function to sync auth.users to public.User
-- This trigger automatically creates a corresponding public.User record
-- whenever a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users that don't have a public.User record
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
SELECT
  au.id::text,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', ''),
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public."User" pu ON au.id::text = pu.id
WHERE pu.id IS NULL;
```

**Verify it worked:**
```sql
SELECT * FROM public."User";
```

### 5.5 Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Running the Application

### Development Mode

```bash
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint |
| `db:seed` | `npx tsx prisma/seed.ts` | Seed database with initial data |

---

## 7. Project Structure

```
harrys/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
├── supabase/
│   └── migrations/          # SQL migrations for Supabase
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── account/         # User account page
│   │   ├── api/             # API routes
│   │   │   ├── bookings/    # Booking endpoints
│   │   │   ├── checkout/    # Checkout endpoint
│   │   │   ├── contact/     # Contact form
│   │   │   ├── orders/      # Order lookup
│   │   │   └── webhooks/    # SumUp webhooks
│   │   ├── auth/            # Auth callback
│   │   ├── checkout/        # Checkout pages
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── timetable/       # Session timetable
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── BasketDrawer.tsx # Shopping basket
│   │   ├── BasketIcon.tsx   # Basket icon with count
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Navigation.tsx   # Main navigation
│   │   └── SessionCard.tsx  # Session display card
│   ├── lib/                 # Utilities and clients
│   │   ├── auth.ts          # Auth wrapper functions
│   │   ├── prisma.ts        # Prisma client
│   │   ├── sumup.ts         # SumUp API client
│   │   └── supabase/        # Supabase clients
│   ├── store/               # State management
│   │   └── basket.ts        # Zustand basket store
│   └── styles/
│       └── globals.css      # Global styles
├── .env                     # Environment variables (not committed)
├── .env.example             # Environment template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/lib/prisma.ts` | Singleton Prisma client with connection pooling |
| `src/lib/auth.ts` | `withAuth` and `withOptionalAuth` wrappers for API routes |
| `src/lib/supabase/server.ts` | Server-side Supabase client (for API routes) |
| `src/lib/supabase/client.ts` | Client-side Supabase client (for React components) |
| `src/store/basket.ts` | Zustand store for shopping basket state |

---

## 8. Troubleshooting

### Turbopack Cache Corruption

**Symptoms:**
```
Failed to restore task data (corrupted database or bug)
Unable to open static sorted file 00000002.sst
```

**Fix:**
```bash
rm -rf .next node_modules/.cache && npm run dev
```

### Foreign Key Constraint Error on Checkout

**Symptoms:**
```
Foreign key constraint violated on the constraint: `Order_userId_fkey`
```

**Cause:** Supabase Auth user doesn't have a corresponding Prisma `User` record.

**Fix:** Run the SQL migration in section 5.4 to create the trigger and backfill existing users.

### Type Mismatch Errors (UUID vs Text)

**Symptoms:**
```
operator does not exist: uuid = text
```

**Cause:** Supabase uses UUID for user IDs, Prisma stores as TEXT.

**Fix:** Ensure SQL uses `::text` casts (see section 5.4).

### Supabase Connection Issues

**Symptoms:**
```
Authentication not configured
```

**Fix:** Verify `.env` has correct values:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Restart the dev server after changing `.env`:
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### Prisma Client Not Generated

**Symptoms:**
```
Cannot find module '@prisma/client'
```

**Fix:**
```bash
npx prisma generate
```

### Database Connection Refused

**Symptoms:**
```
Can't reach database server
```

**Fix:**
1. Check `DATABASE_URL` in `.env`
2. Ensure Supabase project is running
3. Check if IP is allowed in Supabase → Settings → Database → Connection Pooling

---

## Quick Start Summary

```bash
# 1. Clone and install
git clone <repo-url> && cd harrys
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase and SumUp credentials

# 3. Set up database
npx prisma db push
npm run db:seed

# 4. Run Supabase user sync SQL (see section 5.4)
# Go to Supabase Dashboard → SQL Editor → Run the trigger SQL

# 5. Start development
npm run dev
```

Open http://localhost:3000 and you're ready to go!
