/**
 * Centralized, type-safe query key factory.
 *
 * Using a factory instead of raw string arrays prevents typos, enables
 * type-safe invalidation, and makes "find all usages" trivial.
 */
export const queryKeys = {
  records:    () => ['records'] as const,
  tags:       (type?: string) => ['tags', type ?? 'all'] as const,
  crisisLogs: () => ['crisis_logs'] as const,
  profile:    () => ['profile'] as const,
  activities: () => ['activities'] as const,
  quotes:     () => ['quotes'] as const,
  contacts:   () => ['emergency_contacts'] as const,

  checklists:           () => ['checklists'] as const,
  checklistItems:       (id: string) => ['checklist_items', id] as const,
  checklistCompletions: (id: string) => ['checklist_completions', id] as const,
} as const
