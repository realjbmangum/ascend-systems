import { motion } from 'framer-motion';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  meta: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Ascend is the only outside team we let touch production code. They read our legacy stack faster than engineers we hired full-time.',
    name: 'Priya Shankar',
    role: 'COO, Meridian Freight',
    meta: '18-month engagement',
  },
  {
    quote:
      'I came in expecting a dev shop. I got a product team. The architecture doc they delivered in week two was better than what we paid a Big 4 firm $400K for.',
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

const TestimonialsSection = () => {
  return (
    <section className="section section-darker" style={{ padding: '120px 32px' }}>
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
            What clients say
          </div>
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            The work speaks.
            <br />
            So do they.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                margin: 0,
                padding: '36px 32px',
                background: 'var(--color-primary)',
                border: '1px solid var(--color-primary-lighter)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 320,
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  marginBottom: 24,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption style={{ margin: 0 }}>
                <div style={{ fontWeight: 600, color: '#fff' }}>{t.name}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.6)',
                    marginTop: 4,
                  }}
                >
                  {t.role}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  {t.meta}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
