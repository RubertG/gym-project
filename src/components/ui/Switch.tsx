import React from 'react';

export interface SwitchProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size'
> {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

const sizeMap = {
    sm: { track: 'w-9 h-5', thumb: 'h-3 w-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-4 w-4', translate: 'translate-x-5' },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    (
        {
            checked,
            defaultChecked,
            onChange,
            disabled = false,
            size = 'md',
            className = '',
            ...props
        },
        ref
    ) => {
        const { track, thumb, translate } = sizeMap[size];

        const isControlled = checked !== undefined;
        const isChecked = isControlled ? checked : defaultChecked;

        return (
            <label
                className={`inline-flex cursor-pointer items-center select-none ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`.trim()}
            >
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only"
                    {...props}
                />
                <div
                    className={`relative inline-flex items-center rounded-full transition-colors duration-200 ${track} ${
                        isChecked ? 'bg-primary-400' : 'bg-secondary-700'
                    } ${!disabled ? 'active:scale-[0.97]' : ''}`}
                    aria-hidden="true"
                >
                    <div
                        className={`absolute left-1 rounded-full bg-white transition-transform duration-200 ${thumb} ${
                            isChecked ? translate : 'translate-x-0'
                        }`}
                    />
                </div>
            </label>
        );
    }
);

Switch.displayName = 'Switch';
export default Switch;
