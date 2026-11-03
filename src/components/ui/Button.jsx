import React from 'react';

/**
 * Button component strictly conforming to DESIGN.md
 * - Primary: pure black pill at 8px radius (rounded-md), 40px height, 14px 500 weight
 * - Secondary: white card with 1px hairline-strong border
 * - Tertiary: transparent with text-link blue or ink
 * - Dark Inversion: pure white button on dark surfaces
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none text-sm';

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 py-2 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
    icon: 'h-10 w-10 p-0',
    'icon-sm': 'h-8 w-8 p-0',
  };

  const variantStyles = {
    primary: 'bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active shadow-sm',
    secondary: 'bg-surface-card text-ink border border-hairline-strong hover:bg-canvas-soft hover:border-body/30',
    tertiary: 'bg-transparent text-text-link hover:underline p-0 h-auto',
    ghost: 'bg-transparent text-ink hover:bg-surface-strong',
    outline: 'bg-transparent text-ink border border-hairline hover:bg-surface-strong',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    inverted: 'bg-white text-ink hover:bg-canvas-soft shadow-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
