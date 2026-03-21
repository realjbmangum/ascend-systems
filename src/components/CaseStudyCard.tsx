interface CaseStudyCardProps {
  name: string;
  url: string;
  description: string;
  techTags: string[];
}

export default function CaseStudyCard({ name, url, description, techTags }: CaseStudyCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-100 hover:shadow-md transition-shadow">
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
            className="text-xs font-mono font-medium bg-surface px-2.5 py-1 rounded-md text-charcoal-lighter"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
