import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm',
  secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200',
  ghost:     'bg-transparent hover:bg-surface-tertiary text-gray-600',
  danger:    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-btn',
  md: 'px-4 py-2.5 text-sm rounded-btn',
  lg: 'px-6 py-3 text-sm rounded-btn',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

export default Button
