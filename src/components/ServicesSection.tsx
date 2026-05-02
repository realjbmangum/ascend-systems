import { useState } from 'react';
import { motion } from 'framer-motion';

interface Service {
  n: string;
  title: string;
  body: string;
  bullets: string[];
  icon: 'saas' | 'ai' | 'dash' | 'legacy' | 'cto';
}

const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Custom SaaS development',
    body: 'End-to-end product teams building revenue-generating platforms on modern stacks. From zero-to-one to enterprise scale.',
    bullets: [
      'Product strategy & scoping',
      'Full-stack engineering',
      'Infra, security & compliance',
    ],
    icon: 'saas',
  },
  {
    n: '02',
    title: 'AI agents & automations',
    body: 'Production-grade LLM systems that replace manual workflows. We handle the eval harness, the guardrails, and the ops.',
    bullets: [
      'RAG + agentic pipelines',
      'Voice, chat, and embedded',
      'Observability from day one',
    ],
    icon: 'ai',
  },
  {
    n: '03',
    title: 'Internal tools & dashboards',
    body: 'The software your operators actually want. Fast, opinionated, and tuned to your data model — not a generic admin panel.',
    bullets: ['Ops consoles & CRMs', 'Analytics & BI layers', 'Role-based workflows'],
    icon: 'dash',
  },
  {
    n: '04',
    title: 'Legacy modernization',
    body: 'We move you off brittle stacks without breaking the business. Phased cutover, continuous revenue, zero downtime.',
    bullets: [
      'Strangler-fig migrations',
      'Data reconciliation',
      'Retirement roadmaps',
    ],
    icon: 'legacy',
  },
  {
    n: '05',
    title: 'CTO-as-a-service',
    body: 'Fractional technical leadership for operators without a CTO. Vendor selection, hiring, architecture, and review.',
    bullets: [
      'Quarterly tech strategy',
      'Build vs. buy decisions',
      'Engineering hiring',
    ],
    icon: 'cto',
  },
];

const ServiceIcon = ({ kind }: { kind: string }) => {
  const common = {
    width: 28,
    height: 28,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (kind) {
    case 'saas':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <circle cx="6" cy="6.5" r="0.5" fill="currentColor" />
          <path d="M8 13l2 2 4-4" />
        </svg>
      );
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
        </svg>
      );
    case 'dash':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
    case 'legacy':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 6l4-3 4 3 4-3 4 3v12l-4 3-4-3-4 3-4-3z" />
          <path d="M8 3v18M16 3v18" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 20l6-14 4 9 3-6 5 11" />
          <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
};

const ServiceCard = ({ s, span }: { s: Service; span: number }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -2 }}
      style={{
        gridColumn: `span ${span}`,
        background: hover ? 'var(--color-primary)' : '#fff',
        color: hover ? '#fff' : 'var(--color-gray-900)',
        padding: '40px',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 220ms var(--ease-out)',
        cursor: 'pointer',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
            color: hover ? 'var(--color-accent)' : 'var(--color-gray-900)',
          }}
        >
          <ServiceIcon kind={s.icon} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.14em',
              color: hover ? 'var(--color-accent)' : 'var(--color-gray-600)',
            }}
          >
            {s.n}
          </span>
        </div>
        <h3
          style={{
            fontSize: 26,
            letterSpacing: '-0.02em',
            marginBottom: 14,
            color: hover ? '#fff' : 'var(--color-gray-900)',
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: hover ? 'rgba(255,255,255,0.7)' : 'var(--color-gray-600)',
            marginBottom: 20,
          }}
        >
          {s.body}
        </p>
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {s.bullets.map((b, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              color: hover
                ? 'rgba(255,255,255,0.8)'
                : 'var(--color-gray-600)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: 99,
                background: hover
                  ? 'var(--color-accent)'
                  : 'var(--color-gray-400)',
              }}
            ></span>
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="section section-light"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 64,
            marginBottom: 72,
            alignItems: 'end',
          }}
        >
          <div>
            <div className="eyebrow">What we build</div>
            <h2
              style={{
                marginTop: 18,
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              Five practices.
              <br />
              One senior team.
            </h2>
          </div>
          <p
            className="muted"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              maxWidth: 520,
              justifySelf: 'end',
            }}
          >
            We're generalists with a narrow definition of quality. Every
            engagement is staffed with staff-level engineers and a product lead
            who has shipped the exact thing you're asking for, before.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 1,
            background: 'var(--color-gray-200)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.n} s={s} span={i < 2 ? 3 : 2} />
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              gridColumn: 'span 6',
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '32px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: 6,
                }}
              >
                Not sure where you fit?
              </div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>
                Most engagements start as a two-week discovery.
              </div>
            </div>
            <a href="#contact" className="btn btn-primary">
              Start discovery <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
