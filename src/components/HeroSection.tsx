import { motion } from 'framer-motion';

interface HeroStats {
  num: string;
  label: string;
}

const HeroStatsComponent = ({ items }: { items: HeroStats[] }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      gap: 0,
      marginTop: 72,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      paddingTop: 28,
    }}
  >
    {items.map((s, i) => (
      <div
        key={i}
        style={{
          paddingRight: 24,
          borderRight:
            i < items.length - 1
              ? '1px solid rgba(255,255,255,0.08)'
              : 'none',
          paddingLeft: i === 0 ? 0 : 24,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 36,
            fontWeight: 500,
            color: 'var(--color-accent)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {s.num}
        </div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginTop: 10,
            fontWeight: 500,
          }}
        >
          {s.label}
        </div>
      </div>
    ))}
  </div>
);

const HeroConservative = () => (
  <section
    style={{
      position: 'relative',
      minHeight: '92vh',
      background: `
        linear-gradient(180deg, rgba(20,20,21,0.55) 0%, rgba(20,20,21,0.82) 65%, rgba(20,20,21,0.96) 100%),
        url('/images/hero-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 32px',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          Charlotte, NC · Est. 2024
        </div>
      </motion.div>

      <motion.h1
        className="display-xl"
        style={{ color: '#fff', maxWidth: 1100, marginBottom: 32 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Software that moves
        <br />
        <span style={{ color: 'var(--color-accent)' }}>legacy businesses</span>
        <br />
        forward.
      </motion.h1>

      <motion.p
        style={{
          fontSize: 20,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.72)',
          maxWidth: 620,
          marginBottom: 44,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        We partner with mid-market operators to replace aging systems with custom
        SaaS, AI automations, and internal tools — delivered by a senior team,
        built to last.
      </motion.p>

      <motion.div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <a href="#contact" className="btn btn-primary btn-lg">
          Book a discovery call <span style={{ opacity: 0.7 }}>→</span>
        </a>
        <a href="#services" className="btn btn-ghost-dark btn-lg">
          See our work
        </a>
      </motion.div>

      <HeroStatsComponent
        items={[
          { num: '47', label: 'Engagements shipped' },
          { num: '$18M', label: 'Legacy systems retired' },
          { num: '11yr', label: 'Avg. engineer tenure' },
          { num: '4.9', label: 'Client NPS' },
        ]}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ width: 24, height: 1, background: 'currentColor' }}></span>
      Scroll
    </div>
  </section>
);

export default HeroConservative;
