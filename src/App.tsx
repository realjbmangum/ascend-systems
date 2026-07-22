import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Portfolio from './pages/Portfolio';

// Lazy-loaded layouts (admin/portal only)
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const PortalLayout = lazy(() => import('./components/PortalLayout'));

// Lazy-loaded admin pages — keep them out of the marketing bundle
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Leads = lazy(() => import('./pages/admin/Leads'));
const LeadDetail = lazy(() => import('./pages/admin/LeadDetail'));
const CreateLead = lazy(() => import('./pages/admin/CreateLead'));
const Clients = lazy(() => import('./pages/admin/Clients'));
const ClientDetail = lazy(() => import('./pages/admin/ClientDetail'));
const CreateClient = lazy(() => import('./pages/admin/CreateClient'));
const Projects = lazy(() => import('./pages/admin/Projects'));
const ProjectDetail = lazy(() => import('./pages/admin/ProjectDetail'));
const CreateProject = lazy(() => import('./pages/admin/CreateProject'));
const Tasks = lazy(() => import('./pages/admin/Tasks'));
const Invoices = lazy(() => import('./pages/admin/Invoices'));
const InvoiceDetail = lazy(() => import('./pages/admin/InvoiceDetail'));
const CreateInvoice = lazy(() => import('./pages/admin/CreateInvoice'));
const Subscriptions = lazy(() => import('./pages/admin/Subscriptions'));
const Proposals = lazy(() => import('./pages/admin/Proposals'));
const CreateProposal = lazy(() => import('./pages/admin/CreateProposal'));
const ProposalDetail = lazy(() => import('./pages/admin/ProposalDetail'));
const EmailSequences = lazy(() => import('./pages/admin/EmailSequences'));
const Seo = lazy(() => import('./pages/admin/Seo'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminVerify = lazy(() => import('./pages/admin/Verify'));

// Lazy-loaded portal pages
const PortalLogin = lazy(() => import('./pages/portal/Login'));
const PortalProjects = lazy(() => import('./pages/portal/Projects'));
const PortalProjectDetail = lazy(() => import('./pages/portal/ProjectDetail'));
const PortalInvoices = lazy(() => import('./pages/portal/Invoices'));

// Lazy-loaded standalone public pages
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const ProposalSign = lazy(() => import('./pages/ProposalSign'));
const CostCalculator = lazy(() => import('./pages/tools/CostCalculator'));

const SuspenseFallback = <div className="min-h-screen bg-bg" />;

export default function App() {
  return (
    <Suspense fallback={SuspenseFallback}>
      <Routes>
        {/* Public pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<CaseStudy />} />
          <Route path="/tools/cost-calculator" element={<CostCalculator />} />
        </Route>

        {/* Public proposal sign page */}
        <Route path="/proposals/:token" element={<ProposalSign />} />

        {/* Admin login & verification */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/auth/verify" element={<AdminVerify />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/create" element={<CreateLead />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/create" element={<CreateClient />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="proposals/create" element={<CreateProposal />} />
          <Route path="proposals/:id" element={<ProposalDetail />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="email" element={<EmailSequences />} />
          <Route path="seo" element={<Seo />} />
        </Route>

        {/* Client portal — login is unguarded */}
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalProjects />} />
          <Route path="projects" element={<PortalProjects />} />
          <Route path="projects/:id" element={<PortalProjectDetail />} />
          <Route path="invoices" element={<PortalInvoices />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
