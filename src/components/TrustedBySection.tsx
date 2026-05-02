interface Client {
  name: string;
  logo?: string;
}

const TrustedBySection = () => {
  const clients: Client[] = [
    { name: 'City of Charlotte', logo: '/images/city.png' },
    { name: 'Stancil Services', logo: '/images/stancil.png' },
    { name: 'Carolina Masonry' },
    { name: 'SuiteManager' },
  ];

  const row = [...clients, ...clients];

  return (
    <section
      className="section section-darker"
      style={{
        padding: '56px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 36,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        — Trusted by operators across the Carolinas —
      </div>
      <div style={{ position: 'relative' }}>
        <div className="marquee-track">
          {row.map((client, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 180,
                height: 60,
              }}
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  style={{
                    maxHeight: 50,
                    maxWidth: 160,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    padding: '0 16px',
                  }}
                >
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background:
              'linear-gradient(90deg, var(--color-primary-darker), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background:
              'linear-gradient(-90deg, var(--color-primary-darker), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
};

export default TrustedBySection;
