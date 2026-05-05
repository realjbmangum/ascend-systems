import { useNavigate } from 'react-router-dom';

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
}

const STATUSES = [
  'planning',
  'scoping',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
] as const;

const columnAccent: Record<string, { header: string; badge: string; bar: string }> = {
  planning: {
    header: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500',
  },
  scoping: {
    header: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    bar: 'bg-purple-500',
  },
  in_progress: {
    header: 'text-orange',
    badge: 'bg-orange-glow text-orange-dark',
    bar: 'bg-orange',
  },
  on_hold: {
    header: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    bar: 'bg-yellow-500',
  },
  completed: {
    header: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    bar: 'bg-green-500',
  },
  cancelled: {
    header: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-600',
    bar: 'bg-gray-400',
  },
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectsKanban({ projects }: ProjectsKanbanProps) {
  const navigate = useNavigate();

  const grouped = STATUSES.reduce<Record<string, Project[]>>((acc, status) => {
    acc[status] = projects.filter((p) => p.status === status);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min">
        {STATUSES.map((status) => {
          const accent = columnAccent[status];
          const columnProjects = grouped[status];
          return (
            <div
              key={status}
              className="min-w-[240px] w-[240px] flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200"
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
                    {columnProjects.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {columnProjects.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1 py-4 text-center">
                      No projects
                    </p>
                  ) : (
                    columnProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                        className="text-left bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-orange transition-all"
                      >
                        <h4 className="text-sm font-semibold text-charcoal mb-1 line-clamp-2">
                          {project.name}
                        </h4>
                        {project.client_name && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {project.client_name}
                          </p>
                        )}
                        {project.project_type && (
                          <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {project.project_type}
                          </span>
                        )}
                      </button>
                    ))
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
