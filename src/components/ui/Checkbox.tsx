import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type'
> {
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    label?: string;
    id?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            checked,
            onChange,
            disabled = false,
            label,
            id,
            className = '',
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const checkboxId = id || generatedId;

        return (
            <label
                htmlFor={checkboxId}
                className={`inline-flex cursor-pointer items-center gap-3 select-none ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`.trim()}
            >
                <div className="relative inline-flex items-center justify-center">
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className="sr-only"
                        {...props}
                    />
                    <div
                        className={`h-5 w-5 border-2 transition-colors duration-150 ${
                            checked
                                ? 'bg-primary-400 border-primary-400'
                                : 'border-secondary-400 bg-transparent'
                        } ${
                            !disabled && !checked
                                ? 'hover:border-primary-400'
                                : ''
                        } ${!disabled ? 'active:scale-[0.97]' : ''}`}
                        aria-hidden="true"
                    >
                        {checked && (
                            <Check
                                className="h-4 w-4 text-black"
                                strokeWidth={3}
                            />
                        )}
                    </div>
                </div>
                {label && (
                    <span className="font-body text-word-200 text-sm">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
