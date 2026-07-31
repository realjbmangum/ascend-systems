import { useState } from 'react';
import { stageAccent } from '../../components/kiln/status';

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
              className={`min-w-[270px] w-[270px] flex-shrink-0 bg-surface rounded-xl border transition-all ${
                isDragOver ? 'ring-2 ring-orange bg-white border-orange' : 'border-surface-100'
              }`}
            >
              <div className="h-1 rounded-t-xl" style={{ background: stageAccent(stage) }} />
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-charcoal">
                    {formatStage(stage)}
                  </h3>
                  <span className="k-badge k-neutral">{columnLeads.length}</span>
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
                          className={`text-left bg-white rounded-xl border border-surface-100 p-3 hover:border-orange transition-colors ${
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
                              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#3E6B48', background: '#E6EFE7' }}>
                                {value}
                              </span>
                            )}
                            {lead.expected_close_date && (
                              <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-surface-100">
                                {new Date(
                                  lead.expected_close_date
                                ).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                            {lead.owner && (
                              <span className="text-[10px] font-semibold text-gray-600 bg-surface-100 px-1.5 py-0.5 rounded">
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
