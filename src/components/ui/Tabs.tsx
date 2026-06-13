import React from 'react';

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
        return (
            <div ref={ref} className={`w-full ${className}`.trim()} {...props}>
                <div
                    className="border-secondary-800 flex border-b-2"
                    role="tablist"
                >
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeTab;

                        return (
                            <button
                                key={tab.id}
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
                                {isActive && (
                                    <span className="bg-primary-400 absolute bottom-[-2px] left-0 h-[2px] w-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4" role="tabpanel">
                    {children}
                </div>
            </div>
        );
    }
);

Tabs.displayName = 'Tabs';
export default Tabs;
