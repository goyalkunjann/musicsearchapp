import type { Artist, MediaItem, SearchFilter, SearchResults, Song } from '../types';

export type ResultRow =
  | { key: string; kind: 'header'; title: string; action?: SearchFilter }
  | { key: string; kind: 'top'; artist: Artist }
  | { key: string; kind: 'artist'; artist: Artist }
  | { key: string; kind: 'artists'; artists: Artist[] }
  | { key: string; kind: 'song'; song: Song; queue: Song[] }
  | { key: string; kind: 'media'; media: MediaItem };

export function buildRows(r: SearchResults, f: SearchFilter): ResultRow[] {
  const rows: ResultRow[] = [];
  const all = f === 'All';
  const header = (title: string, action?: SearchFilter) => rows.push({ key: `h-${title}`, kind: 'header', title, action });

  if (all && r.artists[0]) { header('Top result'); rows.push({ key: 'top', kind: 'top', artist: r.artists[0] }); }
  if ((all || f === 'Songs') && r.songs.length) {
    if (all) header('Songs', r.songs.length > 4 ? 'Songs' : undefined);
    (all ? r.songs.slice(0, 4) : r.songs).forEach((song) => rows.push({ key: song.id, kind: 'song', song, queue: r.songs }));
  }
  if (all && r.artists.length) { header('Artists', r.artists.length > 4 ? 'Artists' : undefined); rows.push({ key: 'artists', kind: 'artists', artists: r.artists.slice(0, 8) }); }
  if (f === 'Artists') r.artists.forEach((artist) => rows.push({ key: artist.id, kind: 'artist', artist }));
  (['Albums', 'Playlists'] as const).forEach((name) => {
    const items = name === 'Albums' ? r.albums : r.playlists;
    if ((!all && f !== name) || !items.length) return;
    if (all) header(name, items.length > 3 ? name : undefined);
    (all ? items.slice(0, 3) : items).forEach((media) => rows.push({ key: media.id, kind: 'media', media }));
  });
  return rows;
}
