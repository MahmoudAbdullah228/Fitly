import React from 'react';

/**
 * ScoreRing visualizes the match score percentage according to DESIGN.md
 * Colors:
 * - High (>= 80%): semantic-success (#16a34a)
 * - Medium (60-79%): accent-warning (#ab6400)
 * - Low (< 60%): muted (#999999)
 */
export default function ScoreRing({
  score = 0,
  size = 'md',
  showLabel = true,
  className = '',
}) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorHex = '#16a34a'; // semantic-success
  let labelText = 'Great Fit';
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';

  if (normalizedScore < 60) {
    colorHex = '#999999'; // muted
    labelText = 'Low Match';
    badgeBg = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  } else if (normalizedScore < 80) {
    colorHex = '#ab6400'; // accent-warning
    labelText = 'Good Fit';
    badgeBg = 'bg-amber-50 text-amber-900 border-amber-200';
  }

  if (size === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg} ${className}`}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: colorHex }}
        />
        <span className="font-mono tracking-tight">{normalizedScore}%</span>
        {showLabel && <span className="font-sans font-normal text-[11px] opacity-80">{labelText}</span>}
      </span>
    );
  }

  const dimensions = {
    sm: { size: 48, stroke: 4, font: 'text-sm' },
    md: { size: 72, stroke: 5, font: 'text-xl font-semibold' },
    lg: { size: 96, stroke: 6, font: 'text-2xl font-semibold' },
    xl: { size: 120, stroke: 8, font: 'text-3xl font-semibold' },
  };

  const config = dimensions[size] || dimensions.md;
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: config.size, height: config.size }}
      >
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${config.size} ${config.size}`}
        >
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="#f0f0f3"
            strokeWidth={config.stroke}
            fill="transparent"
          />
          {/* Foreground progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke={colorHex}
            strokeWidth={config.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono text-ink ${config.font} leading-none tracking-tight`}>
            {normalizedScore}%
          </span>
        </div>
      </div>
      {showLabel && size !== 'sm' && (
        <span
          className="text-xs font-semibold tracking-wider uppercase mt-2 select-none"
          style={{ color: colorHex }}
        >
          {labelText}
        </span>
      )}
    </div>
  );
}
