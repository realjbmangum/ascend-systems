import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import PortalLayout from './components/PortalLayout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import LeadDetail from './pages/admin/LeadDetail';
import CreateLead from './pages/admin/CreateLead';
import Clients from './pages/admin/Clients';
import ClientDetail from './pages/admin/ClientDetail';
import CreateClient from './pages/admin/CreateClient';
import Projects from './pages/admin/Projects';
import ProjectDetail from './pages/admin/ProjectDetail';
import CreateProject from './pages/admin/CreateProject';
import Tasks from './pages/admin/Tasks';
import Invoices from './pages/admin/Invoices';
import InvoiceDetail from './pages/admin/InvoiceDetail';
import CreateInvoice from './pages/admin/CreateInvoice';
import Subscriptions from './pages/admin/Subscriptions';
import Proposals from './pages/admin/Proposals';
import CreateProposal from './pages/admin/CreateProposal';
import ProposalDetail from './pages/admin/ProposalDetail';
import Portfolio from './pages/Portfolio';
import CaseStudy from './pages/CaseStudy';
import ProposalSign from './pages/ProposalSign';
import EmailSequences from './pages/admin/EmailSequences';
import AdminLogin from './pages/admin/Login';
import AdminVerify from './pages/admin/Verify';
import PortalLogin from './pages/portal/Login';
import PortalProjects from './pages/portal/Projects';
import PortalProjectDetail from './pages/portal/ProjectDetail';
import PortalInvoices from './pages/portal/Invoices';

export default function App() {
  return (
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
  );
}
