import React, { useState, useCallback } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size'
> {
    variant?: 'default' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    surface?: 'dark' | 'light'
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    isRequired?: boolean
    isDisabled?: boolean
    isReadOnly?: boolean
}

const variantStyles = {
    dark: {
        default:
            'bg-background-800 text-white border-2 border-secondary-700 outline-none transition-colors duration-150 focus:border-primary-400',
        ghost: 'bg-transparent border-0 border-b-2 border-secondary-700 rounded-none transition-colors duration-150 px-0 py-2 focus:border-primary-400 focus:ring-0',
    },
    light: {
        default:
            'bg-secondary-50 text-background-900 border-2 border-secondary-300 outline-none transition-colors duration-150 focus:border-primary-600',
        ghost: 'bg-transparent border-0 border-b-2 border-secondary-300 rounded-none transition-colors duration-150 px-0 py-2 focus:border-primary-600 focus:ring-0',
    },
}

const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-6',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            variant = 'default',
            size = 'md',
            surface = 'dark',
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            isRequired = false,
            isDisabled = false,
            isReadOnly = false,
            type = 'text',
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === 'password'
        const inputType = isPassword && showPassword ? 'text' : type

        const togglePassword = useCallback(() => {
            setShowPassword((prev) => !prev)
        }, [])

        const generatedId = React.useId()
        const inputId = id || generatedId
        const errorId = `${inputId}-error`
        const helperId = `${inputId}-helper`

        const textColor =
            surface === 'light'
                ? 'text-background-900 placeholder:text-secondary-500'
                : 'text-word-100 placeholder:text-word-400'

        const focusBorder = error
            ? 'border-red-500 focus:border-red-500'
            : surface === 'light'
              ? 'focus:border-primary-600'
              : 'focus:border-primary-400'

        const inputClasses = [
            'w-full',
            textColor,
            'focus:outline-none',
            variantStyles[surface][variant],
            variant === 'default' ? sizeStyles[size] : '',
            focusBorder,
            isDisabled ? 'opacity-50 cursor-not-allowed' : '',
            leftIcon ? 'pl-10' : '',
            rightIcon || isPassword ? 'pr-10' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ')

        const labelColor =
            surface === 'light' ? 'text-secondary-600' : 'text-word-300'
        const requiredColor =
            surface === 'light' ? 'text-primary-600' : 'text-primary-400'
        const iconColor =
            surface === 'light' ? 'text-secondary-500' : 'text-word-400'
        const iconHover =
            surface === 'light'
                ? 'hover:text-secondary-800'
                : 'hover:text-word-200'
        const helperColor =
            surface === 'light' ? 'text-secondary-500' : 'text-word-400'

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`${labelColor} mb-2 block font-mono text-xs font-bold tracking-widest uppercase`}
                    >
                        {label}
                        {isRequired && (
                            <span
                                className={`${requiredColor} ml-1`}
                                aria-hidden="true"
                            >
                                *
                            </span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div
                            className={`${iconColor} pointer-events-none absolute top-1/2 left-3 -translate-y-1/2`}
                        >
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={inputClasses}
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        aria-invalid={!!error}
                        aria-describedby={
                            [error ? errorId : '', helperText ? helperId : '']
                                .filter(Boolean)
                                .join(' ') || undefined
                        }
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className={`${iconColor} ${iconHover} absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none`}
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}

                    {rightIcon && !isPassword && (
                        <div
                            className={`${iconColor} absolute top-1/2 right-3 -translate-y-1/2`}
                        >
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p
                        id={errorId}
                        className="mt-1 text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={helperId} className={`${helperColor} mt-1 text-sm`}>
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input
