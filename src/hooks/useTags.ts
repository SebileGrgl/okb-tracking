import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { Tag, TagType } from '../types'

export function useTags(type?: TagType) {
  return useQuery({
    queryKey: queryKeys.tags(type),
    queryFn: async () => {
      let query = supabase.from('tags').select('*').order('label')
      if (type) query = query.eq('type', type)
      const { data, error } = await query
      if (error) throw error
      return data as Tag[]
    },
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { type: TagType; label: string }) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('tags')
        .insert({ ...input, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data as Tag
    },
    onSuccess: (tag) => {
      qc.invalidateQueries({ queryKey: queryKeys.tags(tag.type) })
      qc.invalidateQueries({ queryKey: queryKeys.tags() })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tags').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tags() }),
  })
}
