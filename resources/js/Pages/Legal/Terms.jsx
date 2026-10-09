import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Section from '../../Components/Section';
import Badge from '../../Components/Badge';
import { isPlaceholderEmail } from '../../Utils/email';

export default function Terms() {
  const { props } = usePage();
  const business = props.business || { email: '[EMAIL_PERUSAHAAN]' };

  return (
    <AppLayout
      title="Terms of Service"
      description="Standard consulting terms, deliverable definitions, and platform disclaimer."
    >
      <section className="bg-cream border-b border-ink/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge color="cream">Legal Documentation</Badge>
          <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight mt-3">
            Terms of Service
          </h1>
          <p className="text-xs text-ink-soft mt-2 font-mono">
            Last revised: October 2026
          </p>
        </div>
      </section>

      <Section background="white">
        <div className="max-w-4xl mx-auto prose prose-ink max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-ink/90">
          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              1. Consulting Engagements and Scope
            </h2>
            <p>
              All advisory services provided by our studio are governed by written scope agreements confirmed before work begins. Services include code reviews, game architecture guidance, economy audits, and launch roadmaps. Deliverables are provided as advisory recommendations and documentation.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              2. Independent Consultancy & Platform Notice
            </h2>
            <p>
              We are an independent software and game consultancy. <strong>We are not affiliated with, sponsored by, or endorsed by Roblox Corporation.</strong> "Roblox" is a registered trademark of Roblox Corporation. Our advisory operates within all applicable Roblox Terms of Use and Community Standards.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              3. Intellectual Property Rights
            </h2>
            <p>
              You retain 100% ownership of your game concepts, places, characters, branding, and proprietary assets. Any bespoke documentation, spreadsheets, or code examples created specifically for your engagement become your property upon full receipt of agreed payment.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              4. Payment and Invoicing
            </h2>
            <p>
              Unless otherwise specified in a custom contract, consulting fees are quoted in Indonesian Rupiah (IDR). Invoices must be settled in accordance with milestone payment terms before final documentation handover.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              5. No Guarantees of Platform Performance
            </h2>
            <p>
              While our advice is founded on deep platform experience and verified software practices, the Roblox discovery algorithm, concurrent player volumes, and user acquisition metrics are influenced by broader market factors. We cannot guarantee specific concurrent user counts, front-page placements, or financial revenues.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              6. Governing Jurisdiction
            </h2>
            <p>
              These terms are construed in accordance with the laws of the Republic of Indonesia. Any disputes arising in connection with our services will be resolved through good-faith mediation prior to formal legal action.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              7. Contact and Inquiries
            </h2>
            <p>
              For questions regarding these terms or formal advisory requests, contact us at{' '}
              {isPlaceholderEmail(business.email) ? (
                <span className="font-medium text-ink">{business.email}</span>
              ) : (
                <a href={`mailto:${business.email}`} className="text-ink underline">
                  {business.email}
                </a>
              )}
              .
            </p>
          </div>
        </div>
      </Section>
    </AppLayout>
  );
}
