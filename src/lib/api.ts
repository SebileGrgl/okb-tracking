import { supabase } from './supabase'

/**
 * Returns the authenticated user's ID, or throws if not logged in.
 *
 * Extracted because `supabase.auth.getUser()` was duplicated across
 * every mutation hook (8+ places). A single helper is easier to audit,
 * mock in tests, and avoids the double-destructure boilerplate.
 */
export async function requireUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}
