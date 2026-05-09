import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { PROJECTS } from '../data/portfolio';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Project not found.</p>
          <Link to="/portfolio" className="text-orange underline text-sm">
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    live: '#22C55E',
    building: '#C45A2C',
    'on-hold': '#9CA3AF',
  };

  const statusLabel: Record<string, string> = {
    live: 'Live',
    building: 'In Progress',
    'on-hold': 'On Hold',
  };

  return (
    <>
      <SEO
        title={`${project.name} | Ascend Systems Portfolio`}
        description={project.tagline}
      />

      {/* Hero */}
      <section className="bg-charcoal text-white py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              to="/portfolio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gray-400)',
                textDecoration: 'none',
                marginBottom: 32,
              }}
            >
              ← Portfolio
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}
              >
                {project.name}
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 999,
                  padding: '3px 10px',
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
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight"
              style={{ letterSpacing: '-0.025em' }}
            >
              {project.tagline}
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">
              {project.description}
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange hover:bg-orange-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
                >
                  View live
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  transition: 'border-color 0.2s',
                }}
              >
                Build something like this
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshot */}
      {project.screenshot && (
        <div style={{ background: '#F3F3F2', padding: '40px 0' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={project.screenshot}
              alt={`${project.name} screenshot`}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #E5E5E3',
                boxShadow: '0 8px 40px rgba(28,28,30,0.12)',
              }}
            />
          </div>
        </div>
      )}

      {/* Metrics */}
      <section style={{ background: '#FAFAF8', padding: '60px 0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${project.metrics.length}, 1fr)`,
              gap: 1,
              background: '#E5E5E3',
              border: '1px solid #E5E5E3',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {project.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  padding: '32px 28px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 32,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-accent)',
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gray-600)',
                    marginTop: 10,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 48,
            }}
          >
            {[
              { label: 'The Problem', body: project.story.problem },
              { label: 'How We Built It', body: project.story.solution },
              { label: 'The Result', body: project.story.result },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: 'flex', gap: 32 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    width: 120,
                    flexShrink: 0,
                    paddingTop: 4,
                  }}
                >
                  {section.label}
                </div>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.75,
                    color: 'var(--color-gray-600)',
                    flex: 1,
                    margin: 0,
                  }}
                >
                  {section.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tech tags */}
          <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--color-gray-200)' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gray-400)',
                marginBottom: 14,
              }}
            >
              Stack
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    background: 'var(--color-gray-100)',
                    borderRadius: 6,
                    color: 'var(--color-gray-600)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other projects */}
      <section style={{ background: '#FAFAF8', padding: '60px 0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-gray-400)',
              marginBottom: 20,
            }}
          >
            More work
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {PROJECTS.filter((p) => p.slug !== project.slug).map((p) => (
              <Link
                key={p.slug}
                to={`/portfolio/${p.slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-gray-900)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  background: '#fff',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 8,
                  transition: 'border-color 0.15s',
                }}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
