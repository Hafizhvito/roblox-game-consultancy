import React from 'react';

export default function Badge({
  children,
  color = 'mint', // 'mint' | 'peach' | 'lavender' | 'butter' | 'sky' | 'cream' | 'ink'
  size = 'md',    // 'sm' | 'md'
  className = '',
}) {
  const colorMap = {
    mint: 'bg-mint text-ink border-mint/60',
    peach: 'bg-peach text-ink border-peach/60',
    lavender: 'bg-lavender text-ink border-lavender/60',
    butter: 'bg-butter text-ink border-butter/60',
    sky: 'bg-sky text-ink border-sky/60',
    cream: 'bg-cream text-ink border-ink/20',
    ink: 'bg-ink text-cream border-ink',
  };

  const sizeMap = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs uppercase tracking-wider ${sizeMap[size]} ${colorMap[color] || colorMap.mint} ${className}`}
    >
      {children}
    </span>
  );
}
