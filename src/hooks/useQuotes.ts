import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { Quote } from '../types'

export function useQuotes() {
  return useQuery({
    queryKey: queryKeys.quotes(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as Quote[]
    },
  })
}

export function useCreateQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (text: string) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('quotes')
        .insert({ text, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data as Quote
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quotes() }),
  })
}

export function useDeleteQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quotes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quotes() }),
  })
}

/**
 * Returns a random quote, stable across re-renders.
 *
 * Previously called Math.random() on every render, causing the
 * displayed quote to flicker whenever the component re-rendered.
 * Now memoized on the quotes array reference.
 */
export function useRandomQuote(): Quote | null {
  const { data } = useQuotes()
  return useMemo(() => {
    if (!data || data.length === 0) return null
    return data[Math.floor(Math.random() * data.length)]
  }, [data])
}
