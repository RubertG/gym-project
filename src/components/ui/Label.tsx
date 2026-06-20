import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    children: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ required, children, className = '', ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`text-word-300 font-mono text-xs font-bold tracking-widest uppercase ${className}`.trim()}
                {...props}
            >
                {children}
                {required && (
                    <span className="text-primary-400 ml-1" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
        )
    }
)

Label.displayName = 'Label'
export default Label
