interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-surface-tertiary flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {description && <p className="text-xs text-gray-400 max-w-[220px]">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
