import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { CrisisLog } from '../types'

export function useCrisisLogs() {
  return useQuery({
    queryKey: queryKeys.crisisLogs(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crisis_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error
      return data as CrisisLog[]
    },
  })
}

export function useLogCrisis() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (note?: string) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('crisis_logs')
        .insert({ user_id: userId, note: note ?? null })
        .select()
        .single()
      if (error) throw error
      return data as CrisisLog
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.crisisLogs() }),
  })
}

export function useResolveCrisis() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('crisis_logs')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CrisisLog
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.crisisLogs() }),
  })
}
