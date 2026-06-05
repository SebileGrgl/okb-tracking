export type TagType = 'trigger' | 'obsession' | 'compulsion'

export interface Tag {
  id: string
  user_id: string
  type: TagType
  label: string
  created_at: string
}

export interface OKBRecord {
  id: string
  user_id: string
  created_at: string
  anxiety_level: number | null
  obsession_note: string | null
  trigger_tag_ids: string[]
  obsession_tag_ids: string[]
  compulsion_tag_ids: string[]
}

export type NewRecordInput = Pick<
  OKBRecord,
  'anxiety_level' | 'obsession_note' | 'trigger_tag_ids' | 'obsession_tag_ids' | 'compulsion_tag_ids'
>

export interface CrisisLog {
  id: string
  user_id: string
  created_at: string
  resolved_at: string | null
  note: string | null
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  phone: string
  relation: string | null
  created_at: string
}

export interface Quote {
  id: string
  user_id: string
  text: string
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  label: string
  icon: string | null
  usage_count: number
  created_at: string
}

export interface Checklist {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  checklist_id: string
  label: string
  position: number
  created_at: string
}

export interface ChecklistCompletion {
  id: string
  checklist_id: string
  user_id: string
  completed_at: string
  items_completed: number
  items_total: number
}

export interface UserProfile {
  id: string
  display_name: string | null
  created_at: string
  onboarding_completed: boolean
}
