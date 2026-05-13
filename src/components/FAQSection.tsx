import { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

const QA: FAQItem[] = [
  {
    q: 'What size engagement do you take on?',
    a: 'Projects typically range from $5k discovery sprints to $50k+ build engagements, scoped as a weekly retainer or fixed-scope. The fit is owner-operators and mid-market teams who want a senior engineer doing the work, not an agency layer between them and it.',
  },
  {
    q: 'Are you a team or a solo operator?',
    a: 'Solo. I\'m the entire shop — discovery, architecture, build, deploy, handoff. You talk to me, I do the work. No offshore team, no junior account manager, no PM between us and the build. When the scope demands it, I bring in trusted contractors I\'ve worked with before, but you always know who\'s touching your code.',
  },
  {
    q: 'Do you work on-site in Charlotte?',
    a: 'Yes. I\'m based in Charlotte and most local clients get at least one on-site session per engagement — usually for discovery, architecture review, and launch. The rest is remote.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do, from day one. Your GitHub, your infra accounts, your IP. No proprietary platforms, no vendor lock-in. When the engagement ends, you get a runbook and a clean handoff package.',
  },
  {
    q: 'How is this different from a consultancy or an offshore agency?',
    a: 'Consultancies sell slides and senior attention you rarely get. Offshore agencies sell hours and you manage the quality. I sell shipped software at a fixed weekly cost, with one person — me — accountable from discovery to handoff.',
  },
  {
    q: 'Can you work alongside our internal engineering team?',
    a: 'That\'s often the best fit. I embed with your team, adopt your conventions, attend your standups, and transfer ownership as we go. By the end, your team has shipped every major component at least once.',
  },
  {
    q: 'What\'s the first step?',
    a: 'A 30-minute discovery call. If there\'s a fit, we run a paid two-week discovery sprint that ends in a scoped blueprint with a fixed-price build proposal. If the blueprint isn\'t worth the paper it\'s printed on, the sprint is refunded.',
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
