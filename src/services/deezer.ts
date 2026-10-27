import type { Artist, Category, MediaItem, SearchResults, Song } from '../types';

/** Deezer public API: no key needed. Responses are cached in memory for instant repeat navigation. */
const BASE = 'https://api.deezer.com';
const enc = encodeURIComponent;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any;
const cache = new Map<string, Raw>();

async function get(path: string, signal?: AbortSignal): Promise<Raw> {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(BASE + path, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json?.error) throw new Error(json.error.message ?? 'API error');
  cache.set(path, json);
  return json;
}

const mapArtist = (a: Raw): Artist => ({ id: String(a.id), name: a.name, image: a.picture_xl || a.picture_big || a.picture_medium || '', fans: a.nb_fan });
const mapSong = (t: Raw): Song => ({
  id: String(t.id), title: t.title_short || t.title, artistId: String(t.artist?.id), artistName: t.artist?.name ?? '',
  album: t.album?.title ?? '', duration: t.duration ?? 180, image: t.album?.cover_xl || t.album?.cover_big || '', plays: t.rank ?? 0,
});
const mapAlbum = (a: Raw): MediaItem => ({
  id: `al-${a.id}`, type: 'album', title: a.title, subtitle: `Album · ${a.artist?.name ?? ''}`,
  image: a.cover_xl || a.cover_big || '', artist: a.artist ? mapArtist(a.artist) : undefined,
});
const mapPlaylist = (p: Raw): MediaItem => ({
  id: `pl-${p.id}`, type: 'playlist', title: p.title, subtitle: `Playlist · ${p.user?.name ?? 'Deezer'}`, image: p.picture_xl || p.picture_big || '',
});
const uniq = <T extends { id: string }>(list: T[]) => [...new Map(list.map((i) => [i.id, i])).values()];

export const CATEGORY_DEFS: Category[] = [
  { id: 'new', title: 'New Releases', subtitle: 'Fresh drops this week', query: 'new releases' },
  { id: 'chill', title: 'Chill', subtitle: 'Slow down and unwind', query: 'chill' },
  { id: 'punjabi', title: 'Punjabi Mix', subtitle: 'Top hits · Diljit · AP Dhillon', query: 'punjabi' },
  { id: 'workout', title: 'Workout', subtitle: 'Pump it up', query: 'workout' },
  { id: 'indie', title: 'Indie Vibes', subtitle: 'Off the beaten path', query: 'indie' },
  { id: 'love', title: 'Love', subtitle: 'For the romantics', query: 'love songs' },
  { id: 'focus', title: 'Focus', subtitle: 'Deep work beats', query: 'focus' },
];

export async function fetchCategories(signal: AbortSignal): Promise<Category[]> {
  return Promise.all(CATEGORY_DEFS.map(async (c) => {
    try {
      const r = await get(`/search/playlist?q=${enc(c.query)}&limit=1`, signal);
      return { ...c, image: r.data?.[0]?.picture_xl as string | undefined };
    } catch { return c; }
  }));
}

const POPULAR = ['Karan Aujla', 'Diljit Dosanjh', 'Shubh', 'AP Dhillon', 'Arijit Singh', 'The Weeknd'];
export async function fetchPopularArtists(signal: AbortSignal): Promise<Artist[]> {
  const res = await Promise.all(POPULAR.map((n) => get(`/search/artist?q=${enc(n)}&limit=1`, signal).then((r) => r.data?.[0]).catch(() => null)));
  return res.filter(Boolean).map(mapArtist);
}

export async function fetchSuggestions(q: string, signal: AbortSignal): Promise<string[]> {
  const [a, t] = await Promise.all([get(`/search/artist?q=${enc(q)}&limit=3`, signal), get(`/search?q=${enc(q)}&limit=8`, signal)]);
  const names: string[] = [...(a.data ?? []).map((x: Raw) => x.name), ...(t.data ?? []).map((x: Raw) => x.title_short || x.title)];
  return [...new Set(names)].slice(0, 6);
}

export async function fetchSearch(q: string, signal: AbortSignal): Promise<SearchResults> {
  const [artists, songs, albums, playlists] = await Promise.all([
    get(`/search/artist?q=${enc(q)}&limit=8`, signal), get(`/search?q=${enc(q)}&limit=25`, signal),
    get(`/search/album?q=${enc(q)}&limit=10`, signal), get(`/search/playlist?q=${enc(q)}&limit=10`, signal),
  ]);
  return {
    artists: uniq((artists.data ?? []).map(mapArtist)), songs: uniq((songs.data ?? []).map(mapSong)),
    albums: uniq((albums.data ?? []).map(mapAlbum)), playlists: uniq((playlists.data ?? []).map(mapPlaylist)),
  };
}

export async function fetchArtistPage(artistId: string, signal: AbortSignal): Promise<{ artist: Artist; songs: Song[] }> {
  const [info, top] = await Promise.all([get(`/artist/${artistId}`, signal), get(`/artist/${artistId}/top?limit=10`, signal)]);
  return { artist: mapArtist(info), songs: uniq((top.data ?? []).map(mapSong)) };
}

export async function fetchLyrics(artist: string, title: string, signal: AbortSignal): Promise<string[]> {
  const res = await fetch(`https://api.lyrics.ovh/v1/${enc(artist)}/${enc(title)}`, { signal });
  if (!res.ok) throw new Error('No lyrics');
  const json = await res.json();
  return String(json.lyrics ?? '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('Paroles de la chanson')).slice(0, 120);
}
