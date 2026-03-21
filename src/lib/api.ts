// =============================================================================
// JIBRIL IMMO PRO — API CLIENT (COMPLET)
// =============================================================================

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api'
  : 'https://api.jibrilimmo.cloud/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export const api = {
  // ─────────────────────────────────────────────────────────────────────────
  // AUTHENTIFICATION
  // ─────────────────────────────────────────────────────────────────────────
  auth: {
    login: (username: string, password: string) => 
      apiRequest('/login/', { 
        method: 'POST', 
        body: JSON.stringify({ username, password }) 
      }),
    
    logout: () => 
      apiRequest('/logout/', { method: 'POST' }),
    
    register: (username: string, email: string, password: string) => 
      apiRequest('/register/', { 
        method: 'POST', 
        body: JSON.stringify({ username, email, password }) 
      }),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SOURCES DE SCRAPING
  // ─────────────────────────────────────────────────────────────────────────
  sources: {
    list: () => 
      apiRequest('/sources/'),
    
    create: (data: { name: string; url: string; active?: boolean }) => 
      apiRequest('/sources/', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    
    update: (id: string, data: { name?: string; url?: string; active?: boolean }) => 
      apiRequest(`/sources/${id}/`, { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
    
    delete: (id: string) => 
      apiRequest(`/sources/${id}/`, { method: 'DELETE' }),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEADS
  // ─────────────────────────────────────────────────────────────────────────
  leads: {
    list: (params?: { source?: string; city?: string; status?: string; limit?: number }) => {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiRequest(`/leads/${queryString}`);
    },
    
    detail: (id: string) => 
      apiRequest(`/leads/${id}/`),
    
    update: (id: string, data: { status?: string; notes?: string; assigned_to?: string; phone?: string; email?: string }) => 
      apiRequest(`/leads/${id}/`, { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
    
    delete: (id: string) => 
      apiRequest(`/leads/${id}/`, { method: 'DELETE' }),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONTACTS
  // ─────────────────────────────────────────────────────────────────────────
  contacts: {
    list: () => 
      apiRequest('/contacts/'),
    
    create: (data: { name: string; phone?: string; email?: string; type?: string; notes?: string }) => 
      apiRequest('/contacts/', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    
    update: (id: string, data: { name?: string; phone?: string; email?: string; type?: string; notes?: string }) => 
      apiRequest(`/contacts/${id}/`, { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
    
    delete: (id: string) => 
      apiRequest(`/contacts/${id}/`, { method: 'DELETE' }),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROPERTIES
  // ─────────────────────────────────────────────────────────────────────────
  properties: {
    list: (params?: { city?: string; property_type?: string; status?: string }) => {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiRequest(`/properties/${queryString}`);
    },
    
    create: (data: { title: string; price: number; location?: string; city?: string; property_type?: string; area?: number; rooms?: number; description?: string }) => 
      apiRequest('/properties/', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    
    update: (id: string, data: { title?: string; price?: number; status?: string }) => 
      apiRequest(`/properties/${id}/`, { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
    
    delete: (id: string) => 
      apiRequest(`/properties/${id}/`, { method: 'DELETE' }),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SCRAPING
  // ─────────────────────────────────────────────────────────────────────────
  scraping: {
    scan: (source: string, url?: string, max_listings?: number) => 
      apiRequest('/scan/', { 
        method: 'POST', 
        body: JSON.stringify({ source, url, max_listings }) 
      }),
    
    scanAll: () => 
      apiRequest('/scan-all/', { method: 'POST' }),
    
    logs: () => 
      apiRequest('/scan/'),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HEALTH CHECK
  // ─────────────────────────────────────────────────────────────────────────
  health: () => 
    apiRequest('/health/'),
};
