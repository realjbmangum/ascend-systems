/* Hero.jsx — three variants chosen via prop */

const Hero = ({ variant, accent }) => {
  if (variant === 'bold') return <HeroBold accent={accent} />;
  if (variant === 'experimental') return <HeroExperimental accent={accent} />;
  return <HeroConservative accent={accent} />;
};

/* ---------- Stats strip ---------- */
const HeroStats = ({ items }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
    gap: 0, marginTop: 72,
    borderTop: '1px solid rgba(255,255,255,0.12)',
    paddingTop: 28,
  }}>
    {items.map((s, i) => (
      <div key={i} style={{
        paddingRight: 24,
        borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
        paddingLeft: i === 0 ? 0 : 24,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 500,
          color: 'var(--color-accent)', letterSpacing: '-0.02em', lineHeight: 1,
        }}>{s.num}</div>
        <div style={{
          fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)', marginTop: 10, fontWeight: 500,
        }}>{s.label}</div>
      </div>
    ))}
  </div>
);

/* ===== VARIANT 1: CONSERVATIVE ===== */
/* Classic premium consulting — full-bleed mountain, centered headline, subtle scroll cue */
const HeroConservative = () => (
  <section style={{
    position: 'relative',
    minHeight: '92vh',
    background: `
      linear-gradient(180deg, rgba(20,20,21,0.55) 0%, rgba(20,20,21,0.82) 65%, rgba(20,20,21,0.96) 100%),
      url('assets/hero-bg.jpg')`,
    backgroundSize: 'cover', backgroundPosition: 'center',
    color: '#fff',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  }}>
    <Nav />
    <div style={{
      maxWidth: 1280, margin: '0 auto', padding: '0 32px',
      width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: 80, paddingBottom: 80,
    }}>
      <div className="eyebrow" style={{ marginBottom: 32 }}>
        Charlotte, NC · Est. 2024
      </div>
      <h1 className="display-xl" style={{ color: '#fff', maxWidth: 1100, marginBottom: 32 }}>
        Software that moves<br />
        <span style={{ color: 'var(--color-accent)' }}>legacy businesses</span><br />
        forward.
      </h1>
      <p style={{
        fontSize: 20, lineHeight: 1.5, color: 'rgba(255,255,255,0.72)',
        maxWidth: 620, marginBottom: 44,
      }}>
        We partner with mid-market operators to replace aging systems with custom SaaS,
        AI automations, and internal tools — delivered by a senior team, built to last.
      </p>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="#contact" className="btn btn-primary btn-lg">Book a discovery call <span style={{ opacity: 0.7 }}>→</span></a>
        <a href="#work" className="btn btn-ghost-dark btn-lg">See our work</a>
      </div>
      <HeroStats items={[
        { num: '47', label: 'Engagements shipped' },
        { num: '$18M', label: 'Legacy systems retired' },
        { num: '11yr', label: 'Avg. engineer tenure' },
        { num: '4.9', label: 'Client NPS' },
      ]} />
    </div>
    <div style={{
      position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em',
      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 24, height: 1, background: 'currentColor' }}></span>
      Scroll
    </div>
  </section>
);

/* ===== VARIANT 2: BOLD ===== */
/* Split layout — type-led left, live "ascent" data panel right with summit imagery */
const HeroBold = () => (
  <section style={{
    position: 'relative',
    background: 'var(--color-primary-darker)',
    color: '#fff',
    overflow: 'hidden',
  }}>
    <Nav />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      maskImage: 'radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.9), transparent 70%)',
      WebkitMaskImage: 'radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.9), transparent 70%)',
      pointerEvents: 'none',
    }} />
    <div style={{
      maxWidth: 1280, margin: '0 auto', padding: '96px 32px 120px',
      position: 'relative',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 80,
        alignItems: 'center',
      }} className="hero-grid">
        <div>
          <div className="eyebrow" style={{ marginBottom: 28 }}>
            Mid-market · Legacy modernization
          </div>
          <h1 className="display-xl" style={{ color: '#fff', marginBottom: 28 }}>
            The best<br />
            code your<br />
            competitors<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>won't ship.</span>
          </h1>
          <p style={{
            fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,0.68)',
            maxWidth: 520, marginBottom: 40,
          }}>
            Ascend is the senior product team you deploy when a project is too
            strategic for an offshore shop and too specific for a big consultancy.
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn btn-primary btn-lg">Book a discovery call <span style={{ opacity: 0.7 }}>→</span></a>
            <a href="#work" className="btn btn-ghost-dark btn-lg">Case studies</a>
          </div>
        </div>
        <SummitPanel />
      </div>
      <HeroStats items={[
        { num: '47', label: 'Engagements shipped' },
        { num: '$18M', label: 'Legacy systems retired' },
        { num: '11yr', label: 'Avg. tenure' },
        { num: '4.9', label: 'Client NPS' },
      ]} />
    </div>
  </section>
);

