// =============================================================================
// JIBRIL IMMO CLOUD — API CLIENT (v3 — full backend support)
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

// Upload multipart (no JSON content-type)
export const apiUpload = async (endpoint: string, formData: FormData) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.detail || error.message || 'Erreur upload');
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
    list: (params?: Record<string, string | number | undefined>) => {
      const filtered = params
        ? Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
        : {};
      const qs = Object.keys(filtered).length
        ? '?' + new URLSearchParams(filtered as Record<string, string>).toString()
        : '';
      return apiClient(`/leads/${qs}`);
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
    goodDeals: (params?: Record<string, unknown>) =>
      apiClient('/analysis/good-deals', { method: 'POST', body: JSON.stringify(params || {}) }),
    quartiers: (ville?: string) =>
      apiClient(`/analysis/quartiers${ville ? '?ville=' + ville : ''}`),
    exportCsvUrl: (params?: { ville?: string; source?: string }) => {
      const filtered = params
        ? Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
        : {};
      const qs = Object.keys(filtered).length
        ? '?' + new URLSearchParams(filtered as Record<string, string>).toString()
        : '';
      return `${API_BASE_URL}/analysis/export-csv${qs}`;
    },
  },

  // System — called by Scraping page health banner
  systemHealth: () => apiClient('/system/health'),
  systemLogs: () => apiClient('/system/logs'),
  systemStatus: () => apiClient('/system/status'),

  health: () => apiClient('/health'),

  settings: {
    get: () => apiClient('/settings/'),
    save: (data: Record<string, unknown>) =>
      apiClient('/settings/', { method: 'POST', body: JSON.stringify(data) }),
    apiStatus: () => apiClient('/settings/api-status/'),
  },

  // Users (Administration)
  users: {
    list: () => apiClient('/users/'),
    create: (data: Record<string, unknown>) =>
      apiClient('/users/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/users/${id}`, { method: 'DELETE' }),
  },

  // Profile
  profile: {
    get: () => apiClient('/profile/'),
    update: (data: Record<string, unknown>) =>
      apiClient('/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (data: { current_password: string; new_password: string }) =>
      apiClient('/profile/password', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Leases (Gestion locative)
  leases: {
    list: () => apiClient('/leases/'),
    create: (data: Record<string, unknown>) =>
      apiClient('/leases/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient(`/leases/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/leases/${id}`, { method: 'DELETE' }),
    quittances: (id: string) => apiClient(`/leases/${id}/quittances`),
  },

  // Documents
  documents: {
    list: () => apiClient('/documents/'),
    create: (data: Record<string, unknown>) =>
      apiClient('/documents/', { method: 'POST', body: JSON.stringify(data) }),
    upload: (formData: FormData) => apiUpload('/documents/upload', formData),
    sign: (data: { document_id: string; signature_data_url: string }) =>
      apiClient('/documents/sign', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/documents/${id}`, { method: 'DELETE' }),
  },

  // Statistics
  statistics: {
    get: () => apiClient('/statistics/'),
  },

  // Audit Logs
  auditLogs: {
    list: () => apiClient('/audit-logs/'),
  },
};

export const startScan = (source: string) =>
  apiClient('/scan/', {
    method: 'POST',
    body: JSON.stringify({ source }),
  });
