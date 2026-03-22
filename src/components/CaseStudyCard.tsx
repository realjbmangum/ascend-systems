interface CaseStudyCardProps {
  name: string;
  url: string;
  description: string;
  techTags: string[];
}

export default function CaseStudyCard({ name, url, description, techTags }: CaseStudyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-100 hover:shadow-md transition-shadow overflow-hidden">
      {/* Image placeholder */}
      <div className="h-48 bg-charcoal-light flex items-center justify-center">
        <span className="text-5xl font-bold text-orange/80">{name.charAt(0)}</span>
      </div>
      <div className="p-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-lg font-semibold text-charcoal">{name}</h3>
        <a
          href={`https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange hover:text-orange-dark font-medium transition-colors"
        >
          {url}
        </a>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {techTags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono font-medium bg-surface px-2.5 py-1 rounded-md text-charcoal"
          >
            {tag}
          </span>
        ))}
      </div>
      </div>
    </div>
  );
}
