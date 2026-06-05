import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { UserProfile } from '../types'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: async () => {
      const userId = await requireUserId()

      // maybeSingle returns null (no error) when row doesn't exist
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

      // Profile row might not exist if trigger didn't fire — create it
      if (!data) {
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert({ id: userId, onboarding_completed: false })
          .select()
          .single()
        if (createError) throw createError
        return created as UserProfile
      }

      return data as UserProfile
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      return data as UserProfile
    },
    onSuccess: (data) => qc.setQueryData(queryKeys.profile(), data),
  })
}
