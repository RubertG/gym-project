import React from 'react'

export interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary'
}

const sizeMap = {
    sm: { width: 16, strokeWidth: 2 },
    md: { width: 24, strokeWidth: 2.5 },
    lg: { width: 32, strokeWidth: 3 },
}

const strokeColor = {
    primary: '#CCFF00',
    secondary: '#c8c6c5',
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
    ({ size = 'md', variant = 'primary', className = '', ...props }, ref) => {
        const { width, strokeWidth } = sizeMap[size]
        const color = strokeColor[variant]
        const radius = (width - strokeWidth) / 2
        const circumference = 2 * Math.PI * radius
        const dashArray = `${circumference * 0.75} ${circumference * 0.25}`

        return (
            <svg
                ref={ref}
                width={width}
                height={width}
                viewBox={`0 0 ${width} ${width}`}
                className={`${className}`.trim()}
                style={{
                    animation: 'spin 1s linear infinite',
                }}
                {...props}
            >
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        svg { animation: none !important; }
                    }
                `}</style>
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="square"
                    strokeDasharray={dashArray}
                />
            </svg>
        )
    }
)

Spinner.displayName = 'Spinner'
export default Spinner
