import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { IconMail, IconChat } from './Icons';
import { isPlaceholderEmail } from '../Utils/email';

export default function Footer() {
  const { props } = usePage();
  const business = props.business || {
    name: '[BUSINESS_NAME]',
    email: '[EMAIL_PERUSAHAAN]',
    whatsapp_display: '+62 812-3456-7890',
    whatsapp_number: '+6281234567890',
    tagline: 'Roblox game consulting for creators who build things that last.',
  };

  const rawWhatsapp = business.whatsapp_number || business.whatsapp || '';
  const whatsappClean = rawWhatsapp ? rawWhatsapp.replace(/[^0-9]/g, '') : '';
  const whatsappDisplay = business.whatsapp_display || business.whatsapp || '';

  return (
    <footer className="bg-ink text-cream pt-16 pb-12 border-t border-ink/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-cream/15">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-peach text-ink flex items-center justify-center font-display font-bold text-sm">
                R
              </div>
              <span className="font-display font-semibold text-xl text-cream tracking-tight">
                {business.name}
              </span>
            </div>
            <p className="text-sm text-cream/70 max-w-md leading-relaxed">
              {business.tagline}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              {isPlaceholderEmail(business.email) ? (
                <span className="inline-flex items-center gap-2 text-peach cursor-default">
                  <IconMail className="w-4 h-4" />
                  <span>{business.email}</span>
                </span>
              ) : (
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center gap-2 text-peach hover:underline focus-visible:outline-2 focus-visible:outline-peach"
                >
                  <IconMail className="w-4 h-4" />
                  <span>{business.email}</span>
                </a>
              )}
              {whatsappClean && (
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20Roblox%20game%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-mint hover:underline focus-visible:outline-2 focus-visible:outline-mint"
                >
                  <IconChat className="w-4 h-4" />
                  <span>WhatsApp: {whatsappDisplay}</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cream/50">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-cream/80 hover:text-cream transition-colors">
                  Services Catalog
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-cream/80 hover:text-cream transition-colors">
                  Consulting Packages
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-cream/80 hover:text-cream transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-cream/80 hover:text-cream transition-colors">
                  How We Work
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-cream/80 hover:text-cream transition-colors">
                  Robux & DevEx Calculator
                </Link>
              </li>
              <li>
                <Link href="/snippets" className="text-cream/80 hover:text-cream transition-colors">
                  Luau Code Vault
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/80 hover:text-cream transition-colors">
                  About the Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links (Admin Sign In removed) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cream/50">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-cream/80 hover:text-cream transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-cream/80 hover:text-cream transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Mandatory Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right max-w-md text-[11px] leading-relaxed">
            Independent consultancy. We are not affiliated with, endorsed by, or sponsored by Roblox Corporation or Anthropic.
          </p>
        </div>
      </div>
    </footer>
  );
}
