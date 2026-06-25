import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    children: React.ReactNode
}

const variantStyles = {
    default:
        'bg-secondary-800 text-secondary-200 border-secondary-700 border-2',
    primary:
        'bg-primary-400/20 text-primary-300 border-primary-400/30 border-2',
    success: 'bg-green-900/30 text-green-400 border-green-700 border-2',
    warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-700 border-2',
    danger: 'bg-red-900/30 text-red-400 border-red-700 border-2',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'default', children, className = '', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={`inline-flex items-center px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase ${variantStyles[variant]} ${className}`.trim()}
                {...props}
            >
                {children}
            </span>
        )
    }
)

Badge.displayName = 'Badge'
export default Badge
