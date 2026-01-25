# Next.js Conversion Complete! 🚀

## What's Been Done

Your Harry's Personal Training site has been successfully converted from static HTML to a modern **Next.js** application with TypeScript support. This means you can now:

✅ Make dynamic API calls  
✅ Connect to databases  
✅ Handle form submissions with backend logic  
✅ Implement user authentication  
✅ Add payment processing  
✅ Set up real-time features  
✅ Deploy with serverless functions  

---

## Project Structure

```
harrys/
├── src/
│   ├── app/                          # App Router
│   │   ├── api/
│   │   │   ├── contact/route.ts      # POST /api/contact
│   │   │   └── bookings/route.ts     # POST /api/bookings
│   │   ├── page.tsx                  # Home page (/)
│   │   ├── training/page.tsx         # (/training)
│   │   ├── timetable/page.tsx        # (/timetable)
│   │   ├── results/page.tsx          # (/results)
│   │   ├── coach/page.tsx            # (/coach)
│   │   ├── contact/page.tsx          # (/contact)
│   │   ├── book-consultation/page.tsx# (/book-consultation)
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── Navigation.tsx            # Header with mobile menu
│   │   └── Footer.tsx                # Footer
│   └── styles/
│       └── globals.css               # Global styles & custom CSS
├── public/
│   ├── images/                       # Product images
│   ├── logo.png                      # Logo
│   └── ...
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind configuration
└── README.md                         # Documentation
```

---

## Running the Project

### Development Mode
```bash
npm run dev
```
Visit http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## API Endpoints Ready for Use

### 1. Contact Form
**Endpoint:** `POST /api/contact`

```javascript
// Example fetch
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    message: 'I want to book a session'
  })
})
```

**File:** `src/app/api/contact/route.ts`

### 2. Bookings
**Endpoint:** `POST /api/bookings`

```javascript
// Example fetch
fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    date: '2024-02-15',
    time: 'morning',
    hasInjuries: 'no',
    injuries: ''
  })
})
```

**File:** `src/app/api/bookings/route.ts`

---

## Next Steps - Integration Guide

### 1. **Set Up Environment Variables**
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=your_database_url
EMAIL_API_KEY=your_email_service_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. **Connect a Database**

#### Option A: PostgreSQL with Prisma
```bash
npm install @prisma/client prisma
npx prisma init
```

Create `prisma/schema.prisma`:
```prisma
model Booking {
  id        Int     @id @default(autoincrement())
  name      String
  email     String
  phone     String
  date      DateTime
  time      String
  createdAt DateTime @default(now())
}

model Contact {
  id        Int     @id @default(autoincrement())
  name      String
  email     String
  phone     String
  message   String
  createdAt DateTime @default(now())
}
```

Update API routes to use Prisma:
```typescript
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const booking = await prisma.booking.create({
    data: body
  })
  
  return NextResponse.json(booking)
}
```

#### Option B: Firebase
```bash
npm install firebase firebase-admin
```

### 3. **Add Email Service**

#### Using SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@harrys.je',
  subject: 'Booking Confirmation',
  html: '<h1>Your booking is confirmed</h1>'
})
```

#### Using Nodemailer
```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

await transporter.sendMail({
  to: 'user@example.com',
  subject: 'Booking Confirmation',
  html: '<h1>Your booking is confirmed</h1>'
})
```

### 4. **Add Payment Processing (Stripe)**

```bash
npm install stripe @stripe/react-js
```

Create `src/app/api/create-checkout/route.ts`:
```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { planId, email } = await request.json()
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: planId,
      quantity: 1
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancelled`,
    customer_email: email
  })
  
  return NextResponse.json({ url: session.url })
}
```

### 5. **Authentication (NextAuth.js)**

```bash
npm install next-auth
```

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Validate credentials against database
        const user = await db.user.findUnique({
          where: { email: credentials?.email }
        })
        return user
      }
    })
  ]
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 6. **Image Optimization**

Already configured with Next.js Image component! Use it instead of `<img>`:

```typescript
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={48} 
  height={48}
/>
```

### 7. **Deploy to Production**

#### Vercel (Recommended - Free)
```bash
npm install -g vercel
vercel
```

#### Railway
```bash
npm install -g railway
railway up
```

#### Docker & Traditional Server
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Form Implementation Examples

### Contact Form (Already Built)
Location: `src/app/contact/page.tsx`

Features:
- Client-side form validation
- Loading states
- Error handling
- Success feedback
- API call to `/api/contact`

### Booking Form (Already Built)
Location: `src/app/book-consultation/page.tsx`

Features:
- Conditional fields (injury details)
- Date/time selection
- Form validation
- API call to `/api/bookings`

---

## Customization Tips

### 1. **Change Colors**
Edit `src/styles/globals.css`:
```css
--lime: #c8ff00;
--lime-dark: #a3cc00;
--card-bg: #1a1a1a;
--body-bg: #0a0a0a;
```

### 2. **Add New Pages**
Create new file in `src/app/`:
```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>New page content</div>
}
```

### 3. **Add New API Endpoints**
```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Your logic here
  return NextResponse.json({ success: true })
}
```

### 4. **Update Metadata**
Edit `src/app/layout.tsx`:
```typescript
export const metadata = {
  title: "Your Title",
  description: "Your description"
}
```

---

## Useful Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Prisma ORM:** https://www.prisma.io/docs
- **SendGrid Email:** https://docs.sendgrid.com
- **Stripe Payments:** https://stripe.com/docs
- **NextAuth.js:** https://next-auth.js.org

---

## Deployment Checklist

Before deploying:
- [ ] Set environment variables on hosting platform
- [ ] Test all forms and API endpoints
- [ ] Add database migrations if using database
- [ ] Configure email service (if using)
- [ ] Set up SSL certificates
- [ ] Add analytics (Google Analytics, Mixpanel, etc.)
- [ ] Test mobile responsiveness
- [ ] Add favicon and meta tags
- [ ] Set up monitoring/error tracking (Sentry, LogRocket)
- [ ] Create `.env.production` with production values

---

## What Changed from Static HTML

| Feature | Before | After |
|---------|--------|-------|
| Form Handling | Client-side only | Server-side API routes |
| Database | Not possible | Fully supported |
| Authentication | Not possible | NextAuth.js ready |
| Real-time Data | Not possible | Supported |
| Backend Logic | Not possible | Full Node.js backend |
| Deployment | Static hosting only | Vercel, Railway, etc. |
| API Calls | Not available | Built-in routes |
| SEO | Basic | Advanced with metadata |

---

## Support & Questions

- Check the README.md for detailed documentation
- Review example API routes in `src/app/api/`
- Check Next.js documentation for advanced features
- All files are TypeScript for better type safety

---

**You're all set! Your site is now ready to power dynamic features and handle backend logic. Happy coding! 🎉**
