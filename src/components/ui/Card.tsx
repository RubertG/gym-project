import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-background-800/80 border-primary-400/20 border backdrop-blur-md ${className}`.trim()}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
export default Card;
