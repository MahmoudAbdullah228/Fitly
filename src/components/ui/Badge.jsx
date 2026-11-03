import React from 'react';

/**
 * Badge component per DESIGN.md:
 * - badge-pill: uppercase pill, 11px font weight 600, letter-spacing 0.88px, rounded-full
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center font-semibold uppercase tracking-wider rounded-full transition-colors whitespace-nowrap select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    default: 'bg-surface-strong text-ink border border-hairline',
    subtle: 'bg-canvas-soft text-body border border-hairline',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200/70',
    error: 'bg-red-50 text-red-800 border border-red-200/60',
    preview: 'bg-purple-50 text-purple-800 border border-purple-200/60',
    dark: 'bg-surface-dark text-on-dark border border-surface-dark-elevated',
    source: 'bg-canvas text-body-strong border border-hairline-strong font-mono text-[10px] tracking-normal uppercase',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 stroke-[2.2]" />}
      {children}
    </span>
  );
}
