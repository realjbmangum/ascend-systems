import { motion } from 'framer-motion';

const STEPS = [
  {
    w: 'Weeks 1-2',
    title: 'Discovery',
    body: 'Two weeks of deep workshops. We map your systems, interview stakeholders, and return a scoped blueprint — or refund it.',
    artifact: 'Engagement blueprint · Fixed-fee $12K',
  },
  {
    w: 'Weeks 3-4',
    title: 'Architecture',
    body: 'Your staff engineer pairs with ours. We decide the stack, data model, migration path, and the exact sequence of shipped value.',
    artifact: 'Architecture RFC · Reviewed by your team',
  },
  {
    w: 'Weeks 5-12',
    title: 'Build & ship',
    body: 'Weekly demos. Continuous deployment. You see production-grade code from week three, not week twelve.',
    artifact: 'Production release · On your infra, your repo',
  },
  {
    w: 'Ongoing',
    title: 'Ascend',
    body: 'We stay as long as you need us — or hand the keys to your team. No lock-in, no mystery code, no surprise invoices.',
    artifact: 'Handoff package · Full docs + runbook',
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="section section-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 80,
            marginBottom: 80,
            alignItems: 'start',
          }}
        >
          <div>
            <div className="eyebrow">How we work</div>
            <h2
              style={{
                marginTop: 18,
                color: '#fff',
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              A deliberate climb,
              <br />
              not a sprint.
            </h2>
          </div>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 540,
              alignSelf: 'end',
            }}
          >
            Every engagement has the same people from day one. No "junior devs,
            senior architects." No staffing surprises at month three.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 300,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  marginBottom: 16,
                }}
              >
                {step.w}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 'auto',
                }}
              >
                {step.body}
              </p>
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.01em',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {step.artifact}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
