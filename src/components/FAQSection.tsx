import { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

const QA: FAQItem[] = [
  {
    q: 'What size engagement do you take on?',
    a: 'Our typical engagement is $80K–$400K across 3–12 months. We work weekly-retainer or fixed-scope, and we staff 2–5 people per project. Smaller than that, we\'re the wrong fit. Larger than that, we partner with a Big 4 on delivery.',
  },
  {
    q: 'Do you work on-site in Charlotte?',
    a: 'Yes. We\'re headquartered in Charlotte and most mid-market clients get at least one on-site week per month — usually discovery, architecture review, and launch. The rest is remote, but never offshore. Every engineer is U.S.-based and senior.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do, from day one. Your GitHub, your infra accounts, your IP. We don\'t use proprietary platforms and we don\'t lock you in. When the engagement ends, we hand you a runbook and a handoff package and walk away clean.',
  },
  {
    q: 'How is this different from a consultancy or an offshore agency?',
    a: 'Consultancies sell slides and senior attention you rarely get. Offshore agencies sell hours and you manage the quality. We sell shipped software at a fixed weekly cost, staffed by the same senior team from discovery to handoff.',
  },
  {
    q: 'Can you work alongside our internal engineering team?',
    a: 'That\'s our preference. We embed with your team, adopt your conventions, attend your standups, and transfer ownership as we go. By the time we leave, your team has shipped every major component at least once.',
  },
  {
    q: 'What\'s the first step?',
    a: 'A 30-minute discovery call. If there\'s a fit, we run a paid two-week discovery sprint that ends in a scoped blueprint. If the blueprint isn\'t worth the paper it\'s printed on, we refund it.',
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section id="faq" className="section section-light">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 56,
          }}
        >
          <div className="eyebrow eyebrow-centered">Common questions</div>
          <h2
            style={{
              marginTop: 18,
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            Plainly answered.
          </h2>
        </motion.div>

        <div style={{ borderTop: '1px solid var(--color-gray-200)' }}>
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  backgroundColor: isOpen
                    ? 'var(--color-gray-100)'
                    : 'transparent',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  borderBottom: '1px solid var(--color-gray-200)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '28px 0',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 24,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--color-accent)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        letterSpacing: '-0.015em',
                        color: 'var(--color-gray-900)',
                      }}
                    >
                      {item.q}
                    </span>
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      color: 'var(--color-accent)',
                      fontSize: 20,
                      fontWeight: 300,
                      flexShrink: 0,
                      transition: 'transform 200ms var(--ease-out)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    height: isOpen ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: 'var(--color-gray-600)',
                      paddingBottom: 28,
                      margin: 0,
                    }}
                  >
                    {item.a}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
