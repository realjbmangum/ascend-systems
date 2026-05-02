import { motion } from 'framer-motion';

interface CaseStudy {
  client: string;
  vertical: string;
  title: string;
  metric: string;
  metricLabel: string;
  second: string;
  secondLabel: string;
  summary: string;
  tags: string[];
}

const CASES: CaseStudy[] = [
  {
    client: 'Meridian Freight',
    vertical: 'Logistics · 340 employees',
    title: 'Retired a 22-year-old dispatch system without losing a shipment.',
    metric: '$4.2M',
    metricLabel: 'legacy infra retired',
    second: '0',
    secondLabel: 'customer-visible incidents',
    summary:
      'Phased strangler-fig migration off an on-prem AS/400 to a custom TMS. 18 months, zero downtime, 3× throughput.',
    tags: [
      'Legacy modernization',
      'Custom SaaS',
      '18-month engagement',
    ],
  },
  {
    client: 'Keystone Health Partners',
    vertical: 'Healthcare · 12 clinics',
    title: 'AI intake agent that clinicians actually trust.',
    metric: '42%',
    metricLabel: 'faster intake',
    second: '98.2%',
    secondLabel: 'chart accuracy',
    summary:
      'Voice + chat intake with SOAP-note generation, HIPAA-scoped retrieval, and a human-in-the-loop review queue.',
    tags: ['AI agents', 'Regulated', '9-month engagement'],
  },
  {
    client: 'Blackwood & Co.',
    vertical: 'Legal · Mid-market firm',
    title: 'Internal tooling that replaced five SaaS subscriptions.',
    metric: '$186K',
    metricLabel: 'annual SaaS retired',
    second: '5 → 1',
    secondLabel: 'tools in daily use',
    summary:
      'Matter management, conflicts search, and a drafting copilot — built on one data model, owned by the firm.',
    tags: [
      'Internal tools',
      'AI augmentation',
      '6-month engagement',
    ],
  },
];

const CaseStudiesSection = () => {
  return (
    <section id="work" className="section section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 64,
          }}
        >
          <div className="eyebrow eyebrow-centered" style={{ marginBottom: 16 }}>
            Recent work
          </div>
          <h2
            style={{
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            Three engagements<br />
            that changed the game.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-light"
              style={{
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginBottom: 8,
                  }}
                >
                  {c.client}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.01em',
                    color: 'var(--color-gray-600)',
                  }}
                >
                  {c.vertical}
                </div>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                {c.title}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  padding: '20px 0',
                  borderTop: '1px solid var(--color-gray-200)',
                  borderBottom: '1px solid var(--color-gray-200)',
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 24,
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      lineHeight: 1,
                    }}
                  >
                    {c.metric}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gray-600)',
                      marginTop: 8,
                    }}
                  >
                    {c.metricLabel}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 24,
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      lineHeight: 1,
                    }}
                  >
                    {c.second}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gray-600)',
                      marginTop: 8,
                    }}
                  >
                    {c.secondLabel}
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'var(--color-gray-600)',
                  marginBottom: 'auto',
                }}
              >
                {c.summary}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 20,
                  flexWrap: 'wrap',
                }}
              >
                {c.tags.map((tag, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.01em',
                      padding: '6px 10px',
                      background: 'var(--color-gray-100)',
                      borderRadius: '4px',
                      color: 'var(--color-gray-600)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
