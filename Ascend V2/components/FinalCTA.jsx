/* FinalCTA.jsx + Footer.jsx */
const FinalCTA = () => {
  return (
    <section id="contact" style={{
      position: 'relative', overflow: 'hidden',
      background: `
        linear-gradient(180deg, rgba(20,20,21,0.82) 0%, rgba(20,20,21,0.95) 100%),
        url('assets/hero-bg.jpg')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      color: '#fff',
      padding: '140px 32px',
    }}>
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 72, alignItems: 'center' }} className="cta-grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>Ready when you are</div>
            <h2 className="display" style={{ color: '#fff', marginBottom: 28, fontSize: 'clamp(44px, 6vw, 88px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              Ship what your<br />
              team has been<br />
              <span style={{ color: 'var(--color-accent)' }}>promising</span> for years.
            </h2>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)', maxWidth: 520, marginBottom: 40 }}>
              30-minute discovery call. No slides, no sales engineer. Just a direct conversation with the person who'll run your engagement.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#" className="btn btn-primary btn-lg">Book a discovery call <span>→</span></a>
              <a href="mailto:hello@ascend.systems" className="btn btn-ghost-dark btn-lg">hello@ascend.systems</a>
            </div>
          </div>
          <div style={{
            background: 'rgba(20,20,21,0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
            padding: 36,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 20 }}>
              What to expect
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { t: '30 minutes', d: 'No slides. Your problem, our questions.' },
                { t: 'Within 48h', d: 'Written recap with our read on scope + fit.' },
                { t: 'If a fit', d: 'Two-week paid discovery, or a polite no.' },
              ].map((x, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-accent)', letterSpacing: '0.02em' }}>
                    {String(i+1).padStart(2,'0')} · {x.t}
                  </div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{
    background: 'var(--color-primary-darker)',
    color: 'rgba(255,255,255,0.7)',
    padding: '72px 32px 40px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }} className="footer-grid">
        <div>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
            <img src="assets/logo.png" style={{ width: 32, height: 32 }} alt="" />
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Ascend Systems</span>
          </a>
          <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 360, color: 'rgba(255,255,255,0.55)' }}>
            A senior product team for mid-market operators. Custom SaaS, AI, and internal tools, built in Charlotte, North Carolina.
          </p>
          <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            35.2271° N · 80.8431° W
          </div>
        </div>
        {[
          { label: 'Services', items: ['Custom SaaS', 'AI agents', 'Internal tools', 'Legacy modernization', 'CTO-as-a-service'] },
          { label: 'Company', items: ['About', 'Work', 'Journal', 'Careers', 'Contact'] },
          { label: 'Reach us', items: ['hello@ascend.systems', '(704) 555-0118', '300 S Tryon St, Charlotte NC', 'LinkedIn', 'GitHub'] },
        ].map(col => (
          <div key={col.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 18 }}>
              {col.label}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.items.map(i => (
                <li key={i}><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, transition: 'color 120ms' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: 12, color: 'rgba(255,255,255,0.4)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
      }}>
        <div>© 2026 Lighthouse 27 LLC · d/b/a Ascend Systems · All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { FinalCTA, Footer });
