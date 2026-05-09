import { Link } from 'react-router-dom';
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
    client: 'RecordStops',
    vertical: 'Directory · Independent record stores',
    title: 'Built the go-to directory for independent record stores — ranking in 5 states.',
    metric: '296',
    metricLabel: 'stores indexed',
    second: '683',
    secondLabel: 'organic visitors/mo',
    summary:
      'Programmatic directory with city-guide templates targeting long-tail search. Each store gets its own SEO page. Pure organic growth, zero ad spend.',
    tags: ['Astro', 'Cloudflare D1', 'Programmatic SEO'],
  },
  {
    client: 'SC DMV Alerts',
    vertical: 'SaaS · South Carolina',
    title: 'Appointment alert service monitoring 65 DMV locations every 5 minutes.',
    metric: '65',
    metricLabel: 'locations monitored',
    second: '<5 min',
    secondLabel: 'alert latency',
    summary:
      'Cloudflare Worker scrapes the SC DMV scheduler API, matches openings to subscriber preferences, and fires email alerts on the spot. Concept to paying subscribers in under three weeks.',
    tags: ['Cloudflare Workers', 'D1', 'Stripe'],
  },
  {
    client: 'SendMyLove',
    vertical: 'Consumer App · Subscription',
    title: '2,515 love notes delivered. $5/mo. Zero missed occasions.',
    metric: '2,515',
    metricLabel: 'messages delivered',
    second: '$5',
    secondLabel: 'per month',
    summary:
      'Recurring subscription to send personalized love messages on a schedule. Stripe billing, email delivery, and a UX built for people who care but forget.',
    tags: ['Consumer SaaS', 'Stripe', 'Subscriptions'],
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
            Three things we built<br />
            and shipped.
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <Link
            to="/portfolio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            See all 7 projects →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
