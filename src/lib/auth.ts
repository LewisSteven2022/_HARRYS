import { NextRequest, NextResponse } from 'next/server'
import { createClient, isSupabaseConfigured } from './supabase/server'
import type { User } from '@supabase/supabase-js'

export type AuthenticatedHandler<P = Record<string, string>> = (
  request: NextRequest,
  context: { user: User; params: Promise<P> }
) => Promise<NextResponse> | NextResponse

interface WithAuthOptions {
  hasParams?: boolean
}

/**
 * Wraps an API route handler with authentication.
 * - Returns 401 JSON for API clients (Accept: application/json)
 * - Redirects to login for browser requests
 */
export function withAuth<P = Record<string, string>>(
  handler: AuthenticatedHandler<P>,
  options?: WithAuthOptions
) {
  return async (request: NextRequest, routeContext?: { params: Promise<P> }) => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      )
    }

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // Check if this is an API request (wants JSON) or browser navigation
      const acceptHeader = request.headers.get('accept') || ''
      const isApiRequest = acceptHeader.includes('application/json') ||
        request.headers.get('x-requested-with') === 'XMLHttpRequest'

      if (isApiRequest) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please sign in to continue' },
          { status: 401 }
        )
      }

      // Browser request - redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // User is authenticated - call the handler
    const params = routeContext?.params ?? Promise.resolve({} as P)
    return handler(request, { user, params })
  }
}

/**
 * Get the current user from a request (for routes that need optional auth)
 */
export async function getUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()
  if (!supabase) {
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type OptionalAuthHandler = (
  request: NextRequest,
  context: { user: User | null }
) => Promise<NextResponse> | NextResponse

/**
 * Wraps an API route handler with optional authentication.
 * - Provides user if authenticated, null otherwise
 * - Allows the handler to decide how to handle guests
 */
export function withOptionalAuth(handler: OptionalAuthHandler) {
  return async (request: NextRequest) => {
    const user = await getUser()
    return handler(request, { user })
  }
}
