import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `
          linear-gradient(180deg, rgba(20,20,21,0.82) 0%, rgba(20,20,21,0.95) 100%),
          url('/images/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '140px 32px',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              Ready when you are
            </div>
            <h2
              className="display"
              style={{
                color: '#fff',
                marginBottom: 28,
                fontSize: 'clamp(44px, 6vw, 88px)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              Ship what your
              <br />
              team has been
              <br />
              <span style={{ color: 'var(--color-accent)' }}>promising</span> for
              years.
            </h2>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              30-minute discovery call. No slides, no sales engineer. Just a
              direct conversation with the person who'll run your engagement.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="https://cal.com/ascend" className="btn btn-primary btn-lg">
                Book a discovery call <span>→</span>
              </a>
              <a
                href="mailto:hello@ascend.systems"
                className="btn btn-ghost-dark btn-lg"
              >
                hello@ascend.systems
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'rgba(20,20,21,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: 36,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: 20,
              }}
            >
              What to expect
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  30 minutes
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  No slides. Your problem, our questions.
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Direct conversation
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  Talk to the person who'll lead your work.
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Honest assessment
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  If we're not the right fit, we'll tell you.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
