/* Testimonials.jsx */
const TESTIMONIALS = [
  {
    quote: 'Ascend is the only outside team we let touch production code. They read our legacy stack faster than engineers we hired full-time.',
    name: 'Priya Shankar',
    role: 'COO, Meridian Freight',
    meta: '18-month engagement',
  },
  {
    quote: 'I came in expecting a dev shop. I got a product team. The architecture doc they delivered in week two was better than what we paid a Big 4 firm $400K for.',
    name: 'Jordan Albrecht',
    role: 'CEO, Keystone Health Partners',
    meta: '9-month engagement',
  },
  {
    quote: 'They told us what not to build. That alone paid for the engagement.',
    name: 'Marcus Okafor',
    role: 'Managing Partner, Blackwood & Co.',
    meta: '6-month engagement',
  },
];

const Testimonials = () => (
  <section className="section section-darker" style={{ padding: '120px 32px' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div className="eyebrow no-bar" style={{ justifyContent: 'center' }}>What clients say</div>
        <h2 style={{ marginTop: 18, color: '#fff', fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          The work speaks.<br />So do they.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="testimonial-grid">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} style={{
            margin: 0, padding: '36px 32px',
            background: 'var(--color-primary)',
            border: '1px solid var(--color-primary-lighter)',
            borderRadius: 12,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 320,
          }}>
            <div>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" style={{ marginBottom: 20 }}>
                <path d="M0 22V13.2C0 9.4 0.9 6.3 2.7 4C4.5 1.6 7.3 0.3 11 0V4.4C8.9 4.8 7.4 5.6 6.5 6.8C5.6 8 5.2 9.6 5.2 11.5H11V22H0ZM17 22V13.2C17 9.4 17.9 6.3 19.7 4C21.5 1.6 24.3 0.3 28 0V4.4C25.9 4.8 24.4 5.6 23.5 6.8C22.6 8 22.2 9.6 22.2 11.5H28V22H17Z" fill="var(--color-accent)"/>
              </svg>
              <blockquote style={{
                margin: 0, fontSize: 19, lineHeight: 1.5,
                color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.005em',
              }}>"{t.quote}"</blockquote>
            </div>
            <figcaption style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-primary-lighter)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary-lighter), var(--color-primary-light))',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-accent)', fontWeight: 500,
                }}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t.role}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginTop: 14 }}>
                → {t.meta}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { Testimonials });
