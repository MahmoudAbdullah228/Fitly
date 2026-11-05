import React from 'react';

/**
 * Card component per DESIGN.md:
 * - 12px border radius (rounded-lg)
 * - 1px hairline or hairline-strong border
 * - Pure white canvas surface or dark inversion surface
 * - Soft drop shadow on hover
 */
export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  as: Component = 'div',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-lg transition-all duration-200';

  const variantStyles = {
    default: 'bg-surface-card text-ink border border-hairline-strong',
    subtle: 'bg-canvas-soft text-ink border border-hairline',
    dark: 'bg-surface-dark text-on-dark border border-surface-dark-elevated',
    flat: 'bg-surface-card text-ink border border-hairline',
    highlight: 'bg-gradient-to-b from-[#f0f7ff] to-white border border-[#cfe7ff]',
  };

  const hoverStyles = hover
    ? 'hover:border-body/40 hover:shadow-soft hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <Component
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
