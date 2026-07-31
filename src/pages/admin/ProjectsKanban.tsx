import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stageAccent } from '../../components/kiln/status';

interface Project {
  id: string | number;
  name: string;
  client_name?: string;
  status: string;
  project_type?: string;
  created_at?: string;
}

interface ProjectsKanbanProps {
  projects: Project[];
  onMove?: (projectId: number, newStatus: string) => void | Promise<void>;
}

const STATUSES = [
  'planning',
  'scoping',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
] as const;

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectsKanban({ projects, onMove }: ProjectsKanbanProps) {
  const navigate = useNavigate();
  const [draggingId, setDraggingId] = useState<string | number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const grouped = STATUSES.reduce<Record<string, Project[]>>((acc, status) => {
    acc[status] = projects.filter((p) => p.status === status);
    return acc;
  }, {});

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggingId(project.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(project.id));
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
    // Only clear when actually leaving the column (not just moving over a child)
    if (e.currentTarget === e.target && dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/plain');
    const projectId = Number(idStr);
    setDragOverColumn(null);
    setDraggingId(null);
    if (!projectId || !onMove) return;
    const project = projects.find((p) => Number(p.id) === projectId);
    if (!project || project.status === newStatus) return;
    onMove(projectId, newStatus);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min">
        {STATUSES.map((status) => {
          const columnProjects = grouped[status];
          const isDragOver = dragOverColumn === status;
          return (
            <div
              key={status}
              onDragOver={(e) => handleColumnDragOver(e, status)}
              onDragLeave={(e) => handleColumnDragLeave(e, status)}
              onDrop={(e) => handleColumnDrop(e, status)}
              className={`min-w-[240px] w-[240px] flex-shrink-0 bg-surface rounded-xl border transition-all ${
                isDragOver ? 'ring-2 ring-orange bg-white border-orange' : 'border-surface-100'
              }`}
            >
              <div className="h-1 rounded-t-xl" style={{ background: stageAccent(status) }} />
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal">
                    {formatStatus(status)}
                  </h3>
                  <span className="k-badge k-neutral">{columnProjects.length}</span>
                </div>
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {columnProjects.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1 py-4 text-center pointer-events-none">
                      {isDragOver ? 'Drop here' : 'No projects'}
                    </p>
                  ) : (
                    columnProjects.map((project) => {
                      const isDragging = draggingId === project.id;
                      return (
                        <div
                          key={project.id}
                          draggable={Boolean(onMove)}
                          onDragStart={(e) => handleDragStart(e, project)}
                          onDragEnd={handleDragEnd}
                          onClick={() => navigate(`/admin/projects/${project.id}`)}
                          className={`text-left bg-white rounded-xl border border-surface-100 p-4 hover:border-orange transition-colors cursor-grab active:cursor-grabbing ${
                            isDragging ? 'opacity-40' : ''
                          }`}
                        >
                          <h4 className="text-sm font-semibold text-charcoal mb-1 line-clamp-2 pointer-events-none">
                            {project.name}
                          </h4>
                          {project.client_name && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1 pointer-events-none">
                              {project.client_name}
                            </p>
                          )}
                          {project.project_type && (
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-surface-100 text-gray-600 px-2 py-0.5 rounded-full pointer-events-none">
                              {project.project_type}
                            </span>
                          )}
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
