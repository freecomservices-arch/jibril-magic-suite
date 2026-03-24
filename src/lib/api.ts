// =============================================================================
// JIBRIL IMMO CLOUD — API CLIENT
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
      apiClient('/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () =>
      apiClient('/logout/', { method: 'POST' }),
    register: (username: string, email: string, password: string) =>
      apiClient('/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
  },

  sources: {
    list: () => apiClient('/sources/'),
    create: (data: { name: string; url: string; active?: boolean }) =>
      apiClient('/sources/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; url?: string; active?: boolean }) =>
      apiClient(`/sources/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/sources/${id}/`, { method: 'DELETE' }),
  },

  leads: {
    list: (params?: { source?: string; city?: string; status?: string; limit?: number }) => {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient(`/leads/${queryString}`);
    },
    detail: (id: string) => apiClient(`/leads/${id}/`),
    update: (id: string, data: { status?: string; notes?: string }) =>
      apiClient(`/leads/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiClient(`/leads/${id}/`, { method: 'DELETE' }),
  },

  scraping: {
    scan: (source?: string, url?: string, max_listings?: number) =>
      apiClient('/scan/', { method: 'POST', body: JSON.stringify({ source, url, max_listings }) }),
    scanAll: () =>
      apiClient('/scan-all/', { method: 'POST' }),
    logs: () =>
      apiClient('/scan/'),
  },

  health: () => apiClient('/health/'),
};

export const startScan = (source: string, maxListings: number) =>
  apiClient('/scan/', {
    method: 'POST',
    body: JSON.stringify({ source, max_listings: maxListings }),
  });
