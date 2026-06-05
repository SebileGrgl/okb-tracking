import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { requireUserId } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { Checklist, ChecklistCompletion, ChecklistItem } from '../types'

/* ── Queries ── */

export function useChecklists() {
  return useQuery({
    queryKey: queryKeys.checklists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Checklist[]
    },
  })
}

export function useChecklistItems(checklistId: string) {
  return useQuery({
    queryKey: queryKeys.checklistItems(checklistId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('position')
      if (error) throw error
      return data as ChecklistItem[]
    },
  })
}

export function useChecklistCompletions(checklistId: string) {
  return useQuery({
    queryKey: queryKeys.checklistCompletions(checklistId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklist_completions')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('completed_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return data as ChecklistCompletion[]
    },
  })
}

/* ── Mutations ── */

export function useCreateChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('checklists')
        .insert({ title, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data as Checklist
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.checklists() }),
  })
}

export function useDeleteChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('checklists').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.checklists() }),
  })
}

export function useAddChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { checklistId: string; label: string; position: number }) => {
      const { data, error } = await supabase
        .from('checklist_items')
        .insert({ checklist_id: input.checklistId, label: input.label, position: input.position })
        .select()
        .single()
      if (error) throw error
      return data as ChecklistItem
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.checklistItems(vars.checklistId) })
    },
  })
}

export function useDeleteChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; checklistId: string }) => {
      const { error } = await supabase.from('checklist_items').delete().eq('id', input.id)
      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.checklistItems(vars.checklistId) })
    },
  })
}

export function useCompleteChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      checklistId: string
      itemsCompleted: number
      itemsTotal: number
    }) => {
      const userId = await requireUserId()
      const { data, error } = await supabase
        .from('checklist_completions')
        .insert({
          checklist_id: input.checklistId,
          user_id: userId,
          items_completed: input.itemsCompleted,
          items_total: input.itemsTotal,
        })
        .select()
        .single()
      if (error) throw error
      return data as ChecklistCompletion
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.checklistCompletions(vars.checklistId) })
    },
  })
}
