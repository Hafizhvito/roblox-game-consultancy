import React from 'react';

export default function Section({
  children,
  background = 'cream', // 'cream' | 'white' | 'peach-tint' | 'mint-tint' | 'lavender-tint' | 'butter-tint' | 'sky-tint'
  className = '',
  id = '',
  containerClassName = '',
}) {
  const bgStyles = {
    cream: 'bg-cream text-ink',
    white: 'bg-white text-ink border-y border-ink/5',
    'peach-tint': 'bg-[#FFF7F4] text-ink',
    'mint-tint': 'bg-[#F2FAF6] text-ink',
    'lavender-tint': 'bg-[#F7F4FC] text-ink',
    'butter-tint': 'bg-[#FEFAF0] text-ink',
    'sky-tint': 'bg-[#F3F8FC] text-ink',
    peach: 'bg-peach text-ink',
    mint: 'bg-mint text-ink',
    lavender: 'bg-lavender text-ink',
    butter: 'bg-butter text-ink',
    sky: 'bg-sky text-ink',
  };

  return (
    <section id={id} className={`py-16 md:py-24 ${bgStyles[background] || bgStyles.cream} ${className}`}>
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
