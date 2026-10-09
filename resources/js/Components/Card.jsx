import React from 'react';

export default function Card({
  children,
  accent = null, // 'peach' | 'mint' | 'lavender' | 'butter' | 'sky' | null
  hoverLift = true,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const accentBorder = {
    peach: 'hover:border-peach focus-within:border-peach',
    mint: 'hover:border-mint focus-within:border-mint',
    lavender: 'hover:border-lavender focus-within:border-lavender',
    butter: 'hover:border-butter focus-within:border-butter',
    sky: 'hover:border-sky focus-within:border-sky',
  };

  const liftStyles = hoverLift
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md'
    : '';

  return (
    <Component
      className={`bg-white rounded-2xl border border-ink/10 p-6 md:p-8 shadow-xs relative overflow-hidden ${liftStyles} ${accent ? accentBorder[accent] || '' : ''} ${className}`}
      {...props}
    >
      {accent && (
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            accent === 'peach' ? 'bg-peach' :
            accent === 'mint' ? 'bg-mint' :
            accent === 'lavender' ? 'bg-lavender' :
            accent === 'butter' ? 'bg-butter' :
            accent === 'sky' ? 'bg-sky' : 'bg-mint'
          }`}
        />
      )}
      {children}
    </Component>
  );
}
