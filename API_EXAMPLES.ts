// Quick API Examples - Copy & Paste Ready

// ===== CONTACT FORM API CALL =====
// src/app/contact/page.tsx (already implemented)

const handleContactSubmit = async (formData: ContactFormData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  
  if (response.ok) {
    console.log('Contact sent successfully')
  }
}

// ===== BOOKING API CALL =====
// src/app/book-consultation/page.tsx (already implemented)

const handleBookingSubmit = async (bookingData: BookingFormData) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  })
  
  if (response.ok) {
    const result = await response.json()
    console.log('Booking confirmed:', result.bookingId)
  }
}

// ===== DATABASE API EXAMPLE =====
// Create a new file: src/app/api/classes/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all classes
export async function GET() {
  const classes = await prisma.class.findMany()
  return NextResponse.json(classes)
}

// POST new class
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const newClass = await prisma.class.create({
    data: {
      name: body.name,
      description: body.description,
      time: body.time,
      capacity: body.capacity
    }
  })
  
  return NextResponse.json(newClass, { status: 201 })
}

// ===== FETCH API DATA IN COMPONENT =====
// Example: Fetch classes on page load

'use client'

import { useEffect, useState } from 'react'

export function ClassList() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchClasses = async () => {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
      setLoading(false)
    }
    
    fetchClasses()
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {classes.map((cls) => (
        <div key={cls.id}>
          <h3>{cls.name}</h3>
          <p>{cls.description}</p>
        </div>
      ))}
    </div>
  )
}

// ===== EMAIL API EXAMPLE =====
// Create: src/app/api/send-email/route.ts

import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
  const { email, subject, message } = await request.json()
  
  try {
    await sgMail.send({
      to: email,
      from: 'noreply@harrys.je',
      subject: subject,
      html: message
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// ===== PAYMENT API EXAMPLE =====
// Create: src/app/api/create-checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { priceId, email } = await request.json()
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancelled`,
      customer_email: email
    })
    
    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}

// ===== USING THE PAYMENT API =====
// In your component:

const handleCheckout = async () => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: 'price_1234567890',
      email: userEmail
    })
  })
  
  const { url } = await response.json()
  window.location.href = url // Redirect to Stripe checkout
}

// ===== DYNAMIC ROUTES EXAMPLE =====
// Create: src/app/results/[id]/page.tsx

export default function ResultDetail({ params }: { params: { id: string } }) {
  return <div>Result {params.id}</div>
}

// ===== FETCHING FROM EXTERNAL API =====
// In any API route:

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://external-api.com/data')
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}

// ===== ERROR HANDLING PATTERN =====

export async function POST(request: NextRequest) {
  try {
    // Validate
    const body = await request.json()
    
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Process
    const result = await processData(body)
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ===== AUTHENTICATION EXAMPLE =====
// Create: src/app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Find user in database
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
  
  // Create token/session
  const token = generateJWT(user)
  
  return NextResponse.json({ token, user })
}

// ===== FILE UPLOAD EXAMPLE =====
// Create: src/app/api/upload/route.ts

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // Upload to S3, Cloudinary, etc.
  const uploadedUrl = await uploadToCloud(file)
  
  return NextResponse.json({ url: uploadedUrl })
}

// Use in component:
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const { url } = await response.json()
  console.log('File uploaded to:', url)
}
