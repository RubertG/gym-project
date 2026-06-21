import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            title,
            children,
            footer,
            size = 'md',
            className = '',
            ...props
        },
        ref
    ) => {
        const handleEscape = useCallback(
            (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose()
            },
            [onClose]
        )

        useEffect(() => {
            if (isOpen) {
                document.addEventListener('keydown', handleEscape)
            }

            return () => {
                document.removeEventListener('keydown', handleEscape)
            }
        }, [isOpen, handleEscape])

        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden'
            }
        }, [isOpen])

        const handleExitComplete = useCallback(() => {
            document.body.style.overflow = ''
        }, [])

        return (
            <AnimatePresence onExitComplete={handleExitComplete}>
                {isOpen && (
                    <div
                        ref={ref}
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`.trim()}
                        {...props}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-md"
                            onClick={onClose}
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Content */}
                        <motion.div
                            className={`relative mx-auto w-full ${sizeMap[size]}`}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            <div
                                className="bg-background-800/90 border-primary-400/20 border p-6"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={
                                    title ? 'modal-title' : undefined
                                }
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    {title && (
                                        <h2
                                            id="modal-title"
                                            className="font-display text-word-100 text-xl font-bold tracking-widest uppercase"
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className={`text-word-400 hover:text-word-200 focus-visible:ring-primary-400 transition-colors focus:outline-none focus-visible:ring-2 active:scale-[0.97] ${
                                            title ? '' : 'ml-auto'
                                        }`}
                                        aria-label="Cerrar modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="text-word-200">{children}</div>

                                {/* Footer */}
                                {footer && (
                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        {footer}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        )
    }
)

Modal.displayName = 'Modal'
export default Modal
