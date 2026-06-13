import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
    | 'top-right'
    | 'bottom-right'
    | 'top-left'
    | 'bottom-left';

export interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
    position?: ToastPosition;
    className?: string;
}

const typeConfig = {
    success: {
        icon: CheckCircle,
        borderColor: 'border-green-500/30',
        iconColor: 'text-green-400',
    },
    error: {
        icon: XCircle,
        borderColor: 'border-red-500/30',
        iconColor: 'text-red-400',
    },
    warning: {
        icon: AlertTriangle,
        borderColor: 'border-yellow-500/30',
        iconColor: 'text-yellow-400',
    },
    info: {
        icon: Info,
        borderColor: 'border-primary-400/20',
        iconColor: 'text-primary-400',
    },
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    (
        {
            message,
            type = 'info',
            duration = 5000,
            onClose,
            position = 'top-right',
            className = '',
            ...props
        },
        ref
    ) => {
        useEffect(() => {
            if (duration <= 0) return;
            const timer = setTimeout(onClose, duration);

            return () => clearTimeout(timer);
        }, [duration, onClose]);

        const config = typeConfig[type];
        const Icon = config.icon;

        // Animaciones segun posicion
        const isRight = position.includes('right');
        const isLeft = position.includes('left');
        const isTop = position.includes('top');

        const variants = {
            hidden: isRight
                ? { opacity: 0, x: 100, scale: 0.9 }
                : isLeft
                  ? { opacity: 0, x: -100, scale: 0.9 }
                  : {
                        opacity: 0,
                        y: isTop ? -50 : 50,
                        scale: 0.9,
                    },
            visible: { opacity: 1, x: 0, y: 0, scale: 1 },
            exit: isRight
                ? {
                      opacity: 0,
                      x: 100,
                      scale: 0.9,
                      transition: { duration: 0.25 },
                  }
                : isLeft
                  ? {
                        opacity: 0,
                        x: -100,
                        scale: 0.9,
                        transition: { duration: 0.25 },
                    }
                  : {
                        opacity: 0,
                        y: isTop ? -50 : 50,
                        scale: 0.9,
                        transition: { duration: 0.25 },
                    },
        };

        return (
            <motion.div
                ref={ref}
                className={className}
                role="alert"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{
                    layout: { duration: 0.3, ease: 'easeInOut' },
                    default: { duration: 0.3, ease: 'easeOut' },
                }}
                {...props}
            >
                <div
                    className={`bg-background-800/90 flex items-start gap-3 border ${config.borderColor} max-w-[400px] min-w-[280px] p-4 backdrop-blur-md`}
                >
                    <Icon
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config.iconColor}`}
                    />
                    <p className="text-word-200 flex-1 text-sm">{message}</p>
                    <button
                        onClick={onClose}
                        className="text-word-400 hover:text-word-200 focus-visible:ring-primary-400 transition-colors focus:outline-none focus-visible:ring-2 active:scale-[0.97]"
                        aria-label="Cerrar notificacion"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        );
    }
);

Toast.displayName = 'Toast';
export default Toast;
