import React from 'react'
import { User } from 'lucide-react'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ src, fallback, size = 'md', className = '', ...props }, ref) => {
        const dimension = sizeMap[size]
        const initials = fallback
            ? fallback
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
            : ''

        return (
            <div
                ref={ref}
                className={`border-secondary-400 bg-background-800 inline-flex items-center justify-center overflow-hidden rounded-full border-2 ${className}`.trim()}
                style={{ width: dimension, height: dimension }}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={fallback || 'Avatar'}
                        className="h-full w-full object-cover"
                    />
                ) : initials ? (
                    <span className="text-word-200 font-mono text-xs font-bold">
                        {initials}
                    </span>
                ) : (
                    <User className="text-word-400 h-5 w-5" />
                )}
            </div>
        )
    }
)

Avatar.displayName = 'Avatar'
export default Avatar
