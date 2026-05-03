/* Nav.jsx */
const Nav = ({ variant }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Stack', href: '#stack' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(20,20,21,0.78)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      transition: 'all 200ms var(--ease-out)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '18px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <a href="#top" style={{
          display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
        }}>
          <img src="assets/logo.png" style={{ width: 30, height: 30, display: 'block' }} alt="" />
          <span style={{
            fontWeight: 800, fontSize: 13,
            color: '#fff', letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>Ascend Systems</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            paddingLeft: 12, marginLeft: 4,
          }}>v2026</span>
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
              fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
              transition: 'color 150ms var(--ease-out)',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.72)'}
            >{l.label}</a>
          ))}
          <a href="#contact" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
            Book a call <span style={{ opacity: 0.7 }}>→</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

Object.assign(window, { Nav });
