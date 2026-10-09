import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Button from './Button';

export default function Navbar() {
  const { url, props } = usePage();
  const business = props.business || { name: '[BUSINESS_NAME]' };
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Packages', href: '/packages' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Code Snippets', href: '/snippets' },
    { label: 'Process', href: '/process' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href) => {
    if (href === '/') return url === '/';
    return url.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-ink/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-ink rounded-lg">
            <div className="w-10 h-10 rounded-xl bg-peach border border-ink/20 flex items-center justify-center font-display font-bold text-lg text-ink shadow-2xs group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-lg sm:text-xl text-ink tracking-tight">
                {business.name}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                Roblox Advisory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ink ${
                  isActive(link.href)
                    ? 'bg-ink/5 text-ink font-semibold'
                    : 'text-ink-soft hover:text-ink hover:bg-ink/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Start a Project
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-ink/10 bg-cream px-4 pt-3 pb-6 space-y-2 animate-fade-rise">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-ink/10 text-ink font-semibold'
                  : 'text-ink-soft hover:text-ink hover:bg-ink/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-ink/10">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Start a Project
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
