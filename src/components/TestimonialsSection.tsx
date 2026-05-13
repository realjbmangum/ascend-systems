import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
            Featured engagement
          </div>
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            The work speaks
            <br />
            for itself.
          </h2>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            margin: '0 auto',
            maxWidth: 880,
            padding: '48px 44px',
            background: 'var(--color-primary)',
            border: '1px solid var(--color-primary-lighter)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 20,
            }}
          >
            City of Charlotte · EV Charging Dashboard
          </div>
          <blockquote
            style={{
              margin: 0,
              marginBottom: 28,
              fontSize: 22,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            "We built the City of Charlotte's EV charging analytics dashboard —
            208 stations across the city, real-time session tracking, demoed to
            the Office of the CTO."
          </blockquote>
          <figcaption
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 24,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>
                Public-sector engagement
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 4,
                }}
              >
                Built and demoed 2026 · Charlotte, NC
              </div>
            </div>
            <Link
              to="/portfolio"
              className="btn btn-ghost-dark"
              style={{ fontSize: 14 }}
            >
              See the work →
            </Link>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default TestimonialsSection;
