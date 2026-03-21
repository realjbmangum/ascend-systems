import { siteConfig } from '../config/site';

const BASE = siteConfig.apiUrl;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}

export const api = {
  // Public
  submitLead: (data: Record<string, string>) =>
    request('/leads', { method: 'POST', body: JSON.stringify(data) }),

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

  // Admin — Stats
  getStats: () => request<any>('/stats'),
};
