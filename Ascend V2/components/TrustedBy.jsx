/* TrustedBy.jsx — logo marquee */
const TrustedBy = () => {
  const logos = [
    'MERIDIAN', 'Blackwood &Co.', 'CAROLINA FREIGHT', 'PINEHURST GROUP',
    'Atlas Logistics', 'REDOAK CAPITAL', 'Keystone Health', 'NORTHWOOD',
    'HearthStone', 'SOUTHBRIDGE', 'Vanguard Mfg.', 'CHARLOTTE LEGAL',
  ];
  const row = [...logos, ...logos];
  return (
    <section className="section section-darker" style={{ padding: '56px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{
        textAlign: 'center', marginBottom: 36,
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
      }}>
        — Trusted by operators across the Carolinas —
      </div>
      <div style={{ position: 'relative' }}>
        <div className="marquee-track">
          {row.map((l, i) => (
            <span key={i} style={{
              fontFamily: l === l.toUpperCase() ? 'var(--font-body)' : 'Georgia, serif',
              fontWeight: l === l.toUpperCase() ? 700 : 400,
              fontStyle: l === l.toUpperCase() ? 'normal' : 'italic',
              fontSize: 22, letterSpacing: l === l.toUpperCase() ? '0.18em' : '-0.01em',
              color: 'rgba(255,255,255,0.55)',
              whiteSpace: 'nowrap',
            }}>{l}</span>
          ))}
        </div>
        {/* fades */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(90deg, var(--color-primary-darker), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(-90deg, var(--color-primary-darker), transparent)', pointerEvents: 'none' }} />
      </div>
    </section>
  );
};

Object.assign(window, { TrustedBy });
