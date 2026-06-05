import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { EmergencyContact } from '../types'

export function useEmergencyContacts() {
  return useQuery({
    queryKey: queryKeys.contacts(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as EmergencyContact[]
    },
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { name: string; phone: string; relation?: string }) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({ ...input, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data as EmergencyContact
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.contacts() }),
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('emergency_contacts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.contacts() }),
  })
}
