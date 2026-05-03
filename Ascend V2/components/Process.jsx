/* Process.jsx — How we work */
const STEPS = [
  {
    w: 'Week 01',
    title: 'Discovery',
    body: 'Two weeks of deep workshops. We map your systems, interview stakeholders, and return a scoped blueprint — or refund it.',
    artifact: 'Engagement blueprint · Fixed-fee $12K',
  },
  {
    w: 'Week 02–04',
    title: 'Architecture',
    body: 'Your staff engineer pairs with ours. We decide the stack, data model, migration path, and the exact sequence of shipped value.',
    artifact: 'Architecture RFC · Reviewed by your team',
  },
  {
    w: 'Week 04–12',
    title: 'Build & ship',
    body: 'Weekly demos. Continuous deployment. You see production-grade code from week three, not week twelve.',
    artifact: 'Production release · On your infra, your repo',
  },
  {
    w: 'Ongoing',
    title: 'Ascend',
    body: 'We stay as long as you need us — or hand the keys to your team. No lock-in, no mystery code, no surprise invoices.',
    artifact: 'Handoff package · Full docs + runbook',
  },
];

const Process = () => {
  return (
    <section id="process" className="section section-dark">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, marginBottom: 80 }} className="services-head">
          <div>
            <div className="eyebrow">How we work</div>
            <h2 style={{ marginTop: 18, color: '#fff', fontSize: 'clamp(36px, 4.5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              A deliberate climb,<br />not a sprint.
            </h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', maxWidth: 540, alignSelf: 'end' }}>
            Four phases. Every one produces an artifact you own. Every one has a kill switch.
            This is what makes legacy modernization survivable.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* connecting line */}
          <div style={{
            position: 'absolute', top: 40, left: '8%', right: '8%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(196,90,44,0.5), rgba(196,90,44,0.5), transparent)',
          }} className="process-line" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="process-grid">
            {STEPS.map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary-lighter)',
                  display: 'grid', placeItems: 'center', margin: '0 0 28px',
                  position: 'relative', zIndex: 2,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>
                    0{i+1}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 10 }}>
                  {s.w}
                </div>
                <h3 style={{ color: '#fff', fontSize: 24, letterSpacing: '-0.02em', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>{s.body}</p>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
                  padding: '10px 0', borderTop: '1px solid var(--color-primary-lighter)',
                }}>
                  → {s.artifact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Process });
