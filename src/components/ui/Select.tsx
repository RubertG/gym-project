import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            options,
            value,
            onChange,
            placeholder = 'Seleccionar...',
            label,
            error,
            disabled = false,
            className = '',
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const containerRef = useRef<HTMLDivElement>(null)

        const selectedOption = options.find((opt) => opt.value === value)
        const displayText = selectedOption ? selectedOption.label : placeholder

        const handleToggle = useCallback(() => {
            if (!disabled) {
                setIsOpen((prev) => !prev)
            }
        }, [disabled])

        const handleSelect = useCallback(
            (optionValue: string) => {
                onChange?.(optionValue)
                setIsOpen(false)
            },
            [onChange]
        )

        const handleClickOutside = useCallback((event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }, [])

        const handleEscape = useCallback((event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }, [])

        useEffect(() => {
            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside)
                document.addEventListener('keydown', handleEscape)
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
            }
        }, [isOpen, handleClickOutside, handleEscape])

        const generatedId = React.useId()
        const selectId = generatedId
        const errorId = `${selectId}-error`

        return (
            <div ref={ref} className={`w-full ${className}`.trim()}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-word-300 mb-2 block font-mono text-xs font-bold tracking-widest uppercase"
                    >
                        {label}
                    </label>
                )}

                <div ref={containerRef} className="relative">
                    {/* Trigger */}
                    <button
                        id={selectId}
                        type="button"
                        onClick={handleToggle}
                        disabled={disabled}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        className={[
                            'bg-background-800 text-word-100 flex w-full items-center justify-between',
                            'border-secondary-700 border-2 transition-colors duration-150 outline-none',
                            'focus:border-primary-400 focus:outline-none',
                            'px-4 py-3 text-base',
                            error ? 'border-red-500 focus:border-red-500' : '',
                            disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <span
                            className={
                                selectedOption
                                    ? 'text-word-100'
                                    : 'text-word-400'
                            }
                        >
                            {displayText}
                        </span>
                        <ChevronDown
                            className={`text-word-400 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                role="listbox"
                                className="border-primary-400/20 bg-background-800/95 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto border shadow-lg backdrop-blur-md"
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{
                                    duration: 0.15,
                                    ease: 'easeOut',
                                }}
                            >
                                {options.map((option) => {
                                    const isSelected = option.value === value

                                    return (
                                        <div
                                            key={option.value}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() =>
                                                handleSelect(option.value)
                                            }
                                            className={[
                                                'cursor-pointer px-4 py-3 text-base transition-colors duration-150',
                                                'hover:bg-background-700',
                                                isSelected
                                                    ? 'bg-background-700 text-primary-400 font-bold'
                                                    : 'text-word-200',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        >
                                            {option.label}
                                        </div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
        )
    }
)

Select.displayName = 'Select'
export default Select
