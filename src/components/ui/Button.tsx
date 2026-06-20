import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<
    React.HTMLAttributes<HTMLElement>,
    'type'
> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    surface?: 'dark' | 'light';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    glow?: boolean;
    href?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
    dark: {
        primary:
            'bg-primary-400 text-black border-2 border-primary-400 hover:bg-primary-300',
        secondary:
            'bg-transparent text-secondary-200 border-2 border-secondary-400 hover:bg-secondary-400 hover:text-black',
        ghost: 'bg-transparent text-word-200 border-2 border-transparent hover:border-secondary-400 hover:text-white',
        danger: 'bg-red-600 text-white border-2 border-red-600 hover:bg-red-500 hover:border-red-500',
    },
    light: {
        primary:
            'bg-background-900 text-primary-400 border-2 border-background-900 hover:bg-background-800 hover:border-background-800 hover:text-primary-300',
        secondary:
            'bg-transparent text-secondary-800 border-2 border-secondary-700 hover:bg-secondary-800 hover:text-white',
        ghost: 'bg-transparent text-word-400 border-2 border-transparent hover:border-secondary-700 hover:text-background-900',
        danger: 'bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white',
    },
};

const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            surface = 'dark',
            loading = false,
            leftIcon,
            rightIcon,
            glow = false,
            href,
            children,
            className = '',
            disabled,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const ringOffset =
            surface === 'light'
                ? 'focus:ring-offset-white'
                : 'focus:ring-offset-background-900';

        const baseClasses = [
            'inline-flex items-center justify-center gap-2 font-bold tracking-wide cursor-pointer',
            `focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${ringOffset}`,
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            variantStyles[surface][variant],
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
                type={type}
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
