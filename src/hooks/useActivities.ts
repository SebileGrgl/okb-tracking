import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { Activity } from '../types'

export function useActivities() {
  return useQuery({
    queryKey: queryKeys.activities(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('usage_count', { ascending: false })
      if (error) throw error
      return data as Activity[]
    },
  })
}

export function useCreateActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { label: string; icon?: string }) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('activities')
        .insert({ ...input, user_id: userId, usage_count: 0 })
        .select()
        .single()
      if (error) throw error
      return data as Activity
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activities() }),
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('activities').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activities() }),
  })
}

export function useLogActivityUsage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (activity: Activity) => {
      const { data, error } = await supabase
        .from('activities')
        .update({ usage_count: activity.usage_count + 1 })
        .eq('id', activity.id)
        .select()
        .single()
      if (error) throw error
      return data as Activity
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activities() }),
  })
}
