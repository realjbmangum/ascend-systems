import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { PROJECTS } from '../data/portfolio';

const statusColor: Record<string, string> = {
  live: '#22C55E',
  building: '#C45A2C',
  'on-hold': '#9CA3AF',
};

const statusLabel: Record<string, string> = {
  live: 'Live',
  building: 'Building',
  'on-hold': 'On Hold',
};

export default function Portfolio() {
  return (
    <>
      <SEO
        title="Portfolio | Ascend Systems"
        description="Products built by Ascend Systems — directories, SaaS tools, mobile apps, and developer utilities. Built fast, shipped for real."
      />

      {/* Hero */}
      <section className="bg-charcoal text-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
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
              Portfolio
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              Things we've built<br />
              <span className="text-orange">and shipped.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">
              Not mockups. Not prototypes. These are live products with real users —
              built lean, launched fast, and still running.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 28,
            }}
          >
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <Link
                  to={`/portfolio/${project.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fff',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #E5E5E3',
                    boxShadow: '0 2px 8px rgba(28,28,30,0.06)',
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 8px 28px rgba(28,28,30,0.12)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 2px 8px rgba(28,28,30,0.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* Screenshot or placeholder */}
                  <div
                    style={{
                      height: 200,
                      background: project.screenshot
                        ? undefined
                        : 'linear-gradient(135deg, #1C1C1E 0%, #2A2A2E 100%)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    {project.screenshot ? (
                      <img
                        src={project.screenshot}
                        alt={project.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.25)',
                            letterSpacing: '0.12em',
                          }}
                        >
                          {project.name.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Status badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: 999,
                        padding: '4px 10px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: statusColor[project.status],
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          color: '#fff',
                          textTransform: 'uppercase',
                        }}
                      >
                        {statusLabel[project.status]}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        marginBottom: 8,
                      }}
                    >
                      {project.name}
                    </div>

                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: 'var(--color-gray-900)',
                        lineHeight: 1.35,
                        marginBottom: 10,
                      }}
                    >
                      {project.tagline}
                    </h2>

                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: 'var(--color-gray-600)',
                        marginBottom: 18,
                        flex: 1,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Metrics row */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 16,
                        borderTop: '1px solid var(--color-gray-200)',
                        paddingTop: 16,
                        marginBottom: 18,
                      }}
                    >
                      {project.metrics.slice(0, 3).map((m, j) => (
                        <div key={j}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 16,
                              fontWeight: 600,
                              color: 'var(--color-gray-900)',
                              lineHeight: 1,
                            }}
                          >
                            {m.value}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--color-gray-400)',
                              marginTop: 4,
                            }}
                          >
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            background: 'var(--color-gray-100)',
                            borderRadius: 4,
                            color: 'var(--color-gray-600)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ letterSpacing: '-0.02em' }}
            >
              Have an idea worth building?
            </h2>
            <p className="mt-4 text-gray-300 max-w-xl mx-auto">
              We move from concept to shipped product faster than most teams finish their first sprint.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Let's talk
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
