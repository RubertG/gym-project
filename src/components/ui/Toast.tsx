import React, { useEffect, useCallback } from 'react';
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

const positionAnimationMap: Record<ToastPosition, string> = {
    'top-right': 'animate-slide-in-right',
    'bottom-right': 'animate-slide-in-right',
    'top-left': 'animate-slide-in-left',
    'bottom-left': 'animate-slide-in-left',
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
        const handleClose = useCallback(() => {
            onClose();
        }, [onClose]);

        useEffect(() => {
            if (duration <= 0) return;
            const timer = setTimeout(handleClose, duration);

            return () => clearTimeout(timer);
        }, [duration, handleClose]);

        const config = typeConfig[type];
        const Icon = config.icon;
        const animationClass = positionAnimationMap[position];

        return (
            <div
                ref={ref}
                className={`${animationClass} ${className}`.trim()}
                role="alert"
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
                        onClick={handleClose}
                        className="text-word-400 hover:text-word-200 focus-visible:ring-primary-400 transition-colors focus:outline-none focus-visible:ring-2 active:scale-[0.97]"
                        aria-label="Cerrar notificacion"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }
);

Toast.displayName = 'Toast';
export default Toast;
