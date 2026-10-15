import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ChatWidget from '../Components/ChatWidget';

export default function AppLayout({
  children,
  title,
  description,
}) {
  const { flash, business } = usePage().props;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const businessName = business?.name || '[BUSINESS_NAME]';
  const pageTitle = title ? `${title} · ${businessName}` : `${businessName} · Roblox Game Development Consultancy`;
  const metaDescription = description || business?.tagline || 'Roblox game consulting for indie creators, studios, and brands.';

  useEffect(() => {
    if (flash?.success) {
      setToastMessage(flash.success);
      setToastType('success');
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 6000);
      return () => clearTimeout(timer);
    }
    if (flash?.error) {
      setToastMessage(flash.error);
      setToastType('error');
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink antialiased selection:bg-peach selection:text-ink">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:site_name" content={businessName} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Flashed notification banner */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className={`sticky top-20 z-50 px-4 py-3 text-center text-sm font-medium transition-all animate-fade-rise ${
            toastType === 'success'
              ? 'bg-mint text-ink border-b border-ink/10'
              : 'bg-peach text-ink border-b border-ink/10'
          }`}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100"
              aria-label="Dismiss message"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <ChatWidget />
    </div>
  );
}
