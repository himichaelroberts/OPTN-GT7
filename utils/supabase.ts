import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const getSupabase = (userId?: string) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SIGNING_SECRET) {
    throw new Error('Supabase config not found')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  if (userId) {
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }

    // @ts-ignore
    supabase.auth.session = () => ({
      // @ts-ignore
      access_token: jwt.sign(payload, process.env.SUPABASE_SIGNING_SECRET),
    })
  }

  return supabase
}

export { getSupabase }
