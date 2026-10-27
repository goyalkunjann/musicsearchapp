import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';

export function usePlaybackTicker() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(usePlayerStore.getState().tick, 1000);
    return () => clearInterval(id);
  }, [isPlaying]);
}
