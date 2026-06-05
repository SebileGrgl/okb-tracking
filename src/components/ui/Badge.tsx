import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-brand-50 text-brand-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-600',
  info:    'bg-blue-50 text-blue-600',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-chip', variants[variant], className)}>
      {children}
    </span>
  )
}
