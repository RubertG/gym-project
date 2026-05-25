import React from 'react';

export interface GlowEffectProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: 'primary' | 'secondary';
    intensity?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const colorStyles = {
    primary: {
        sm: 'shadow-[0_0_15px_rgba(204,255,0,0.15)]',
        md: 'shadow-[0_0_25px_rgba(204,255,0,0.3)]',
        lg: 'shadow-[0_0_40px_rgba(204,255,0,0.5)]',
    },
    secondary: {
        sm: 'shadow-[0_0_15px_rgba(200,198,197,0.15)]',
        md: 'shadow-[0_0_25px_rgba(200,198,197,0.3)]',
        lg: 'shadow-[0_0_40px_rgba(200,198,197,0.5)]',
    },
};

export const GlowEffect = React.forwardRef<HTMLDivElement, GlowEffectProps>(
    (
        {
            color = 'primary',
            intensity = 'md',
            children,
            className = '',
            ...props
        },
        ref
    ) => {
        const glowClass = colorStyles[color][intensity];

        return (
            <div
                ref={ref}
                className={`${glowClass} ${className}`.trim()}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlowEffect.displayName = 'GlowEffect';
export default GlowEffect;
