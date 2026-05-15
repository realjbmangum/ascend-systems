import { useState } from 'react';

interface Lead {
  id: number;
  name: string;
  company?: string | null;
  title?: string | null;
  status: string;
  deal_value_cents?: number | null;
  expected_close_date?: string | null;
  owner?: string | null;
  labels?: string | null;
}

interface LeadsKanbanProps {
  leads: Lead[];
  onMove?: (leadId: number, newStatus: string) => void | Promise<void>;
  onClick?: (lead: Lead) => void;
}

const STAGES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
] as const;

const accent: Record<
  string,
  { header: string; badge: string; bar: string; ring: string }
> = {
  new: {
    header: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500',
    ring: 'ring-blue-400',
  },
  contacted: {
    header: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    bar: 'bg-yellow-500',
    ring: 'ring-yellow-400',
  },
  qualified: {
    header: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    bar: 'bg-purple-500',
    ring: 'ring-purple-400',
  },
  proposal_sent: {
    header: 'text-orange',
    badge: 'bg-orange-glow text-orange-dark',
    bar: 'bg-orange',
    ring: 'ring-orange',
  },
  won: {
    header: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    bar: 'bg-green-500',
    ring: 'ring-green-400',
  },
  lost: {
    header: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    bar: 'bg-red-500',
    ring: 'ring-red-400',
  },
};

function formatStage(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(cents?: number | null): string | null {
  if (!cents) return null;
  return `$${(cents / 100).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

export default function LeadsKanban({ leads, onMove, onClick }: LeadsKanbanProps) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const grouped = STAGES.reduce<Record<string, Lead[]>>((acc, stage) => {
    acc[stage] = leads.filter((l) => l.status === stage);
    return acc;
  }, {});

  const columnValue = (stage: string) =>
    formatValue(
      grouped[stage].reduce((sum, l) => sum + (l.deal_value_cents || 0), 0)
    );

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = Number(e.dataTransfer.getData('text/plain'));
    setDragOverColumn(null);
    setDraggingId(null);
    if (!leadId || !onMove) return;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;
    onMove(leadId, newStatus);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min">
        {STAGES.map((stage) => {
          const a = accent[stage];
          const columnLeads = grouped[stage];
          const isDragOver = dragOverColumn === stage;
          const total = columnValue(stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverColumn !== stage) setDragOverColumn(stage);
              }}
              onDragLeave={(e) => {
                // Only clear when the cursor actually leaves the column —
                // dragleave also fires when moving between child cards.
                if (
                  dragOverColumn === stage &&
                  !e.currentTarget.contains(e.relatedTarget as Node | null)
                )
                  setDragOverColumn(null);
              }}
              onDrop={(e) => handleDrop(e, stage)}
              className={`min-w-[270px] w-[270px] flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200 transition-all ${
                isDragOver ? `ring-2 ${a.ring} bg-white` : ''
              }`}
            >
              <div className={`h-1 rounded-t-xl ${a.bar}`} />
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-semibold ${a.header}`}>
                    {formatStage(stage)}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.badge}`}
                  >
                    {columnLeads.length}
                  </span>
                </div>
                {total && (
                  <p className="text-xs text-gray-400 mb-2">{total} in stage</p>
                )}
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {columnLeads.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1 py-4 text-center pointer-events-none">
                      {isDragOver ? 'Drop here' : 'No leads'}
                    </p>
                  ) : (
                    columnLeads.map((lead) => {
                      const value = formatValue(lead.deal_value_cents);
                      const labels = (lead.labels || '')
                        .split(',')
                        .map((l) => l.trim())
                        .filter(Boolean);
                      return (
                        <div
                          key={lead.id}
                          draggable={Boolean(onMove)}
                          onDragStart={(e) => {
                            setDraggingId(lead.id);
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', String(lead.id));
                          }}
                          onDragEnd={() => {
                            setDraggingId(null);
                            setDragOverColumn(null);
                          }}
                          onClick={() => onClick?.(lead)}
                          className={`text-left bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-orange transition-all ${
                            onMove
                              ? 'cursor-grab active:cursor-grabbing'
                              : 'cursor-pointer'
                          } ${draggingId === lead.id ? 'opacity-40' : ''}`}
                        >
                          <h4 className="text-sm font-semibold text-charcoal line-clamp-2 pointer-events-none">
                            {lead.company || lead.name}
                          </h4>
                          <p className="text-xs text-gray-500 pointer-events-none">
                            {lead.name}
                            {lead.title ? ` · ${lead.title}` : ''}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mt-2 pointer-events-none">
                            {value && (
                              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                {value}
                              </span>
                            )}
                            {lead.expected_close_date && (
                              <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                {new Date(
                                  lead.expected_close_date
                                ).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                            {lead.owner && (
                              <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                {lead.owner}
                              </span>
                            )}
                            {labels.map((label) => (
                              <span
                                key={label}
                                className="text-[10px] font-semibold text-orange-dark bg-orange-glow px-1.5 py-0.5 rounded"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
