import React from 'react'

export interface TextareaProps extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'size'
> {
    rows?: number
    maxLength?: number
    resize?: boolean
    label?: string
    error?: string
    helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            rows = 4,
            maxLength,
            resize = false,
            label,
            error,
            helperText,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const textareaId = id || generatedId
        const errorId = `${textareaId}-error`
        const helperId = `${textareaId}-helper`

        const baseClasses = [
            'w-full bg-background-800 text-word-100 placeholder:text-word-400',
            'border-2 border-secondary-700 outline-none transition-colors duration-150',
            'focus:border-primary-400 focus:outline-none',
            'px-4 py-3 text-base',
            resize ? 'resize-y' : 'resize-none',
            error ? 'border-red-500 focus:border-red-500' : '',
            props.disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-word-300 mb-2 block font-mono text-xs font-bold tracking-widest uppercase"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    maxLength={maxLength}
                    className={baseClasses}
                    aria-invalid={!!error}
                    aria-describedby={
                        [error ? errorId : '', helperText ? helperId : '']
                            .filter(Boolean)
                            .join(' ') || undefined
                    }
                    {...props}
                />

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
                    <p id={helperId} className="text-word-400 mt-1 text-sm">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'
export default Textarea
