import React from 'react';

/**
 * Geometric, blocky, and stationery-inspired motifs.
 * Built with pure SVG paths and pastel theme fills.
 */

export function BlockMotif({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {/* 3 stacked game blocks */}
      <rect x="8" y="32" width="20" height="20" rx="3" fill="#CFE8DC" stroke="#2B2A33" strokeWidth="2" />
      <rect x="32" y="32" width="20" height="20" rx="3" fill="#F9D5C5" stroke="#2B2A33" strokeWidth="2" />
      <rect x="20" y="12" width="20" height="20" rx="3" fill="#DCD3F0" stroke="#2B2A33" strokeWidth="2" />
      <circle cx="30" cy="22" r="3" fill="#2B2A33" />
      <circle cx="18" cy="42" r="3" fill="#2B2A33" />
      <circle cx="42" cy="42" r="3" fill="#2B2A33" />
    </svg>
  );
}

export function GridPattern({ className = 'w-full h-full text-ink/10' }) {
  return (
    <svg className={className} width="100%" height="100%" fill="none" aria-hidden="true">
      <defs>
        <pattern id="smallGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
    </svg>
  );
}

export function PixelStar({ className = 'w-8 h-8 text-butter' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.5-6.5-2.8 2.8m-7.4 7.4-2.8 2.8m0-13 2.8 2.8m7.4 7.4 2.8 2.8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}

export function GeometricStairs({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="10" y="50" width="20" height="20" rx="2" fill="#F8EBB8" stroke="#2B2A33" strokeWidth="2" />
      <rect x="30" y="30" width="20" height="40" rx="2" fill="#CFE3F3" stroke="#2B2A33" strokeWidth="2" />
      <rect x="50" y="10" width="20" height="60" rx="2" fill="#F9D5C5" stroke="#2B2A33" strokeWidth="2" />
      <line x1="16" y1="56" x2="24" y2="56" stroke="#2B2A33" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="36" x2="44" y2="36" stroke="#2B2A33" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="16" x2="64" y2="16" stroke="#2B2A33" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StudioCompass({ className = 'w-20 h-20' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#FBF7F2" stroke="#2B2A33" strokeWidth="2" />
      <circle cx="32" cy="32" r="22" stroke="#DCD3F0" strokeWidth="3" strokeDasharray="4 4" />
      <polygon points="32 14 37 32 32 30" fill="#2B2A33" />
      <polygon points="32 50 27 32 32 34" fill="#CFE8DC" stroke="#2B2A33" strokeWidth="1" />
      <polygon points="14 32 32 27 30 32" fill="#F9D5C5" stroke="#2B2A33" strokeWidth="1" />
      <polygon points="50 32 32 37 34 32" fill="#F8EBB8" stroke="#2B2A33" strokeWidth="1" />
      <circle cx="32" cy="32" r="4" fill="#2B2A33" />
    </svg>
  );
}
