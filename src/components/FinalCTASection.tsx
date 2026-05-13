import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

const FinalCTASection = () => {
  const bookingHref = siteConfig.calendlyUrl || '/contact';
  const isExternal = bookingHref.startsWith('http');

  const expectations = [
    {
      title: '30 minutes',
      detail: 'No slides. Your problem, my questions.',
    },
    {
      title: 'Direct conversation',
      detail: "Talk to the person who'll do the work.",
    },
    {
      title: 'Honest assessment',
      detail: "If it's not a fit, I'll tell you.",
    },
  ];

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
      }}
      className="py-24 sm:py-32 px-6 sm:px-8"
    >
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="eyebrow eyebrow-centered"
            style={{ justifyContent: 'center', marginBottom: 20 }}
          >
            Ready when you are
          </div>
          <h2
            className="display"
            style={{
              color: '#fff',
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Ship what your team has been{' '}
            <span style={{ color: 'var(--color-accent)' }}>promising</span> for
            years.
          </h2>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 560,
              margin: '0 auto 36px',
            }}
          >
            30-minute discovery call. No slides, no sales engineer. Just a
            direct conversation with the person who'll run your engagement.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16">
            {isExternal ? (
              <a
                href={bookingHref}
                className="btn btn-primary btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a discovery call <span>→</span>
              </a>
            ) : (
              <Link to={bookingHref} className="btn btn-primary btn-lg">
                Book a discovery call <span>→</span>
              </Link>
            )}
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="btn btn-ghost-dark btn-lg"
              >
                {siteConfig.email}
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-10 border-t border-white/10"
        >
          {expectations.map((e) => (
            <div
              key={e.title}
              className="text-center sm:text-left rounded-xl p-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                {e.title}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                {e.detail}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
