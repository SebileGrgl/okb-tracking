import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          'w-full border rounded-btn px-4 py-2.5 text-sm bg-white resize-none',
          'placeholder:text-gray-400 transition-shadow',
          'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent',
          error ? 'border-red-300' : 'border-gray-200',
          className,
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})
Textarea.displayName = 'Textarea'

export default Textarea
