/* Stack.jsx */
const STACK_GROUPS = [
  { label: 'Languages', items: ['TypeScript', 'Python', 'Go', 'Elixir', 'Rust', 'SQL'] },
  { label: 'Frontend', items: ['React', 'Next.js', 'Remix', 'Tailwind', 'Radix', 'Framer Motion'] },
  { label: 'Backend', items: ['Node', 'FastAPI', 'tRPC', 'PostgreSQL', 'Redis', 'Temporal'] },
  { label: 'AI / ML', items: ['Anthropic', 'OpenAI', 'pgvector', 'LangGraph', 'LiteLLM', 'Braintrust'] },
  { label: 'Infra', items: ['AWS', 'GCP', 'Vercel', 'Fly.io', 'Cloudflare', 'Terraform'] },
  { label: 'Observability', items: ['Datadog', 'Sentry', 'Honeycomb', 'Grafana', 'Posthog', 'Statsig'] },
];

const Stack = () => (
  <section id="stack" className="section section-light">
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'start' }} className="services-head">
        <div style={{ position: 'sticky', top: 120 }}>
          <div className="eyebrow">The stack</div>
          <h2 style={{ marginTop: 18, fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Tools we've earned<br />the right to use.
          </h2>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 440 }}>
            Opinionated, not dogmatic. We pick the boring thing when the boring thing wins — and the sharp thing when it matters.
            Everything we ship is yours: your repo, your infra, your keys.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STACK_GROUPS.map((g, gi) => (
            <div key={g.label} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              padding: '28px 0', gap: 24,
              borderTop: '1px solid var(--color-gray-200)',
              borderBottom: gi === STACK_GROUPS.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
            }} className="stack-row">
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-gray-600)', paddingTop: 4,
              }}>
                {String(gi+1).padStart(2,'0')} / {g.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {g.items.map(it => (
                  <span key={it} style={{
                    padding: '8px 14px', borderRadius: 6,
                    background: '#fff', border: '1px solid var(--color-gray-200)',
                    fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0',
                    color: 'var(--color-gray-900)',
                  }}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { Stack });
