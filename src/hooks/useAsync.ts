import { useCallback, useEffect, useState } from 'react';

type State<T> = { status: 'idle' | 'loading' | 'success' | 'error'; data?: T };

/** Tiny data-fetching hook: abortable, retryable. Return null from `fn` to stay idle. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T> | null, deps: readonly unknown[]) {
  const [state, setState] = useState<State<T>>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    const promise = fn(ctrl.signal);
    if (!promise) { setState({ status: 'idle' }); return; }
    setState((s) => ({ status: 'loading', data: s.data }));
    promise
      .then((data) => { if (!ctrl.signal.aborted) setState({ status: 'success', data }); })
      .catch(() => { if (!ctrl.signal.aborted) setState((s) => ({ status: 'error', data: s.data })); });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}
