'use client'

import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) {
      router.push('/')
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-left text-gray-500 hover:text-red-400 text-sm transition-colors"
    >
      Sign out
    </button>
  )
}
