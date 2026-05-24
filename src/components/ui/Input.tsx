import React, { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

const variantStyles = {
  default: 'input-field',
  ghost:
    'bg-transparent border-0 border-b-2 border-secondary-700 rounded-none px-0 py-2 focus:border-primary-400 focus:ring-0',
};

const sizeStyles = {
  sm: 'text-sm py-2 px-3',
  md: 'text-base py-3 px-4',
  lg: 'text-lg py-4 px-5',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
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
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const togglePassword = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const inputClasses = [
      'w-full',
      'text-word-100 placeholder:text-word-400',
      'focus:outline-none',
      variant === 'default' ? variantStyles.default : variantStyles.ghost,
      variant === 'default' ? sizeStyles[size] : '',
      error
        ? 'border-red-500 focus:border-red-500'
        : 'focus:border-primary-400',
      isDisabled ? 'opacity-50 cursor-not-allowed' : '',
      leftIcon ? 'pl-10' : '',
      rightIcon || isPassword ? 'pr-10' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-word-300 mb-2 block font-mono text-xs font-bold tracking-widest uppercase"
          >
            {label}
            {isRequired && (
              <span className="text-primary-400 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="text-word-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
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
              className="text-word-400 hover:text-word-200 absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {rightIcon && !isPassword && (
            <div className="text-word-400 absolute top-1/2 right-3 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-word-400 mt-1 text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
