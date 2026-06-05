import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
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
      <input
        ref={ref}
        className={cn(
          'w-full border rounded-btn px-4 py-2.5 text-sm bg-white',
          'placeholder:text-gray-400 transition-shadow',
          'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent',
          error
            ? 'border-red-300 focus:ring-red-300'
            : 'border-gray-200',
          className,
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'

export default Input
