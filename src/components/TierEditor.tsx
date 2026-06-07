/**
 * TierEditor — admin UI for authoring the structured pricing tiers that
 * ProposalDocument renders. Operates on a Tier[] value via onChange; the
 * parent serializes to JSON and PATCHes it to `proposals.tiers`.
 */

import { useState } from 'react';
import type { PortalModel, Tier } from './ProposalDocument';

const PORTAL_MODELS: { value: PortalModel; label: string; help: string }[] = [
  {
    value: 'included',
    label: 'Portal included',
    help: 'Document Portal is bundled — no separate billing.',
  },
  {
    value: 'separate',
    label: 'Portal billed separately',
    help: 'Document Portal is billed per property in addition to the retainer.',
  },
  {
    value: 'none',
    label: 'No Portal',
    help: 'This tier does not include or mention the Document Portal.',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextTierKey(existing: Tier[]): { key: string; optionKey: string } {
  const used = new Set(existing.map((t) => t.key.toLowerCase()));
  for (let i = 0; i < ALPHABET.length; i++) {
    const letter = ALPHABET[i];
    if (!used.has(letter.toLowerCase())) {
      return { key: letter.toLowerCase(), optionKey: `Option ${letter}` };
    }
  }
  return { key: 'x', optionKey: 'Option X' };
}

function emptyTier(existing: Tier[]): Tier {
  const { key, optionKey } = nextTierKey(existing);
  return {
    key,
    optionKey,
    name: '',
    monthlyDollars: 0,
    sub: '',
    features: [''],
    recommended: false,
    portalModel: 'none',
    totalBandTagline: '',
  };
}

export default function TierEditor({
  value,
  onChange,
}: {
  value: Tier[];
  onChange: (tiers: Tier[]) => void;
}) {
  const tiers = value || [];
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(tiers.length === 0 ? [] : [tiers[0].key])
  );

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const updateTier = (idx: number, patch: Partial<Tier>) => {
    const next = tiers.slice();
    next[idx] = { ...next[idx], ...patch };
    // Enforce single recommended tier.
    if (patch.recommended) {
      for (let i = 0; i < next.length; i++) {
        if (i !== idx) next[i] = { ...next[i], recommended: false };
      }
    }
    onChange(next);
  };

  const removeTier = (idx: number) => {
    if (!confirm(`Remove ${tiers[idx].optionKey} (${tiers[idx].name})?`)) return;
    onChange(tiers.filter((_, i) => i !== idx));
  };

  const addTier = () => {
    const fresh = emptyTier(tiers);
    onChange([...tiers, fresh]);
    setExpanded((prev) => new Set(prev).add(fresh.key));
  };

  const moveTier = (idx: number, dir: -1 | 1) => {
    const dest = idx + dir;
    if (dest < 0 || dest >= tiers.length) return;
    const next = tiers.slice();
    [next[idx], next[dest]] = [next[dest], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-charcoal">Pricing tiers</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            These render as the side-by-side cards on the proposal. The
            client clicks one to select it before signing.
          </p>
        </div>
        <button
          type="button"
          onClick={addTier}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors shrink-0"
        >
          + Add tier
        </button>
      </div>

      {tiers.length === 0 && (
        <div className="rounded-lg border border-dashed border-surface-200 px-4 py-6 text-center text-sm text-gray-500">
          No tiers yet. Click <strong>+ Add tier</strong> to add one. With no
          tiers, the proposal falls back to plain price-summary text.
        </div>
      )}

      <ul className="space-y-3">
        {tiers.map((tier, idx) => {
          const isExpanded = expanded.has(tier.key);
          return (
            <li
              key={`${tier.key}-${idx}`}
              className={`rounded-xl border bg-white ${
                tier.recommended
                  ? 'border-orange/40 shadow-[0_4px_18px_rgba(196,90,44,0.10)]'
                  : 'border-surface-100'
              }`}
            >
              {/* Header row — always visible */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleExpanded(tier.key)}
                  className="text-gray-400 hover:text-charcoal transition-colors w-5 h-5 flex items-center justify-center"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '▾' : '▸'}
                </button>
                <input
                  type="text"
                  value={tier.optionKey}
                  onChange={(e) => updateTier(idx, { optionKey: e.target.value })}
                  placeholder="Option A"
                  className="w-28 text-sm font-mono uppercase tracking-wider border border-surface-200 rounded-md px-2 py-1 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => updateTier(idx, { name: e.target.value })}
                  placeholder="Tier name (e.g. Bucket)"
                  className="flex-1 min-w-0 text-sm font-semibold border border-surface-200 rounded-md px-2 py-1 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                />
                <div className="flex items-center gap-1 text-sm font-mono text-charcoal whitespace-nowrap">
                  $
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={tier.monthlyDollars}
                    onChange={(e) =>
                      updateTier(idx, {
                        monthlyDollars: Number(e.target.value) || 0,
                      })
                    }
                    className="w-24 text-sm font-mono border border-surface-200 rounded-md px-2 py-1 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 text-right"
                  />
                  <span className="text-gray-500">/mo</span>
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={tier.recommended}
                    onChange={(e) =>
                      updateTier(idx, { recommended: e.target.checked })
                    }
                    className="w-4 h-4 accent-orange"
                  />
                  <span className="font-semibold text-charcoal">Recommended</span>
                </label>
                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    type="button"
                    onClick={() => moveTier(idx, -1)}
                    disabled={idx === 0}
                    className="w-6 h-6 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTier(idx, 1)}
                    disabled={idx === tiers.length - 1}
                    className="w-6 h-6 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="text-red-400 hover:text-red-600 text-xs font-semibold ml-1"
                    aria-label="Remove tier"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Body — expandable */}
              {isExpanded && (
                <div className="border-t border-surface-100 px-4 py-4 space-y-4 bg-surface/30">
                  <Field
                    label="Sub-description"
                    help="One short line under the price. e.g. 'Up to 10 hours of advisory + vendor management each month.'"
                  >
                    <textarea
                      rows={2}
                      value={tier.sub}
                      onChange={(e) => updateTier(idx, { sub: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <FeaturesField
                    value={tier.features}
                    onChange={(features) => updateTier(idx, { features })}
                  />

                  <Field
                    label="Document Portal model"
                    help="Controls how the Portal appears in the bullets and the Total band."
                  >
                    <div className="grid sm:grid-cols-3 gap-2">
                      {PORTAL_MODELS.map((m) => (
                        <label
                          key={m.value}
                          className={`cursor-pointer rounded-lg border p-3 text-xs transition-colors ${
                            tier.portalModel === m.value
                              ? 'border-orange bg-orange/5 text-charcoal'
                              : 'border-surface-200 bg-white text-gray-600 hover:bg-surface-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`portalModel-${tier.key}`}
                            value={m.value}
                            checked={tier.portalModel === m.value}
                            onChange={() =>
                              updateTier(idx, { portalModel: m.value })
                            }
                            className="hidden"
                          />
                          <div className="font-semibold mb-1">{m.label}</div>
                          <div className="text-gray-500 leading-snug">{m.help}</div>
                        </label>
                      ))}
                    </div>
                  </Field>

                  {tier.portalModel === 'separate' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field
                        label="Portal $ per property / month"
                        help="What the client pays per active property each month."
                      >
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={tier.portalPerPropertyDollars ?? 35}
                          onChange={(e) =>
                            updateTier(idx, {
                              portalPerPropertyDollars: Number(e.target.value) || 0,
                            })
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field
                        label="Portal active property count"
                        help="Used to compute the all-in monthly in the Total band."
                      >
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={tier.portalPropertyCount ?? 32}
                          onChange={(e) =>
                            updateTier(idx, {
                              portalPropertyCount: Number(e.target.value) || 0,
                            })
                          }
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  )}

                  <Field
                    label="Total band tagline"
                    help="The line under the tier header in the dark Total band. e.g. 'Monthly retainer · Portal included · weekly calls'"
                  >
                    <input
                      type="text"
                      value={tier.totalBandTagline}
                      onChange={(e) =>
                        updateTier(idx, { totalBandTagline: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>

                  <Field
                    label="Internal tier key"
                    help="Stored when the client signs (e.g. 'a', 'b'). Letters only; only change if you know what you're doing."
                  >
                    <input
                      type="text"
                      value={tier.key}
                      onChange={(e) =>
                        updateTier(idx, {
                          key: e.target.value.toLowerCase().replace(/[^a-z]/g, ''),
                        })
                      }
                      className={`${inputCls} font-mono w-24`}
                    />
                  </Field>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────── helpers ── */

const inputCls =
  'w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30';

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal mb-1">
        {label}
      </label>
      {help && <p className="text-[11px] text-gray-500 mb-1.5">{help}</p>}
      {children}
    </div>
  );
}

function FeaturesField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (features: string[]) => void;
}) {
  const update = (i: number, text: string) => {
    const next = value.slice();
    next[i] = text;
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, '']);
  const move = (i: number, dir: -1 | 1) => {
    const dest = i + dir;
    if (dest < 0 || dest >= value.length) return;
    const next = value.slice();
    [next[i], next[dest]] = [next[dest], next[i]];
    onChange(next);
  };

  return (
    <Field
      label="Features (bulleted under the price)"
      help="One bullet per row. Wrap key phrases in **double asterisks** for bold. Empty rows are skipped."
    >
      <ul className="space-y-2">
        {value.map((feat, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-orange font-mono text-xs w-6 text-right shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <input
              type="text"
              value={feat}
              onChange={(e) => update(i, e.target.value)}
              placeholder="e.g. **Weekly** strategy call (in lieu of monthly)"
              className={inputCls}
            />
            <div className="flex items-center gap-0.5 text-gray-400 shrink-0">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="w-6 h-6 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="w-6 h-6 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-400 hover:text-red-600 text-xs font-semibold px-1.5"
                aria-label="Remove feature"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-dashed border-surface-200 text-gray-600 hover:bg-surface hover:text-charcoal transition-colors"
      >
        + Add feature
      </button>
    </Field>
  );
}
