import { create } from 'zustand';
import type { Song } from '../types';

type PlayerState = {
  current: Song | null; queue: Song[]; isPlaying: boolean; position: number; expanded: boolean;
  play: (song: Song, queue?: Song[]) => void; toggle: () => void; seek: (s: number) => void;
  skip: (dir: 1 | -1) => void; setExpanded: (v: boolean) => void; tick: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null, queue: [], isPlaying: false, position: 0, expanded: false,
  play: (song, queue) => {
    if (get().current?.id === song.id) { get().toggle(); return; }
    set({ current: song, queue: queue?.length ? queue : [song], isPlaying: true, position: 0 });
  },
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (position) => set({ position }),
  skip: (dir) => {
    const { queue, current } = get();
    if (!current || !queue.length) return;
    const i = queue.findIndex((s) => s.id === current.id);
    set({ current: queue[(i + dir + queue.length) % queue.length], position: 0, isPlaying: true });
  },
  setExpanded: (expanded) => set({ expanded }),
  tick: () => {
    const { current, position, queue } = get();
    if (!current) return;
    if (position + 1 < current.duration) set({ position: position + 1 });
    else if (queue.length > 1) get().skip(1);
    else set({ position: 0 });
  },
}));
