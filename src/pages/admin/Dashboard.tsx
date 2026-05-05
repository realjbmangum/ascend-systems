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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getLeads().catch(() => []),
      api.getClients().catch(() => []),
      api.getProjects().catch(() => []),
      api.getTasks({ status: 'open' }).catch(() => []),
    ])
      .then(([l, c, p, t]) => {
        setLeads(l || []);
        setClients(c || []);
        setProjects(p || []);
        setTasks(t || []);
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
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatCard
          label="Active Clients"
          value={activeClients}
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
        <StatCard
          label="Open Tasks"
          value={tasks.length}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </div>

      {/* Portfolio Traffic */}
      <div className="mb-8">
        <PortfolioTrafficCard />
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-8">
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
                      {task.description && (
                        <p className="text-xs text-gray-500 truncate">{task.description}</p>
                      )}
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
    </div>
  );
}
