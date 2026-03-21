import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', description);
    } else {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      meta.setAttribute('content', description);
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return null;
}
