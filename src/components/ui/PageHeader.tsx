import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  action?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, subtitle, back, action, className }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  )
}
