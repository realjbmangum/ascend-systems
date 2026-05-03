/* CaseStudies.jsx */
const CASES = [
  {
    client: 'Meridian Freight',
    vertical: 'Logistics · 340 employees',
    title: 'Retired a 22-year-old dispatch system without losing a shipment.',
    metric: '$4.2M',
    metricLabel: 'legacy infra retired',
    second: '0',
    secondLabel: 'customer-visible incidents',
    summary: 'Phased strangler-fig migration off an on-prem AS/400 to a custom TMS. 18 months, zero downtime, 3× throughput.',
    tags: ['Legacy modernization', 'Custom SaaS', '18-month engagement'],
    accent: '#C45A2C',
  },
  {
    client: 'Keystone Health Partners',
    vertical: 'Healthcare · 12 clinics',
    title: 'AI intake agent that clinicians actually trust.',
    metric: '42%',
    metricLabel: 'faster intake',
    second: '98.2%',
    secondLabel: 'chart accuracy',
    summary: 'Voice + chat intake with SOAP-note generation, HIPAA-scoped retrieval, and a human-in-the-loop review queue.',
    tags: ['AI agents', 'Regulated', '9-month engagement'],
    accent: '#C45A2C',
  },
  {
    client: 'Blackwood & Co.',
    vertical: 'Legal · Mid-market firm',
    title: 'Internal tooling that replaced five SaaS subscriptions.',
    metric: '$186K',
    metricLabel: 'annual SaaS retired',
    second: '5 → 1',
    secondLabel: 'tools in daily use',
    summary: 'Matter management, conflicts search, and a drafting copilot — built on one data model, owned by the firm.',
    tags: ['Internal tools', 'AI augmentation', '6-month engagement'],
    accent: '#C45A2C',
  },
];

const CaseStudies = () => {
  const [active, setActive] = React.useState(0);
  const c = CASES[active];
  return (
    <section id="work" className="section section-light" style={{ background: 'var(--color-gray-100)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="eyebrow">Selected work</div>
            <h2 style={{ marginTop: 18, fontSize: 'clamp(36px, 4.5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Shipped. In production.<br />Paying back.
            </h2>
          </div>
          <a href="#contact" className="btn btn-ghost-light">Full portfolio <span>↗</span></a>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 0,
          borderBottom: '1px solid var(--color-gray-200)',
          overflowX: 'auto',
        }}>
          {CASES.map((cs, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '18px 28px 20px', textAlign: 'left',
                borderBottom: active === i ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: -1,
                fontFamily: 'var(--font-body)',
                color: active === i ? 'var(--color-gray-900)' : 'var(--color-gray-600)',
                transition: 'all 160ms var(--ease-out)',
                minWidth: 220,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: active === i ? 'var(--color-accent)' : 'var(--color-gray-600)', marginBottom: 4 }}>0{i+1} / 0{CASES.length}</div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{cs.client}</div>
            </button>
          ))}
        </div>

        <div key={active} style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0,
          background: '#fff',
          border: '1px solid var(--color-gray-200)',
          borderTop: 'none',
          borderRadius: '0 0 14px 14px',
          overflow: 'hidden',
          animation: 'caseIn 400ms var(--ease-out)',
        }} className="case-layout">
          <div style={{ padding: '48px 48px 40px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gray-600)', marginBottom: 24 }}>
              {c.vertical}
            </div>
            <h3 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: 20, maxWidth: 560 }}>
              {c.title}
            </h3>
            <p className="muted" style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 520, marginBottom: 32 }}>{c.summary}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {c.tags.map(t => (
                <span key={t} style={{
                  padding: '6px 12px', borderRadius: 99,
                  background: 'var(--color-gray-100)', border: '1px solid var(--color-gray-200)',
                  fontSize: 12, fontWeight: 500, color: 'var(--color-gray-600)',
                  letterSpacing: '0.01em',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{
            background: 'var(--color-primary)', color: '#fff',
            padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            gap: 32, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,90,44,0.22), transparent 70%)',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Outcome</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 500, color: 'var(--color-accent)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
                {c.metric}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 10, letterSpacing: '0.01em' }}>{c.metricLabel}</div>
            </div>
            <div style={{ position: 'relative', paddingTop: 28, borderTop: '1px solid var(--color-primary-lighter)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>
                {c.second}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, fontWeight: 500 }}>
                {c.secondLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes caseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
};

Object.assign(window, { CaseStudies });
