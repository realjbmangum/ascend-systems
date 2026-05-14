/**
 * PageIsland — one React island per Astro page.
 *
 * Astro can only serialize JSON-safe props across the SSR→hydration
 * boundary, so we can't pass a ReactNode `children`. Instead, the island
 * takes a `page` name string and dynamically renders the matching page
 * component, wrapped in a MemoryRouter so the existing react-router-dom
 * call sites (Link, useLocation, useParams) work without a BrowserRouter
 * at the root.
 *
 * For routes that need `useParams` (case study slug), pass `routePattern`
 * and `initialPath` — the shim mounts a <Routes>/<Route> pair so
 * useParams returns the parsed values.
 *
 * SSR behavior: Astro renders this component to HTML during build, so
 * Googlebot sees the full marketing content in the first response. Adding
 * `client:load` (or `client:visible`) on the island element in the .astro
 * file re-hydrates it client-side for interactivity.
 */

import { type MouseEvent } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Services from '../pages/Services';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Portfolio from '../pages/Portfolio';
import CaseStudy from '../pages/CaseStudy';
import CostCalculator from '../pages/tools/CostCalculator';

type PageName =
  | 'home'
  | 'services'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'portfolio'
  | 'case-study'
  | 'cost-calculator';

const COMPONENTS: Record<PageName, React.ComponentType> = {
  home: Home,
  services: Services,
  about: About,
  contact: Contact,
  privacy: Privacy,
  terms: Terms,
  portfolio: Portfolio,
  'case-study': CaseStudy,
  'cost-calculator': CostCalculator,
};

interface Props {
  page: PageName;
  initialPath: string;
  /** Optional react-router pattern when the page uses useParams. */
  routePattern?: string;
}

/**
 * MemoryRouter doesn't change the browser URL, so internal react-router
 * <Link> clicks navigate in-memory only — the user sees nothing happen.
 *
 * react-router's Link calls e.preventDefault() during its own onClick
 * handler, so a bubble-phase listener arrives too late (defaultPrevented
 * is already true). Using onClickCapture lets us intercept BEFORE the
 * Link handler runs and force a real navigation.
 */
function handleInternalLinkCapture(e: MouseEvent<HTMLDivElement>) {
  if (e.button !== 0) return; // ignore middle/right click
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let cmd+click open new tab
  const anchor = (e.target as HTMLElement).closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href) return;
  // Only intercept same-origin, non-hash, non-mailto/tel/external links.
  if (
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return;
  }
  if (anchor.getAttribute('target') === '_blank') return;
  e.preventDefault();
  e.stopPropagation();
  window.location.assign(href);
}

export default function PageIsland({ page, initialPath, routePattern }: Props) {
  const Component = COMPONENTS[page];
  if (!Component) {
    return <div>Unknown page: {page}</div>;
  }

  return (
    <div onClickCapture={handleInternalLinkCapture}>
      <MemoryRouter initialEntries={[initialPath]} initialIndex={0}>
        {routePattern ? (
          <Routes>
            <Route path={routePattern} element={<Component />} />
          </Routes>
        ) : (
          <Component />
        )}
      </MemoryRouter>
    </div>
  );
}
