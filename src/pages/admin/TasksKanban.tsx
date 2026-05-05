import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  type?: string;
  status: string;
  priority?: string;
  project_id?: number | null;
  project_name?: string | null;
  client_name?: string | null;
  created_at?: string;
}

interface TasksKanbanProps {
  tasks: Task[];
  onMove?: (taskId: number, newStatus: string) => void | Promise<void>;
  onClick?: (task: Task) => void;
  /** Compact card without project chip — used when already filtered to one project. */
  hideProjectChip?: boolean;
}

const STATUSES = ['open', 'in_progress', 'done'] as const;

const columnAccent: Record<string, { header: string; badge: string; bar: string; ring: string }> = {
  open: {
    header: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500',
    ring: 'ring-blue-400',
  },
  in_progress: {
    header: 'text-orange',
    badge: 'bg-orange-glow text-orange-dark',
    bar: 'bg-orange',
    ring: 'ring-orange',
  },
  done: {
    header: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    bar: 'bg-green-500',
    ring: 'ring-green-400',
  },
};

const priorityStyles: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-glow text-orange-dark',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
};

function formatStatus(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TasksKanban({ tasks, onMove, onClick, hideProjectChip }: TasksKanbanProps) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const grouped = STATUSES.reduce<Record<string, Task[]>>((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggingId(task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(task.id));
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) setDragOverColumn(status);
  };

  const handleColumnDragLeave = (e: React.DragEvent, status: string) => {
    if (e.currentTarget === e.target && dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/plain');
    const taskId = Number(idStr);
    setDragOverColumn(null);
    setDraggingId(null);
    if (!taskId || !onMove) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;
    onMove(taskId, newStatus);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min">
        {STATUSES.map((status) => {
          const accent = columnAccent[status];
          const columnTasks = grouped[status];
          const isDragOver = dragOverColumn === status;
          return (
            <div
              key={status}
              onDragOver={(e) => handleColumnDragOver(e, status)}
              onDragLeave={(e) => handleColumnDragLeave(e, status)}
              onDrop={(e) => handleColumnDrop(e, status)}
              className={`min-w-[300px] w-[300px] flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200 transition-all ${
                isDragOver ? `ring-2 ${accent.ring} bg-white` : ''
              }`}
            >
              <div className={`h-1 rounded-t-xl ${accent.bar}`} />
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold ${accent.header}`}>
                    {formatStatus(status)}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${accent.badge}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {columnTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1 py-4 text-center pointer-events-none">
                      {isDragOver ? 'Drop here' : 'No tasks'}
                    </p>
                  ) : (
                    columnTasks.map((task) => {
                      const isDragging = draggingId === task.id;
                      return (
                        <div
                          key={task.id}
                          draggable={Boolean(onMove)}
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onClick?.(task)}
                          className={`text-left bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-orange transition-all ${
                            onMove ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                          } ${isDragging ? 'opacity-40' : ''}`}
                        >
                          <h4 className="text-sm font-semibold text-charcoal mb-1.5 line-clamp-2 pointer-events-none">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2 pointer-events-none">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 flex-wrap pointer-events-none">
                            {task.priority && task.priority !== 'medium' && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                  priorityStyles[task.priority] || 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {task.priority}
                              </span>
                            )}
                            {!hideProjectChip && task.project_name && (
                              <span className="text-[10px] font-semibold text-orange-dark bg-orange-glow px-1.5 py-0.5 rounded truncate max-w-[180px]">
                                {task.project_name}
                              </span>
                            )}
                            {!hideProjectChip && !task.project_name && (
                              <span className="text-[10px] text-gray-400 italic">No project</span>
                            )}
                            {task.type && task.type !== 'manual' && (
                              <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                {task.type.replace(/_/g, ' ')}
                              </span>
                            )}
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
