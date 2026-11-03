import React from 'react';

export function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseStyles = 'animate-pulse bg-[#f0f0f3] dark:bg-[#202022]';

  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg border border-hairline',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      style={style}
      className={`${baseStyles} ${variantStyles[variant] || ''} ${className}`}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline-strong bg-surface-card p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-14 w-full" />
      <div className="flex items-center justify-between pt-2 border-t border-hairline">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}

export default Skeleton;
