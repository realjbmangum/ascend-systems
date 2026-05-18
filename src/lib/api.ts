import { siteConfig } from '../config/site';

const BASE = siteConfig.apiUrl;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}

export const api = {
  // Public — Forms
  submitLead: (data: Record<string, string>) =>
    request('/leads', { method: 'POST', body: JSON.stringify(data) }),
  submitContact: (data: Record<string, string>) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  submitIntake: (data: Record<string, any>) =>
    request('/intake', { method: 'POST', body: JSON.stringify(data) }),
  submitCostCalculator: (data: Record<string, any>) =>
    request<{
      success: boolean;
      id: number;
      result: {
        base_waste: number;
        error_overhead: number;
        customer_cost: number;
        total_annual: number;
        total_monthly: number;
        build_band: 'diy' | 'light' | 'custom' | 'strategic';
        build_price_low: number;
        build_price_high: number;
        payback_months_low: number;
        payback_months_high: number;
        recommendation: string;
      };
    }>('/tools/cost-calculator', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  requestMagicLink: (email: string) =>
    request<{ ok: boolean }>('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  verifyMagicLink: (token: string) =>
    request<{ ok: boolean; role: string }>(`/auth/verify/${token}`),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () =>
    request<{ email: string; role: 'admin' | 'client'; client_id?: number } | null>('/auth/me'),

  // Admin — Leads
  getLeads: (status?: string) =>
    request<any[]>(`/leads${status ? `?status=${status}` : ''}`),
  getLead: (id: number) => request<any>(`/leads/${id}`),
  updateLead: (id: number, data: Record<string, any>) =>
    request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteLead: (id: number) => request(`/leads/${id}`, { method: 'DELETE' }),
  convertLead: (id: number) =>
    request(`/leads/${id}/convert`, { method: 'POST' }),

  // Admin — Clients
  getClients: () => request<any[]>('/clients'),
  getClient: (id: number) => request<any>(`/clients/${id}`),
  createClient: (data: Record<string, any>) =>
    request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: number, data: Record<string, any>) =>
    request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteClient: (id: number) => request(`/clients/${id}`, { method: 'DELETE' }),

  // Admin — Projects
  getProjects: () => request<any[]>('/projects'),
  getProject: (id: number) => request<any>(`/projects/${id}`),
  createProject: (data: Record<string, any>) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: Record<string, any>) =>
    request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: number) => request(`/projects/${id}`, { method: 'DELETE' }),
  getProjectTasks: (projectId: number) =>
    request<any[]>(`/projects/${projectId}/tasks`),

  // Admin — Project Files (R2)
  getProjectFiles: (projectId: number) =>
    request<any[]>(`/projects/${projectId}/files`),
  uploadProjectFile: (projectId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${BASE}/projects/${projectId}/files`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    }).then((r) => {
      if (!r.ok) throw new Error('Upload failed');
      return r.json() as Promise<{ key: string; name: string; size: number }>;
    });
  },
  deleteProjectFile: (projectId: number, filekey: string) =>
    request(`/projects/${projectId}/files/${encodeURIComponent(filekey)}`, { method: 'DELETE' }),
  getProjectFileUrl: (projectId: number, filekey: string) =>
    `${BASE}/projects/${projectId}/files/${encodeURIComponent(filekey)}`,

  // Admin — Lead Files (R2)
  getLeadFiles: (leadId: number) => request<any[]>(`/leads/${leadId}/files`),
  uploadLeadFile: (leadId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${BASE}/leads/${leadId}/files`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    }).then((r) => {
      if (!r.ok) throw new Error('Upload failed');
      return r.json() as Promise<{ key: string; name: string; size: number }>;
    });
  },
  deleteLeadFile: (leadId: number, filekey: string) =>
    request(`/leads/${leadId}/files/${encodeURIComponent(filekey)}`, { method: 'DELETE' }),
  getLeadFileUrl: (leadId: number, filekey: string) =>
    `${BASE}/leads/${leadId}/files/${encodeURIComponent(filekey)}`,

  // Admin — Tasks
  getTasks: (params?: { status?: string; type?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.type) q.set('type', params.type);
    const qs = q.toString();
    return request<any[]>(`/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (data: Record<string, any>) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: number, data: Record<string, any>) =>
    request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: number) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Admin — Project Notes
  getProjectNotes: (projectId: number) =>
    request<any[]>(`/projects/${projectId}/notes`),
  createProjectNote: (projectId: number, data: Record<string, any>) =>
    request(`/projects/${projectId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProjectNote: (projectId: number, noteId: number, data: Record<string, any>) =>
    request(`/projects/${projectId}/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProjectNote: (projectId: number, noteId: number) =>
    request(`/projects/${projectId}/notes/${noteId}`, { method: 'DELETE' }),

  // Admin — Invoices
  getInvoices: (clientId?: number) =>
    request<any[]>(`/invoices${clientId ? `?client_id=${clientId}` : ''}`),
  getInvoice: (id: number) => request<any>(`/invoices/${id}`),
  createInvoice: (data: Record<string, any>) =>
    request('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id: number, data: Record<string, any>) =>
    request(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteInvoice: (id: number) => request(`/invoices/${id}`, { method: 'DELETE' }),
  sendInvoice: (id: number) =>
    request(`/invoices/${id}/send`, { method: 'POST' }),
  pushRecurringInvoice: (id: number) =>
    request(`/invoices/${id}/push-recurring`, { method: 'POST' }),

  // Admin — Lead Activities
  getActivities: (leadId: number) =>
    request<any[]>(`/activities?lead_id=${leadId}`),
  createActivity: (data: Record<string, any>) =>
    request<{ success: boolean; id: number }>('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateActivity: (id: number, data: Record<string, any>) =>
    request(`/activities/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteActivity: (id: number) =>
    request(`/activities/${id}`, { method: 'DELETE' }),

  // Admin — Proposals
  getProposals: () => request<any[]>('/proposals'),
  getProposal: (id: number) => request<any>(`/proposals/${id}`),
  createProposal: (data: Record<string, any>) =>
    request<{ success: boolean; id: number; sign_token: string }>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProposal: (id: number, data: Record<string, any>) =>
    request(`/proposals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProposal: (id: number) =>
    request(`/proposals/${id}`, { method: 'DELETE' }),
  sendProposal: (id: number) =>
    request<{
      success: boolean;
      sign_url: string;
      emailed: boolean;
      recipient: string | null;
    }>(`/proposals/${id}/send`, {
      method: 'POST',
    }),

  // Public — Proposal sign
  getProposalByToken: (token: string) =>
    request<any>(`/proposals/sign/${token}`),
  signProposal: (
    token: string,
    data: {
      signer_name: string;
      signer_title?: string;
      signer_email: string;
      msa_accepted: boolean;
    }
  ) =>
    request<{ success: boolean; signed_at: string }>(
      `/proposals/sign/${token}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Admin — Subscriptions
  getSubscriptions: () => request<any[]>('/subscriptions'),
  deleteSubscription: (id: number) =>
    request(`/subscriptions/${id}`, { method: 'DELETE' }),

  // Admin — Email Sequences
  getEmailSequences: () => request<any[]>('/email-sequences'),
  getEmailSequence: (id: number) => request<any>(`/email-sequences/${id}`),
  createEmailSequence: (data: Record<string, any>) =>
    request('/email-sequences', { method: 'POST', body: JSON.stringify(data) }),
  updateEmailSequence: (id: number, data: Record<string, any>) =>
    request(`/email-sequences/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  addEmailSequenceStep: (sequenceId: number, data: Record<string, any>) =>
    request(`/email-sequences/${sequenceId}/steps`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  enrollInSequence: (data: Record<string, any>) =>
    request('/email-enrollments', { method: 'POST', body: JSON.stringify(data) }),

  // Admin — Stats
  getStats: () => request<any>('/stats'),

  // Admin — Project Resources
  getProjectResources: (projectId: number) =>
    request<Array<{
      id: number;
      project_id: number;
      type: string;
      title: string;
      content_markdown: string | null;
      url: string | null;
      sort_order: number;
      source_path: string | null;
      created_at: string;
    }>>(`/resources?project_id=${projectId}`),
  createResource: (data: {
    project_id: number;
    type: string;
    title: string;
    content_markdown?: string;
    url?: string;
    source_path?: string;
  }) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id: number, data: Record<string, any>) =>
    request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteResource: (id: number) =>
    request(`/resources/${id}`, { method: 'DELETE' }),

  // Admin — Analytics
  getPortfolioAnalytics: (days = 30) =>
    request<{
      period_days: number;
      since: string;
      total_pageviews: number;
      total_visitors: number;
      projects: Array<{
        project_id: number;
        project_name: string;
        analytics_domain: string | null;
        cloudflare_zone_tag: string | null;
        analytics_source: string | null;
        analytics_last_fetched_at: string | null;
        pageviews: number | null;
        visitors: number | null;
        latest_date: string | null;
      }>;
    }>(`/analytics?days=${days}`),
  getProjectAnalytics: (projectId: number, days = 30) =>
    request<{
      project: {
        id: number;
        name: string;
        analytics_domain: string | null;
        cloudflare_zone_tag: string | null;
        analytics_source: string | null;
        analytics_last_fetched_at: string | null;
      };
      period_days: number;
      since: string;
      totals: { pageviews: number; visitors: number };
      daily: Array<{
        date: string;
        source: string;
        pageviews: number;
        visitors: number;
        requests: number | null;
      }>;
    }>(`/analytics/projects/${projectId}?days=${days}`),
  refreshProjectAnalytics: (projectId: number) =>
    request<{ success: boolean; days_fetched: number }>(
      `/analytics/projects/${projectId}/refresh`,
      { method: 'POST' }
    ),
  refreshAllAnalytics: () =>
    request<{
      ok: boolean;
      refreshed: number;
      failed: number;
      errors: Array<{ project: string; error: string }>;
    }>('/analytics/refresh-all', { method: 'POST' }),
  listCfZones: () =>
    request<{
      count: number;
      zones: Array<{ id: string; name: string; status: string }>;
    }>('/analytics/cf-zones'),
  autoMatchCfZones: () =>
    request<{
      cf_zones_count: number;
      matched: number;
      unmatched: number;
      matched_detail: Array<{ project: string; domain: string; zone_id: string }>;
      unmatched_detail: Array<{ project: string; domain: string }>;
      available_zones: string[];
    }>('/analytics/auto-match', { method: 'POST' }),
  recordManualSnapshot: (
    projectId: number,
    data: { date?: string; pageviews: number; visitors: number; note?: string }
  ) =>
    request<{ success: boolean }>(`/analytics/projects/${projectId}/manual`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Portal (client)
  getPortalProjects: () => request<any[]>('/portal/projects'),
  getPortalProject: (id: number) => request<any>(`/portal/projects/${id}`),
  getPortalInvoices: () => request<any[]>('/portal/invoices'),
};
