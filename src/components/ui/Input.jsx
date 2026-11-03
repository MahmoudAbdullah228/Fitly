import React from 'react';

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-body-strong">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-4 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error' : ''
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-body">{helperText}</p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-body-strong">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded-md border border-hairline-strong bg-surface-card px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed ${
          error ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error' : ''
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-body">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
