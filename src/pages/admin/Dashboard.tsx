import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PortfolioTrafficCard from '../../components/PortfolioTrafficCard';

const PIPELINE_STATUSES: Array<{ key: string; label: string; bar: string }> = [
  { key: 'new', label: 'New', bar: 'bg-blue-500' },
  { key: 'contacted', label: 'Contacted', bar: 'bg-yellow-500' },
  { key: 'qualified', label: 'Qualified', bar: 'bg-purple-500' },
  { key: 'proposal_sent', label: 'Proposal', bar: 'bg-orange' },
  { key: 'won', label: 'Won', bar: 'bg-green-500' },
];

const PROJECT_STATUSES: Array<{ key: string; label: string; bar: string; text: string }> = [
  { key: 'planning', label: 'Planning', bar: 'bg-blue-500', text: 'text-blue-700' },
  { key: 'scoping', label: 'Scoping', bar: 'bg-purple-500', text: 'text-purple-700' },
  { key: 'in_progress', label: 'In Progress', bar: 'bg-orange', text: 'text-orange' },
  { key: 'on_hold', label: 'On Hold', bar: 'bg-yellow-500', text: 'text-yellow-700' },
  { key: 'completed', label: 'Completed', bar: 'bg-green-500', text: 'text-green-700' },
];

const PRIORITY_CONFIG: Array<{ key: string; label: string; chipClass: string }> = [
  { key: 'urgent', label: 'Urgent', chipClass: 'bg-red-100 text-red-700' },
  { key: 'high', label: 'High', chipClass: 'bg-orange-glow text-orange-dark' },
  { key: 'medium', label: 'Medium', chipClass: 'bg-blue-100 text-blue-700' },
  { key: 'low', label: 'Low', chipClass: 'bg-gray-100 text-gray-600' },
];

