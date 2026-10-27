import { useEffect, useState } from 'react';
import { fetchSearch, fetchSuggestions } from '../services/deezer';
import { useAsync } from './useAsync';

export function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => { const id = setTimeout(() => setV(value), ms); return () => clearTimeout(id); }, [value, ms]);
  return v;
}

export function useSuggestions(query: string) {
  const q = useDebounced(query.trim(), 250);
  const { data } = useAsync((s) => (q ? fetchSuggestions(q, s) : null), [q]);
  return query.trim() ? data ?? [] : [];
}

export const useSearchResults = (query: string | null) => useAsync((s) => (query ? fetchSearch(query, s) : null), [query]);
