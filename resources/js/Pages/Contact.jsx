import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import { Input, Textarea, Select } from '../Components/Input';
import { IconMail, IconChat, IconShield, IconCheck } from '../Components/Icons';
import { isPlaceholderEmail } from '../Utils/email';

export default function Contact({ businessEmail, businessWhatsapp }) {
  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    name: '',
    email: '',
    project_type: '',
    budget_range: '',
    message: '',
    website: '', // honeypot: hidden from real users
  });

  // Check URL params for preselection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      const packageParam = params.get('package');

      if (serviceParam) {
        if (serviceParam.includes('concept')) setData('project_type', 'game-concept');
        else if (serviceParam.includes('scripting')) setData('project_type', 'scripting');
        else if (serviceParam.includes('economy')) setData('project_type', 'monetisation');
        else if (serviceParam.includes('ui')) setData('project_type', 'ui-ux');
        else if (serviceParam.includes('launch')) setData('project_type', 'launch');
      }

      if (packageParam) {
        if (packageParam === 'starter') setData('budget_range', 'under-2m');
        else if (packageParam === 'studio') setData('budget_range', '5m-15m');
        else if (packageParam === 'brand') setData('budget_range', 'over-15m');
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/contact', {
      onSuccess: () => reset(),
    });
  };

  const projectTypeOptions = [
    { value: 'game-concept', label: 'Game Concept & Design' },
    { value: 'scripting', label: 'Luau Scripting & Architecture Review' },
    { value: 'monetisation', label: 'Monetisation & Economy Modeling' },
    { value: 'ui-ux', label: 'UI/UX Design for Roblox' },
    { value: 'launch', label: 'Launch & Live-Ops Advisory' },
    { value: 'other', label: 'Other Custom Consultation' },
  ];

  const budgetOptions = [
    { value: 'under-2m', label: 'Under Rp 2.000.000 (~$125 USD) (Starter scope)' },
    { value: '2m-5m', label: 'Rp 2.000.000 to Rp 5.000.000 (~$125 to $350 USD)' },
    { value: '5m-15m', label: 'Rp 5.000.000 to Rp 15.000.000 (~$350 to $1,000 USD) (Studio scope)' },
    { value: 'over-15m', label: 'Over Rp 15.000.000 (~$1,000+ USD) (Brand scope)' },
    { value: 'not-sure', label: 'Not sure yet (Need estimation)' },
  ];

  const whatsappClean = businessWhatsapp ? businessWhatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <AppLayout
      title="Contact: Start a Project"
      description="Tell us about your Roblox game. We review all submissions within two business days."
    >
      {/* ── HEADER ── */}
      <section className="bg-peach/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge color="peach">Get in Touch</Badge>
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
              Let us talk about your Roblox experience.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Fill out the form below or message us directly. We respond with thoughtful feedback and clear next steps within two business days.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORM & CHANNELS ── */}
      <Section background="cream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ink/10 shadow-xs">
              <h2 className="font-display text-2xl text-ink font-semibold mb-6">
                Project Inquiry Form
              </h2>

              {wasSuccessful && (
                <div className="mb-6 p-4 rounded-xl bg-mint text-ink text-sm flex items-start gap-3 border border-ink/10">
                  <IconCheck className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Inquiry received!</span>
                    <span>Thank you for reaching out. We have sent a confirmation email and will review your submission shortly.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot field: hidden from real users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Leave this field blank</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    value={data.website}
                    onChange={(e) => setData('website', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name"
                    name="name"
                    required
                    placeholder="e.g. Alex Pratama"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@studio.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Service Area"
                    name="project_type"
                    required
                    placeholder="Select service..."
                    options={projectTypeOptions}
                    value={data.project_type}
                    onChange={(e) => setData('project_type', e.target.value)}
                    error={errors.project_type}
                  />

                  <Select
                    label="Estimated Budget"
                    name="budget_range"
                    required
                    placeholder="Select budget..."
                    options={budgetOptions}
                    value={data.budget_range}
                    onChange={(e) => setData('budget_range', e.target.value)}
                    error={errors.budget_range}
                  />
                </div>

                <Textarea
                  label="Tell us about the project"
                  name="message"
                  required
                  rows={5}
                  placeholder="Share details: game link or genre, current team size, what is working well, and what you would like us to review."
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  error={errors.message}
                  helperText="Minimum 20 characters. Include any Roblox links if available."
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={processing}
                    className="w-full sm:w-auto"
                  >
                    {processing ? 'Submitting...' : 'Send Inquiry'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Direct Channels & Expectations */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card */}
            <div className="p-8 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6">
              <div>
                <Badge color="butter" size="sm">Direct Channels</Badge>
                <h3 className="font-display text-xl text-ink font-semibold mt-2">
                  Prefer a direct message?
                </h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Feel free to write to our business domain or send a quick note over WhatsApp for scheduling.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {isPlaceholderEmail(businessEmail) ? (
                  <div className="p-4 rounded-2xl bg-cream border border-ink/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center text-ink shrink-0">
                      <IconMail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft block">
                        Direct Email
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {businessEmail}
                      </span>
                    </div>
                  </div>
                ) : (
                  <a
                    href={`mailto:${businessEmail}`}
                    className="p-4 rounded-2xl bg-cream border border-ink/10 flex items-center gap-4 hover:border-ink/30 transition-colors block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center text-ink shrink-0">
                      <IconMail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft block">
                        Direct Email
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {businessEmail}
                      </span>
                    </div>
                  </a>
                )}

                {businessWhatsapp && (
                  <a
                    href={`https://wa.me/${whatsappClean}?text=Halo%2C%20saya%20ingin%20konsultasi%20seputar%20proyek%20Roblox%20game.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-cream border border-ink/10 flex items-center gap-4 hover:border-ink/30 transition-colors block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center text-ink shrink-0">
                      <IconChat className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft block">
                        WhatsApp Business
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {businessWhatsapp}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Response Time Guarantee Card */}
            <div className="p-8 rounded-3xl bg-[#F7FAF8] border border-ink/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center text-ink">
                  <IconShield className="w-4 h-4" />
                </div>
                <h4 className="font-display text-base text-ink font-semibold">
                  What happens next?
                </h4>
              </div>
              <ul className="text-xs text-ink-soft space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
                  <span>We confirm receipt within 24 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
                  <span>We review your links and documentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
                  <span>We schedule a 30-minute discovery video call or reply with written advice.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </AppLayout>
  );
}
