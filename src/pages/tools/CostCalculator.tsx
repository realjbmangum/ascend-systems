import { useState, type FormEvent } from 'react';
import SEO from '../../components/SEO';
import { api } from '../../lib/api';

type CalcResult = {
  base_waste: number;
  error_overhead: number;
  customer_cost: number;
  total_annual: number;
  total_monthly: number;
  build_band: 'diy' | 'light' | 'custom' | 'strategic';
  build_price_low: number;
  build_price_high: number;
  payback_months_low: number;
  payback_months_high: number;
  recommendation: string;
};

const BAND_LABEL: Record<CalcResult['build_band'], string> = {
  diy: 'DIY (no-code)',
  light: 'Light automation',
  custom: 'Custom build',
  strategic: 'Strategic platform',
};

const IMPACT_OPTIONS = [
  { value: 'none', label: 'Internal only — no direct customer impact' },
  { value: 'slows', label: 'Slows our responses to customers' },
  { value: 'loses', label: 'We lose deals or get complaints because of it' },
];

function fmtMoney(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

export default function CostCalculator() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    hours_per_week: '',
    hourly_cost: '',
    error_rate: '',
    customer_impact: '',
    process_description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<CalcResult | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email';
    const hpw = parseFloat(form.hours_per_week);
    if (!form.hours_per_week || isNaN(hpw) || hpw <= 0)
      errs.hours_per_week = 'Enter the hours per week';
    const hc = parseFloat(form.hourly_cost);
    if (!form.hourly_cost || isNaN(hc) || hc <= 0)
      errs.hourly_cost = 'Enter an hourly cost';
    const er = parseFloat(form.error_rate);
    if (form.error_rate === '' || isNaN(er) || er < 0 || er > 100)
      errs.error_rate = 'Enter a number between 0 and 100';
    if (!form.customer_impact)
      errs.customer_impact = 'Pick one';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await api.submitCostCalculator({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        hours_per_week: parseFloat(form.hours_per_week),
        hourly_cost: parseFloat(form.hourly_cost),
        error_rate: parseFloat(form.error_rate),
        customer_impact: form.customer_impact,
        process_description: form.process_description.trim() || undefined,
      });
      setResult(res.result);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <>
      <SEO
        title="Manual Process Cost Calculator | Ascend Systems"
        description="See how much your team's manual work is costing you every year. Free calculator + personalized email report. Charlotte-based tech consultancy."
      />

      {/* Hero */}
      <section className="relative bg-charcoal py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light opacity-95" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange mb-4">
            Free tool · 60 seconds
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            How Much Is Your Manual Work Costing You?
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Four numbers, one honest answer. We will email you a full breakdown plus a recommended next step — no sales pitch.
          </p>
        </div>
      </section>

      {/* Result section (shown after submit) */}
      {status === 'success' && result && (
        <section
          className="bg-white py-16 sm:py-20"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-charcoal text-white p-8 sm:p-12 shadow-lg">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange mb-3">
                Annual cost of the manual process
              </p>
              <p className="text-5xl sm:text-6xl font-bold tracking-tight">
                {fmtMoney(result.total_annual)}
              </p>
              <p className="mt-3 text-gray-400 text-base">
                ~{fmtMoney(result.total_monthly)} every month, before opportunity cost.
              </p>
            </div>

            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-gray-500 mb-4">
                How the number breaks down
              </p>
              <div className="border-t border-gray-200">
                <ResultRow label="Direct labor (hours × wage × 52 weeks)" value={fmtMoney(result.base_waste)} />
                <ResultRow label="Error and rework overhead" value={fmtMoney(result.error_overhead)} />
                <ResultRow label="Customer impact (slow responses, lost deals)" value={fmtMoney(result.customer_cost)} />
                <div className="flex items-center justify-between py-4 border-t-2 border-charcoal">
                  <span className="font-bold text-charcoal">Total annual cost</span>
                  <span className="font-bold text-charcoal text-lg">{fmtMoney(result.total_annual)}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-xl border-l-4 border-orange bg-orange-glow p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-orange-dark mb-2">
                Recommendation: {BAND_LABEL[result.build_band]}
              </p>
              <p className="text-charcoal text-base sm:text-lg leading-relaxed">
                {result.recommendation}
              </p>
            </div>

            {result.build_price_low > 0 && (
              <div className="mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-gray-500 mb-4">
                  Typical investment for this kind of work
                </p>
                <div className="border-t border-gray-200">
                  <ResultRow label="Build investment range" value={`${fmtMoney(result.build_price_low)} – ${fmtMoney(result.build_price_high)}`} />
                  <ResultRow
                    label="Expected payback"
                    value={
                      result.payback_months_low === result.payback_months_high
                        ? `${result.payback_months_low} months`
                        : `${result.payback_months_low}–${result.payback_months_high} months`
                    }
                  />
                </div>
              </div>
            )}

            <div className="mt-12 rounded-2xl bg-charcoal text-white p-8 sm:p-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Want a free 30-minute audit?</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
                I will look at your specific process with you, point out the highest-leverage fix, and give you a written next-step plan. No pitch.
              </p>
              <a
                href="/contact"
                className="inline-block bg-orange hover:bg-orange-light text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Book the audit →
              </a>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              We also sent this report to <span className="font-mono text-charcoal">{form.email}</span>.
            </p>
          </div>
        </section>
      )}

      {/* Form */}
      {status !== 'success' && (
        <section className="bg-white py-16 sm:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label="Manual process cost calculator">
              {status === 'error' && (
                <div
                  className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-1">About the process</h2>
                <p className="text-gray-500 text-sm">Think of the single biggest manual / spreadsheet task your team repeats every week.</p>
              </div>

              <Field
                id="hours_per_week"
                label="Hours per week your team spends on it (total, across everyone)"
                hint="Add up across the whole team. If two people each spend 5 hrs/wk, enter 10."
                type="number"
                step="0.5"
                min="0"
                value={form.hours_per_week}
                onChange={(v) => update('hours_per_week', v)}
                error={errors.hours_per_week}
                placeholder="e.g. 12"
                suffix="hrs/week"
              />

              <Field
                id="hourly_cost"
                label="Average fully-loaded hourly cost"
                hint="Salary + benefits + overhead divided by working hours. Round up. $45–$75 is typical for ops staff in Charlotte."
                type="number"
                step="1"
                min="0"
                value={form.hourly_cost}
                onChange={(v) => update('hourly_cost', v)}
                error={errors.hourly_cost}
                placeholder="e.g. 55"
                prefix="$"
                suffix="/ hour"
              />

              <Field
                id="error_rate"
                label="Error / rework rate"
                hint="What % of the time does something need to be fixed, redone, or chased after the fact? Be honest — 10–20% is common."
                type="number"
                step="1"
                min="0"
                max="100"
                value={form.error_rate}
                onChange={(v) => update('error_rate', v)}
                error={errors.error_rate}
                placeholder="e.g. 15"
                suffix="%"
              />

              <fieldset
                className="border-0 p-0 m-0"
                aria-describedby={errors.customer_impact ? 'customer_impact-error' : undefined}
                aria-invalid={errors.customer_impact ? true : undefined}
              >
                <legend className="block text-sm font-medium text-charcoal mb-1.5 p-0">
                  Customer impact <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </legend>
                <div className="space-y-2" role="radiogroup" aria-required="true">
                  {IMPACT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                        form.customer_impact === opt.value
                          ? 'border-orange bg-orange-glow'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="customer_impact"
                        value={opt.value}
                        checked={form.customer_impact === opt.value}
                        onChange={(e) => update('customer_impact', e.target.value)}
                        className="mt-1 accent-orange"
                      />
                      <span className="text-charcoal text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <p
                  id="customer_impact-error"
                  className="mt-1 text-sm text-red-500"
                  aria-live="polite"
                  role={errors.customer_impact ? 'alert' : undefined}
                >
                  {errors.customer_impact || ''}
                </p>
              </fieldset>

              <div>
                <label htmlFor="process_description" className="block text-sm font-medium text-charcoal mb-1.5">
                  Briefly, what is the process? <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="process_description"
                  rows={3}
                  value={form.process_description}
                  onChange={(e) => update('process_description', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                  placeholder="e.g. Our ops team copies quote info from email into a spreadsheet, then re-keys it into QuickBooks and our scheduling tool."
                  aria-describedby="process_description-hint"
                />
                <p id="process_description-hint" className="mt-1 text-xs text-gray-500">If you write a line here, the email report comes with a more specific recommendation.</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-charcoal mb-1">Where to send the report</h2>
                <p className="text-gray-500 text-sm mb-5">One email. No newsletter spam. Unsubscribe is one click.</p>

                <div className="grid sm:grid-cols-2 gap-5">
                  <SimpleField
                    id="name"
                    label="Your name"
                    required
                    value={form.name}
                    onChange={(v) => update('name', v)}
                    error={errors.name}
                    placeholder="Brian"
                  />
                  <SimpleField
                    id="email"
                    label="Work email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                    error={errors.email}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="mt-5">
                  <SimpleField
                    id="company"
                    label="Company"
                    optional
                    value={form.company}
                    onChange={(v) => update('company', v)}
                    error={errors.company}
                    placeholder="(optional)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-orange hover:bg-orange-light disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors text-base"
              >
                {status === 'submitting' ? 'Calculating…' : 'Show me the number'}
              </button>

              <p className="text-center text-xs text-gray-500">
                Estimates are order-of-magnitude. We do not sell or share your email.
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <span className="text-charcoal text-sm sm:text-base">{label}</span>
      <span className="text-charcoal font-semibold tabular-nums">{value}</span>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
};

function Field({ id, label, hint, type = 'text', step, min, max, value, onChange, error, placeholder, prefix, suffix }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  const describedBy = [hintId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-charcoal mb-1.5">
        {label} <span className="text-red-500" aria-hidden="true">*</span>
        <span className="sr-only"> (required)</span>
      </label>
      {hint && <p id={hintId} className="text-xs text-gray-500 mb-2">{hint}</p>}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
            prefix ? 'pl-7' : ''
          } ${suffix ? 'pr-24' : ''} ${error ? 'border-red-400' : 'border-gray-300'}`}
          placeholder={placeholder}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

type SimpleFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
};

function SimpleField({ id, label, required, optional, type = 'text', value, onChange, error, placeholder }: SimpleFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-charcoal mb-1.5">
        {label}
        {required && (
          <>
            <span className="text-red-500" aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
        {optional && <span className="text-gray-400"> (optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
