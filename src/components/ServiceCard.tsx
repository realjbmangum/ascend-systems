import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

export default function ServiceCard({ icon, title, description, linkTo }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-surface-100">
      <div className="w-12 h-12 bg-orange-glow rounded-lg flex items-center justify-center text-orange mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      <Link to={linkTo} className="text-sm font-medium text-orange hover:text-orange-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 rounded">
        Learn more &rarr;
      </Link>
    </div>
  );
}
