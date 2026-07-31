/**
 * Kiln — one shared status/priority palette for the whole admin CRM.
 * Maps any status/priority string to a warm `k-badge` class (defined in
 * admin-kiln.css). Replaces the loud per-file Tailwind color maps.
 *
 *   import { statusClass, priorityClass, stageAccent } from '@/components/kiln/status';
 *   <span className={statusClass(lead.status)}>{lead.status}</span>
 */

const STATUS: Record<string, string> = {
  // info — fresh / unworked
  new: 'k-info', qualified: 'k-info', scoping: 'k-info', draft: 'k-info', open: 'k-info',
  // pending — waiting / parked
  contacted: 'k-pending', planning: 'k-pending', on_hold: 'k-pending', pending: 'k-pending', trialing: 'k-pending',
  // progress — active work (brand orange)
  proposal_sent: 'k-progress', in_progress: 'k-progress', sent: 'k-progress',
  // good — positive terminal / healthy
  active: 'k-good', won: 'k-good', completed: 'k-good', paid: 'k-good', approved: 'k-good', signed: 'k-good', done: 'k-good',
  // bad — negative / needs attention
  lost: 'k-bad', cancelled: 'k-bad', canceled: 'k-bad', overdue: 'k-bad', rejected: 'k-bad', failed: 'k-bad', past_due: 'k-bad',
};

const PRIORITY: Record<string, string> = {
  urgent: 'k-bad', high: 'k-progress', medium: 'k-info', low: 'k-neutral',
};

/** Full className for a status badge (includes the `k-badge` base). */
export function statusClass(status?: string | null): string {
  return `k-badge ${(status && STATUS[status]) || 'k-neutral'}`;
}

/** Full className for a priority badge. */
export function priorityClass(priority?: string | null): string {
  return `k-badge ${(priority && PRIORITY[priority]) || 'k-neutral'}`;
}

/**
 * Harmonized, muted stage accent for Kanban column top-strips — one warm
 * family instead of loud primaries. The goal/active stage carries the orange.
 */
const STAGE_ACCENT: Record<string, string> = {
  new: '#B8B3A8', contacted: '#C9A96A', qualified: '#9AA0A6',
  proposal_sent: 'var(--color-orange)', won: '#5E8C63', lost: '#B5674E',
  planning: '#B8B3A8', scoping: '#9AA0A6', in_progress: 'var(--color-orange)',
  on_hold: '#C9A96A', completed: '#5E8C63', cancelled: '#B5674E',
  todo: '#B8B3A8', doing: 'var(--color-orange)', review: '#C9A96A', done: '#5E8C63',
  backlog: '#B8B3A8', blocked: '#B5674E',
};

export function stageAccent(stage: string): string {
  return STAGE_ACCENT[stage] || '#B8B3A8';
}
