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
  convertLead: (id: number) =>
    request(`/leads/${id}/convert`, { method: 'POST' }),

  // Admin — Clients
  getClients: () => request<any[]>('/clients'),
  getClient: (id: number) => request<any>(`/clients/${id}`),
  createClient: (data: Record<string, any>) =>
    request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: number, data: Record<string, any>) =>
    request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Admin — Projects
  getProjects: () => request<any[]>('/projects'),
  getProject: (id: number) => request<any>(`/projects/${id}`),
  createProject: (data: Record<string, any>) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: Record<string, any>) =>
    request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

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
  getInvoices: () => request<any[]>('/invoices'),
  getInvoice: (id: number) => request<any>(`/invoices/${id}`),
  createInvoice: (data: Record<string, any>) =>
    request('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id: number, data: Record<string, any>) =>
    request(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  sendInvoice: (id: number) =>
    request(`/invoices/${id}/send`, { method: 'POST' }),

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

  // Portal (client)
  getPortalProjects: () => request<any[]>('/portal/projects'),
  getPortalProject: (id: number) => request<any>(`/portal/projects/${id}`),
  getPortalInvoices: () => request<any[]>('/portal/invoices'),
};
