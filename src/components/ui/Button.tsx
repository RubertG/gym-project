import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    glow?: boolean;
    href?: string;
    disabled?: boolean;
}

const variantStyles = {
    primary:
        'bg-primary-400 text-black border-2 border-primary-400 hover:bg-primary-300',
    secondary:
        'bg-transparent text-secondary-200 border-2 border-secondary-400 hover:bg-secondary-400 hover:text-black',
    ghost: 'bg-transparent text-word-200 border-2 border-transparent hover:border-secondary-400 hover:text-white',
    danger: 'bg-red-600 text-white border-2 border-red-600 hover:bg-red-500 hover:border-red-500',
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            leftIcon,
            rightIcon,
            glow = false,
            href,
            children,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = [
            'inline-flex items-center justify-center gap-2 font-bold tracking-wide',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-900',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            variantStyles[variant],
            sizeStyles[size],
            glow && variant === 'primary'
                ? 'shadow-[0_0_25px_rgba(204,255,0,0.3)]'
                : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const content = (
            <>
                {loading && (
                    <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                    />
                )}
                {!loading && leftIcon && (
                    <span className="inline-flex items-center">{leftIcon}</span>
                )}
                {children}
                {!loading && rightIcon && (
                    <span className="inline-flex items-center">
                        {rightIcon}
                    </span>
                )}
            </>
        );

        if (href) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={baseClasses}
                    {...props}
                >
                    {content}
                </a>
            );
        }

        return (
            <button
                ref={ref}
                className={baseClasses}
                disabled={disabled || loading}
                aria-busy={loading}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
