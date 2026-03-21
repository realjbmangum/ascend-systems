import { useState, type FormEvent } from 'react';
import { siteConfig } from '../config/site';
import { api } from '../lib/api';

const projectTypes = [
  'Web/App Development',
  'AI Integration',
  'Business Automation',
  'AI Phone Solution',
  'Other',
];

const budgetRanges = [
  'Under $5k',
  '$5k–$15k',
  '$15k–$50k',
  '$50k+',
  'Not sure',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    project_type: '',
    budget_range: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      await api.submitLead(form);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  return (
    <>
      {/* Hero */}
      <section className="reveal bg-charcoal py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Tell Us What You're Building
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every great project starts with a conversation. Tell us what you need and we'll figure out the best path forward — together.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="reveal bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* LEFT — Form (3 cols) */}
            <div className="lg:col-span-3">
              {status === 'success' ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-8 text-center">
                  <svg
                    className="w-12 h-12 text-green-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-charcoal mb-2">
                    Thanks! We'll be in touch within 24 hours.
                  </h3>
                  <p className="text-gray-500">
                    We received your message and will reach out soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {status === 'error' && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                        errors.name ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-charcoal mb-1.5">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                      placeholder="Your company (optional)"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor="project_type" className="block text-sm font-medium text-charcoal mb-1.5">
                      Project Type
                    </label>
                    <select
                      id="project_type"
                      value={form.project_type}
                      onChange={(e) => update('project_type', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budget_range" className="block text-sm font-medium text-charcoal mb-1.5">
                      Budget Range
                    </label>
                    <select
                      id="budget_range"
                      value={form.budget_range}
                      onChange={(e) => update('budget_range', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                    >
                      <option value="">Select a range</option>
                      {budgetRanges.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange resize-y ${
                        errors.message ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto bg-orange hover:bg-orange-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT — Contact info + Calendly (2 cols) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-6">
                  Prefer to talk?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-orange mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-charcoal hover:text-orange transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-orange mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}
                      className="text-charcoal hover:text-orange transition-colors"
                    >
                      {siteConfig.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-orange mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span className="text-charcoal">{siteConfig.location}</span>
                  </li>
                </ul>
              </div>

              {/* Calendly */}
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">
                  Book a Discovery Call
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Pick a time that works for you and we'll have a quick chat about your project.
                </p>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={siteConfig.calendlyUrl}
                    title="Book a Discovery Call"
                    width="100%"
                    height="660"
                    frameBorder="0"
                    className="block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
