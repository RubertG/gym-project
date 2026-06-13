import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Tab {
    id: string;
    label: string;
}

export interface TabsProps extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
> {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        { tabs, activeTab, onChange, children, className = '', ...props },
        ref
    ) => {
        const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
        const [indicatorStyle, setIndicatorStyle] = useState({
            transform: 'translateX(0px)',
            width: '0px',
        });

        const updateIndicator = useCallback(() => {
            const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
            const activeButton = tabRefs.current[activeIndex];

            if (activeButton && activeButton.parentElement) {
                const parentRect =
                    activeButton.parentElement.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();
                const left = buttonRect.left - parentRect.left;
                const width = buttonRect.width;

                setIndicatorStyle({
                    transform: `translateX(${left}px)`,
                    width: `${width}px`,
                });
            }
        }, [activeTab, tabs]);

        useEffect(() => {
            updateIndicator();
        }, [updateIndicator]);

        useEffect(() => {
            const handleResize = () => {
                updateIndicator();
            };

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, [updateIndicator]);

        return (
            <div ref={ref} className={`w-full ${className}`.trim()} {...props}>
                <div
                    className="border-secondary-800 relative flex border-b-2"
                    role="tablist"
                >
                    {tabs.map((tab, index) => {
                        const isActive = tab.id === activeTab;

                        return (
                            <button
                                key={tab.id}
                                ref={(el) => {
                                    tabRefs.current[index] = el;
                                }}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => onChange(tab.id)}
                                className={[
                                    'relative px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-colors duration-150',
                                    'focus-visible:ring-primary-400 focus-visible:ring-offset-background-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                    isActive
                                        ? 'text-primary-400'
                                        : 'text-word-400 hover:text-word-200',
                                    'active:scale-[0.97]',
                                ].join(' ')}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                    <span className="tab-indicator" style={indicatorStyle} />
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="mt-4"
                        role="tabpanel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }
);

Tabs.displayName = 'Tabs';
export default Tabs;
