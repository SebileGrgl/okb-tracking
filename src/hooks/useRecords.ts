import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { NewRecordInput, OKBRecord } from '../types'

export function useRecords() {
  return useQuery({
    queryKey: queryKeys.records(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300)
      if (error) throw error
      return data as OKBRecord[]
    },
  })
}

export function useAddRecord() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewRecordInput) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('records')
        .insert({ ...input, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data as OKBRecord
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.records() }),
  })
}

export function useDeleteRecord() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('records').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.records() }),
  })
}
