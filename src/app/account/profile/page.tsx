'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Profile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/account/profile'
          return
        }
        throw new Error('Failed to fetch profile')
      }
      const data = await res.json()
      setProfile(data)
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
      setPhone(data.phone || '')
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone }),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await res.json()
      setProfile(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
              <div className="h-10 bg-gray-800 rounded"></div>
              <div className="h-10 bg-gray-800 rounded"></div>
              <div className="h-10 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="text-gray-400 hover:text-lime text-sm mb-4 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </Link>
          <div className="flex items-center mt-4">
            <div className="triple-lines">
              <span></span>
            </div>
            <h1 className="font-display text-4xl text-white tracking-wide">
              EDIT PROFILE
            </h1>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800 text-green-400">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-800 text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-400 text-sm mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-400 text-sm mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                placeholder="Enter your last name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-gray-400 text-sm mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-lime w-full text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
