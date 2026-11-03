import React from 'react';

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-1 border-b border-hairline overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-body hover:text-ink hover:bg-surface-strong'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-strong text-body-strong'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        // Default 'underline' variant
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
              isActive
                ? 'border-primary text-ink'
                : 'border-transparent text-body hover:text-ink hover:border-hairline-strong'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-primary text-white' : 'bg-surface-strong text-body-strong'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
