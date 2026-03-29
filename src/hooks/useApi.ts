// =============================================================================
// JIBRIL IMMO PRO — HOOK API UNIVERSEL
// =============================================================================

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    fn: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: Error) => void
  ) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(error as Error);
      throw error;
    }
  }, []);

  return {
    ...state,
    execute,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// HOOKS SPÉCIFIQUES
// ─────────────────────────────────────────────────────────────────────────

export function useSources() {
  const { data, loading, error, execute } = useApi<any[]>();
  
  const fetchSources = useCallback(() => 
    execute(() => api.sources.list()), 
  [execute]);
  
  const createSource = useCallback((data: { name: string; url: string }) => 
    execute(() => api.sources.create(data)), 
  [execute]);
  
  return { sources: data, loading, error, fetchSources, createSource };
}

export function useLeads() {
  const { data, loading, error, execute } = useApi<any[]>();
  
  const fetchLeads = useCallback((params?: any) => 
    execute(() => api.leads.list(params)), 
  [execute]);
  
  const updateLead = useCallback((id: string, data: any) => 
    execute(() => api.leads.update(id, data)), 
  [execute]);
  
  return { leads: data, loading, error, fetchLeads, updateLead };
}

// useAuth is provided by AuthContext — do not duplicate here
