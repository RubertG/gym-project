import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'size'
> {
    options: SelectOption[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    label?: string;
    error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            options,
            value,
            onChange,
            disabled = false,
            placeholder,
            label,
            error,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const selectId = id || generatedId;
        const errorId = `${selectId}-error`;

        const baseClasses = [
            'w-full appearance-none bg-background-800 text-word-100',
            'border-2 border-secondary-700 outline-none transition-colors duration-150',
            'focus:border-primary-400 focus:outline-none',
            'px-4 py-3 pr-10 text-base',
            error ? 'border-red-500 focus:border-red-500' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-word-300 mb-2 block font-mono text-xs font-bold tracking-widest uppercase"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        className={baseClasses}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="text-word-400 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                        <ChevronDown className="h-4 w-4" />
                    </div>
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
            </div>
        );
    }
);

Select.displayName = 'Select';
export default Select;