const SummitPanel = () => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf; let start = performance.now();
    const loop = (now) => {
      setT(((now - start) / 6000) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const points = [
    { x: 0,   y: 78, label: 'Discovery' },
    { x: 22,  y: 68, label: 'Blueprint' },
    { x: 42,  y: 52, label: 'Build' },
    { x: 66,  y: 34, label: 'Ship' },
    { x: 88,  y: 18, label: 'Ascend' },
  ];
  const reached = Math.min(points.length, Math.floor(t * (points.length + 1)));

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
      border: '1px solid var(--color-primary-lighter)',
      borderRadius: 14,
      padding: 24,
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--color-accent)', boxShadow: '0 0 12px var(--color-accent)' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>engagement.track</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ASC-2026-048</span>
      </div>
      <svg viewBox="0 0 400 220" style={{ width: '100%', height: 260, display: 'block' }}>
        <defs>
          <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C45A2C" stopOpacity="0.5" />
            <stop offset="1" stopColor="#C45A2C" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* ridgeline */}
        <polyline
          points={points.map(p => `${(p.x/100)*380 + 10},${(p.y/100)*180 + 10}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* active path */}
        <polyline
          points={points.slice(0, reached).map(p => `${(p.x/100)*380 + 10},${(p.y/100)*180 + 10}`).join(' ')}
          fill="none" stroke="var(--color-accent)" strokeWidth="2"
        />
        {/* fill under active */}
        {reached > 1 && (
          <polygon
            points={[
              ...points.slice(0, reached).map(p => `${(p.x/100)*380 + 10},${(p.y/100)*180 + 10}`),
              `${(points[reached-1].x/100)*380 + 10},200`,
              `10,200`,
            ].join(' ')}
            fill="url(#peak)"
          />
        )}
        {points.map((p, i) => (
          <g key={i} transform={`translate(${(p.x/100)*380 + 10}, ${(p.y/100)*180 + 10})`}>
            <circle r={i === reached - 1 ? 6 : 3} fill={i < reached ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)'} />
            {i === reached - 1 && <circle r="10" fill="none" stroke="var(--color-accent)" strokeOpacity="0.4" />}
          </g>
        ))}
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginTop: 8 }}>
        {points.map((p, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: i < reached ? 'var(--color-accent)' : 'rgba(255,255,255,0.35)',
            textAlign: 'center',
          }}>{p.label}</div>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: '10px 14px',
        background: 'rgba(196,90,44,0.08)', borderRadius: 6,
        fontSize: 12, color: 'var(--color-accent-light)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
      }}>
        → Senior team · Fixed weekly cost · Ships in production in 30–90 days
      </div>
    </div>
  );
};

/* ===== VARIANT 3: EXPERIMENTAL ===== */
/* Oversized typographic hero w/ overlapping elevation contour layers */
const HeroExperimental = () => (
  <section style={{
    position: 'relative',
    background: '#0D0D0E',
    color: '#fff',
    overflow: 'hidden',
    paddingBottom: 0,
  }}>
    <Nav />
    {/* Contour layer */}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
      <ContourArt />
    </div>
    <div style={{
      maxWidth: 1400, margin: '0 auto', padding: '80px 32px 0',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 40, flexWrap: 'wrap', gap: 16,
      }}>
        <div className="eyebrow">
          <span style={{ background: 'var(--color-accent)', width: 8, height: 8, borderRadius: 99 }}></span>
          Accepting 3 engagements · Q2 2026
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em' }}>
          35.2271° N / 80.8431° W
        </div>
      </div>

      <h1 style={{
        fontWeight: 800,
        fontSize: 'clamp(64px, 14vw, 220px)',
        lineHeight: 0.88, letterSpacing: '-0.06em',
        color: '#fff', marginBottom: 48,
        textWrap: 'balance',
      }}>
        We build the<br />
        <span style={{ fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif', color: 'var(--color-accent)' }}>hard</span>
        <span>&nbsp;parts of</span><br />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 32px)' }}>
          <span>software</span>
          <span style={{
            display: 'inline-block', width: 'clamp(60px, 10vw, 140px)', height: '1.2ch',
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
            borderRadius: 4,
          }}></span>
        </span>
      </h1>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
        maxWidth: 1100, marginBottom: 80, paddingBottom: 80,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }} className="hero-exp-grid">
        <p style={{
          fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)',
          gridColumn: 'span 2',
        }}>
          We're a senior product studio for mid-market companies modernizing legacy systems. Custom SaaS, AI agents, internal tools — from scoping to production in 30–90 days.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="#contact" className="btn btn-primary btn-lg" style={{ justifyContent: 'space-between' }}>
            Book a discovery call <span>→</span>
          </a>
          <a href="#work" className="btn btn-ghost-dark btn-lg" style={{ justifyContent: 'space-between' }}>
            Browse case studies <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

const ContourArt = () => {
  const rings = Array.from({ length: 10 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="g" cx="78%" cy="62%" r="60%">
          <stop offset="0" stopColor="#C45A2C" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#C45A2C" stopOpacity="0.08" />
          <stop offset="1" stopColor="#C45A2C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1400" height="900" fill="url(#g)" />
      {rings.map(i => (
        <ellipse
          key={i}
          cx="1100" cy="600"
          rx={120 + i * 60}
          ry={80 + i * 42}
          fill="none"
          stroke={i < 3 ? '#C45A2C' : '#ffffff'}
          strokeOpacity={i < 3 ? 0.35 - i * 0.08 : 0.05 + (10 - i) * 0.008}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

Object.assign(window, { Hero });
