import React from 'react';
import { X } from 'lucide-react';

export default function Chip({
  label,
  children,
  selected = false,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const content = label || children;

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const isClickable = Boolean(onClick);

  let variantStyles = 'bg-surface-strong text-ink border border-hairline';

  if (variant === 'matched') {
    variantStyles = 'bg-emerald-50 text-emerald-900 border border-emerald-200';
  } else if (variant === 'missing') {
    variantStyles = 'bg-red-50/60 text-red-800 border border-red-200/50';
  } else if (variant === 'outline') {
    variantStyles = selected
      ? 'bg-ink text-white border-ink'
      : 'bg-surface-card text-ink border border-hairline-strong hover:border-body';
  } else if (selected) {
    variantStyles = 'bg-primary text-on-primary border-primary';
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md font-medium transition-colors select-none ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles} ${isClickable ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      <span>{content}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/10 transition-colors -mr-1"
          aria-label={`Remove ${content}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
