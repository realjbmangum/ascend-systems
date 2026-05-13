interface Client {
  name: string;
  logo?: string;
}

const TrustedBySection = () => {
  const clients: Client[] = [
    { name: 'City of Charlotte', logo: '/images/city.png' },
    { name: 'Stancil Services', logo: '/images/stancil.png' },
  ];

  const row = clients;

  return (
    <section
      className="section section-light"
      style={{
        padding: '56px 0',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-gray-200)',
        borderBottom: '1px solid var(--color-gray-200)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 28,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-gray-600)',
        }}
      >
        — Recent engagements —
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 64,
          flexWrap: 'wrap',
          padding: '0 32px',
        }}
      >
        {row.map((client, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
            }}
          >
            {client.logo ? (
              <img
                src={client.logo}
                alt={client.name}
                style={{
                  maxHeight: 50,
                  maxWidth: 200,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  textAlign: 'center',
                }}
              >
                {client.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBySection;
