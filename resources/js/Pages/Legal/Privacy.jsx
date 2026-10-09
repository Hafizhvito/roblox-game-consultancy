import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Section from '../../Components/Section';
import Badge from '../../Components/Badge';
import { isPlaceholderEmail } from '../../Utils/email';

export default function Privacy() {
  const { props } = usePage();
  const business = props.business || { email: '[EMAIL_PERUSAHAAN]' };

  return (
    <AppLayout
      title="Privacy Policy"
      description="How we collect, handle, and protect your information when inquiring or working with our consultancy."
    >
      <section className="bg-cream border-b border-ink/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge color="cream">Legal Documentation</Badge>
          <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight mt-3">
            Privacy Policy
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
              1. Information We Collect
            </h2>
            <p>
              When you submit an inquiry through our contact form, we collect your name, email, project type, budget range, and message, and store these records securely in our database.
            </p>
            <p>
              When you participate in early access waitlists or direct correspondence, we may also receive your Discord handle or phone number if you choose to provide them.
            </p>
            <p>
              We also collect technical telemetry (such as your IP address and browser user agent) strictly to protect our contact form against automated spam and abuse.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              2. How We Use Your Data
            </h2>
            <p>
              We use your submitted details exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Evaluate project fit and deliver requested consultation proposals</li>
              <li>Communicate directly regarding active client deliverables and schedules</li>
              <li>Comply with legitimate tax and invoicing requirements under Indonesian law</li>
            </ul>
            <p>
              We do not sell, rent, or trade your contact information to third parties, advertising networks, or data brokers.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              3. Confidentiality and Code Security
            </h2>
            <p>
              Any game design documents, place files, Luau scripts, or financial metrics shared with our consultancy are treated as strictly confidential. We are glad to sign a mutual Non-Disclosure Agreement (NDA) prior to receiving proprietary source files.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              4. Cookies and Analytics
            </h2>
            <p>
              Our website uses only necessary operational session cookies required for form security (CSRF protection) and basic performance caching. We do not use third-party invasive cross-site tracking cookies.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink font-semibold mb-3">
              5. Your Rights and Contact
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you or request that we delete your inquiry records from our database. To make a request, contact us at{' '}
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
