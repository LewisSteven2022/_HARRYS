'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect to account after a short delay
    setTimeout(() => {
      router.push('/account')
    }, 2000)
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2">
            <div className="triple-lines">
              <span></span>
            </div>
            <h1 className="font-display text-5xl text-white tracking-wide">
              SET PASSWORD
            </h1>
          </div>
          <p className="text-gray-400">
            Create a password for your account
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-8">
          {success ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 mx-auto text-lime mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-xl text-white font-medium mb-2">
                Password Set Successfully!
              </h2>
              <p className="text-gray-400 mb-4">
                Redirecting you to your account...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-lime text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting password...' : 'Set Password'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 mt-8">
          <Link href="/login" className="text-lime hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
