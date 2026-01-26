import { createAdminClient, isAdminConfigured } from './supabase/admin'
import { prisma } from './prisma'

/**
 * Creates a Supabase Auth account for a guest checkout.
 * - Generates a temporary password
 * - Creates the auth user with email auto-confirmed
 * - Sends a password reset email so they can set their own password
 * - Returns the user data
 */
export async function createGuestAccount(
  email: string,
  name: string,
  phone?: string | null
): Promise<{ userId: string; isNew: boolean } | null> {
  // Check if admin client is available
  if (!isAdminConfigured()) {
    console.warn('Admin client not configured, skipping guest account creation')
    return null
  }

  try {
    const supabase = createAdminClient()

    // Check if user already exists in Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u) => u.email === email)

    if (existingUser) {
      // User already has an account
      return { userId: existingUser.id, isNew: false }
    }

    // Parse name into firstName/lastName
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Generate a secure temporary password
    const tempPassword = crypto.randomUUID() + crypto.randomUUID()

    // Create Supabase auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm since they already provided their email during checkout
      user_metadata: {
        firstName,
        lastName,
        phone: phone || null,
      },
    })

    if (error) {
      console.error('Failed to create guest account:', error)
      return null
    }

    if (!data.user) {
      console.error('No user returned from createUser')
      return null
    }

    // Send password reset email so they can set their own password
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${appUrl}/auth/reset-password`,
      },
    })

    if (resetError) {
      console.error('Failed to generate password reset link:', resetError)
      // Don't fail the whole operation, user can still use "forgot password" later
    }

    console.log(`Created guest account for ${email}`)

    return { userId: data.user.id, isNew: true }
  } catch (error) {
    console.error('Error creating guest account:', error)
    return null
  }
}

/**
 * Links an existing order to a user account.
 * Called after creating a guest account or when a guest later creates an account.
 */
export async function linkOrderToUser(
  orderId: string,
  userId: string
): Promise<boolean> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        userId,
        guestEmail: null,
        guestName: null,
      },
    })
    return true
  } catch (error) {
    console.error('Failed to link order to user:', error)
    return false
  }
}
