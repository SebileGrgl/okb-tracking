import { format, isToday, isYesterday, parseISO, subDays } from 'date-fns'
import { tr } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Bugün'
  if (isYesterday(date)) return 'Dün'
  return format(date, 'd MMMM yyyy', { locale: tr })
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'HH:mm')
}

export function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return `Bugün, ${format(date, 'HH:mm')}`
  if (isYesterday(date)) return `Dün, ${format(date, 'HH:mm')}`
  return format(date, 'd MMM, HH:mm', { locale: tr })
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM', { locale: tr })
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  )
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
  )
}

export function toDateKey(dateStr: string): string {
  return dateStr.slice(0, 10)
}
