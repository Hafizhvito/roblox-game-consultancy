import React from 'react';
import { Link } from '@inertiajs/react';

export default function Button({
  children,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'peach' | 'mint'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-0.5 hover:-translate-y-0.5';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-ink text-cream hover:bg-ink-soft border border-ink shadow-sm',
    secondary: 'bg-cream text-ink border border-ink/20 hover:border-ink/40 hover:bg-white shadow-xs',
    outline: 'bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink/5',
    peach: 'bg-peach text-ink border border-ink/20 hover:border-ink hover:shadow-sm font-semibold',
    mint: 'bg-mint text-ink border border-ink/20 hover:border-ink hover:shadow-sm font-semibold',
    butter: 'bg-butter text-ink border border-ink/20 hover:border-ink hover:shadow-sm font-semibold',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
