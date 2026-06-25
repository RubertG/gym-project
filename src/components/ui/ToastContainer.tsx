import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toast, type ToastType, type ToastPosition } from './Toast'

export interface ToastItem {
    id: string
    message: string
    type: ToastType
    position: ToastPosition
    duration: number
}

export interface ToastContainerProps {
    toasts: ToastItem[]
    onRemove: (id: string) => void
}

const positionMap: Record<ToastPosition, string> = {
    'top-right': 'toast-container top-right flex-col',
    'bottom-right': 'toast-container bottom-right flex-col-reverse',
    'top-left': 'toast-container top-left flex-col',
    'bottom-left': 'toast-container bottom-left flex-col-reverse',
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    const grouped = toasts.reduce<Record<ToastPosition, ToastItem[]>>(
        (acc, toast) => {
            if (!acc[toast.position]) {
                acc[toast.position] = []
            }
            acc[toast.position].push(toast)

            return acc
        },
        {
            'top-right': [],
            'bottom-right': [],
            'top-left': [],
            'bottom-left': [],
        }
    )

    return (
        <>
            {(Object.keys(grouped) as ToastPosition[]).map((position) => {
                const positionToasts = grouped[position]

                if (positionToasts.length === 0) return null

                return (
                    <div key={position} className={positionMap[position]}>
                        <AnimatePresence mode="popLayout">
                            {positionToasts.map((toast) => (
                                <Toast
                                    key={toast.id}
                                    id={toast.id}
                                    message={toast.message}
                                    type={toast.type}
                                    position={position}
                                    duration={toast.duration}
                                    onClose={() => onRemove(toast.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )
            })}
        </>
    )
}

export function useToast() {
    const [toasts, setToasts] = React.useState<ToastItem[]>([])

    const addToast = React.useCallback(
        (
            message: string,
            type: ToastType = 'info',
            position: ToastPosition = 'top-right',
            duration: number = 5000
        ) => {
            const id = crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`
            const newToast: ToastItem = {
                id,
                message,
                type,
                position,
                duration,
            }
            setToasts((prev) => [...prev, newToast])
        },
        []
    )

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return { toasts, addToast, removeToast }
}

export default ToastContainer
