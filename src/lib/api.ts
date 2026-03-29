// =============================================================================
// JIBRIL IMMO CLOUD — API CLIENT (v2 — compatible backend 2 schemas)
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV
    ? 'http://localhost:8000/api'
    : 'https://api.jibrilimmo.cloud/api');

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.detail || error.message || 'Une erreur est survenue');
  }

  return response.json();
};

// Raccourci rétrocompatible
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  return apiClient(endpoint, options);
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiClient('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () =>
      apiClient('/logout', { method: 'POST' }),
    register: (username: string, email: string, password: string) =>
      apiClient('/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
  },

  properties: {
    list: () => apiClient('/properties/'),
    detail: (id: string) => apiClient(`/properties/${id}`),
    create: (data: Record<string, unknown>) =>
      apiClient('/properties/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient(`/properties/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/properties/${id}`, { method: 'DELETE' }),
  },

  contacts: {
    list: () => apiClient('/contacts/'),
    detail: (id: string) => apiClient(`/contacts/${id}`),
    create: (data: Record<string, unknown>) =>
      apiClient('/contacts/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/contacts/${id}`, { method: 'DELETE' }),
  },

  transactions: {
    list: () => apiClient('/transactions/'),
    detail: (id: string) => apiClient(`/transactions/${id}`),
    create: (data: Record<string, unknown>) =>
      apiClient('/transactions/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/transactions/${id}`, { method: 'DELETE' }),
  },

  sources: {
    list: () => apiClient('/sources/'),
    create: (data: { name: string; url: string; active?: boolean }) =>
      apiClient('/sources/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; url?: string; active?: boolean }) =>
      apiClient(`/sources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/sources/${id}`, { method: 'DELETE' }),
    toggle: (id: string) =>
      apiClient(`/sources/${id}/toggle`, { method: 'PATCH' }),
  },

  leads: {
    list: (params?: { source?: string; ville?: string; statut?: string; type_bien?: string; prix_min?: string; prix_max?: string; limit?: number; offset?: number }) => {
      const queryString = params ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) as Record<string, string>
      ).toString() : '';
      return apiClient(`/leads/${queryString}`);
    },
    count: () => apiClient('/leads/count'),
    stats: () => apiClient('/leads/stats'),
    update: (id: string, data: { statut?: string; notes?: string }) =>
      apiClient(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/leads/${id}`, { method: 'DELETE' }),
  },

  scraping: {
    scan: (source?: string, url?: string) =>
      apiClient('/scan/', { method: 'POST', body: JSON.stringify({ source, url }) }),
    scanAll: () =>
      apiClient('/scan/all', { method: 'POST' }),
  },

  analysis: {
    goodDeals: (params?: { ville?: string; quartier?: string; type_bien?: string; discount_threshold?: number }) =>
      apiClient('/analysis/good-deals', { method: 'POST', body: JSON.stringify(params || {}) }),
    quartiers: (ville?: string) =>
      apiClient(`/analysis/quartiers${ville ? '?ville=' + ville : ''}`),
    exportCsvUrl: (params?: { ville?: string; source?: string }) => {
      const qs = params ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) as Record<string, string>
      ).toString() : '';
      return `${API_BASE_URL}/analysis/export-csv${qs}`;
    },
  },

  health: () => apiClient('/health'),
  systemStatus: () => apiClient('/system/status'),

  settings: {
    get: () => apiClient('/settings/'),
    save: (data: Record<string, unknown>) =>
      apiClient('/settings/', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export const startScan = (source: string) =>
  apiClient('/scan/', {
    method: 'POST',
    body: JSON.stringify({ source }),
  });