function fmtMoney(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-glow text-orange-dark',
  urgent: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getLeads().catch(() => []),
      api.getClients().catch(() => []),
      api.getProjects().catch(() => []),
      api.getTasks({ status: 'open' }).catch(() => []),
      api.getTasks().catch(() => []),
      api.getInvoices().catch(() => []),
    ])
      .then(([l, c, p, t, allT, inv]) => {
        setLeads(l || []);
        setClients(c || []);
        setProjects(p || []);
        setTasks(t || []);
        setAllTasks(allT || []);
        setInvoices(inv || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeClients = clients.filter(
    (c) => !c.status || c.status === 'active'
  ).length;
  const activeProjects = projects.filter(
    (p) => p.status !== 'completed' && p.status !== 'cancelled'
  ).length;

  const pipelineCounts = PIPELINE_STATUSES.map((s) => ({
    ...s,
    count: leads.filter((l) => l.status === s.key).length,
  }));
  const pipelineMax = Math.max(1, ...pipelineCounts.map((p) => p.count));

  const projectStatusCounts = PROJECT_STATUSES.map((s) => ({
    ...s,
    count: projects.filter((p) => p.status === s.key).length,
  }));
  const projectStatusMax = Math.max(1, ...projectStatusCounts.map((p) => p.count));
  const totalProjects = projects.length;
  const cancelledProjects = projects.filter((p) => p.status === 'cancelled').length;

  const tasksByPriority = PRIORITY_CONFIG.map((p) => ({
    ...p,
    count: tasks.filter((t) => (t.priority || 'medium') === p.key).length,
  }));
  const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const tasksDoneThisWeek = allTasks.filter(
    (t) => t.status === 'done' && t.completed_at && new Date(t.completed_at).getTime() >= oneWeekAgo
  ).length;
  const tasksWithoutProject = tasks.filter((t) => !t.project_id).length;

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.amount_cents || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.amount_cents || 0), 0);
  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.amount_cents || 0), 0);
  const overdueInvoices = invoices.filter((inv) => {
    if (!inv.due_date || inv.status === 'paid') return false;
    return new Date(inv.due_date).getTime() < Date.now();
  });
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Dashboard</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Leads"
          value={leads.length}
          accent
          onClick={() => navigate('/admin/leads')}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatCard
          label="Active Clients"
          value={activeClients}
          sub={`${clients.length} total`}
          onClick={() => navigate('/admin/clients')}
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
        <StatCard
          label="Active Projects"
          value={activeProjects}
          sub={`${totalProjects} total · ${cancelledProjects} cancelled`}
          onClick={() => navigate('/admin/projects')}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
        <StatCard
          label="Open Tasks"
          value={tasks.length}
          sub={`${tasksDoneThisWeek} done this week`}
          onClick={() => navigate('/admin/tasks')}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </div>

      {/* Revenue strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 border bg-white border-surface-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Billed</div>
          <div className="text-2xl font-bold text-charcoal tabular-nums">{fmtMoney(totalBilled)}</div>
          <div className="text-xs text-gray-500 mt-1">{invoices.length} invoices</div>
        </div>
        <div className="rounded-xl p-5 border bg-white border-surface-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Collected</div>
          <div className="text-2xl font-bold text-green-700 tabular-nums">{fmtMoney(totalPaid)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {invoices.filter((i) => i.status === 'paid').length} paid
          </div>
        </div>
        <div className={`rounded-xl p-5 border ${totalOutstanding > 0 ? 'bg-orange/5 border-orange/20' : 'bg-white border-surface-100'}`}>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Outstanding</div>
          <div className={`text-2xl font-bold tabular-nums ${totalOutstanding > 0 ? 'text-orange-dark' : 'text-charcoal'}`}>
            {fmtMoney(totalOutstanding)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {overdueInvoices.length > 0 ? (
              <span className="text-red-600 font-semibold">{overdueInvoices.length} overdue</span>
            ) : (
              'No overdue invoices'
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Traffic */}
      <div className="mb-8">
        <PortfolioTrafficCard />
      </div>

      {/* Pipeline (leads) */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Lead Pipeline
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pipelineCounts.map((p) => (
            <div key={p.key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500">{p.label}</span>
                <span className="text-lg font-bold text-charcoal">{p.count}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                <div
                  className={`h-full ${p.bar} transition-all`}
                  style={{ width: `${(p.count / pipelineMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Pipeline */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Project Pipeline
          </h2>
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-xs font-semibold text-orange hover:text-orange-dark"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {projectStatusCounts.map((p) => (
            <div key={p.key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className={`text-xs font-medium ${p.text}`}>{p.label}</span>
                <span className="text-lg font-bold text-charcoal">{p.count}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                <div
                  className={`h-full ${p.bar} transition-all`}
                  style={{ width: `${(p.count / projectStatusMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by priority */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Open Tasks by Priority
          </h2>
          <div className="text-xs text-gray-500">
            {tasksWithoutProject > 0 && (
              <span className="text-orange-dark font-semibold">{tasksWithoutProject} unassigned</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tasksByPriority.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => navigate('/admin/tasks')}
              className="text-left rounded-lg border border-surface-100 p-3 hover:border-orange/40 hover:bg-surface/30 transition-colors"
            >
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 ${p.chipClass}`}
              >
                {p.label}
              </span>
              <div className="text-2xl font-bold text-charcoal tabular-nums">{p.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent leads + tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Recent Leads
            </h2>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-semibold text-orange hover:text-orange-dark"
            >
              View all
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No leads yet.</div>
          ) : (
            <ul className="divide-y divide-surface-100">
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/leads/${lead.id}`)}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-surface/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-charcoal truncate">
                        {lead.name}
                      </p>
                      {lead.company && (
                        <p className="text-xs text-gray-500 truncate">{lead.company}</p>
                      )}
                    </div>
                    <StatusBadge status={lead.status} />
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Open Tasks
            </h2>
            <button
              onClick={() => navigate('/admin/tasks')}
              className="text-xs font-semibold text-orange hover:text-orange-dark"
            >
              View all
            </button>
          </div>
          {recentTasks.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No open tasks.</div>
          ) : (
            <ul className="divide-y divide-surface-100">
              {recentTasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/tasks')}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-surface/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-charcoal truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] mt-0.5">
                        {task.project_name ? (
                          <span className="font-semibold text-orange-dark bg-orange-glow px-1.5 py-0.5 rounded">
                            {task.project_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No project</span>
                        )}
                        {task.description && (
                          <span className="text-gray-500 truncate">{task.description}</span>
                        )}
                      </div>
                    </div>
                    {task.priority && (
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
                          priorityStyles[task.priority] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent invoices */}
      {invoices.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-surface-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Recent Invoices
            </h2>
            <button
              onClick={() => navigate('/admin/invoices')}
              className="text-xs font-semibold text-orange hover:text-orange-dark"
            >
              View all
            </button>
          </div>
          <ul className="divide-y divide-surface-100">
            {recentInvoices.map((inv) => (
              <li key={inv.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                  className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-surface/40 transition-colors"
                >
                  <span className="font-mono text-xs text-gray-400">#{inv.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {inv.client_name || '—'}
                    </p>
                    {inv.description && (
                      <p className="text-xs text-gray-500 truncate">{inv.description}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-charcoal tabular-nums whitespace-nowrap">
                    {fmtMoney(inv.amount_cents || 0)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${
                      inv.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : inv.status === 'sent'
                        ? 'bg-blue-100 text-blue-700'
                        : inv.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {inv.status || 'draft'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
