export type Artist = { id: string; name: string; image: string; fans?: number };
export type Song = { id: string; title: string; artistId: string; artistName: string; album: string; duration: number; image: string; plays: number };
export type MediaItem = { id: string; type: 'album' | 'playlist'; title: string; subtitle: string; image: string; artist?: Artist };
export type Category = { id: string; title: string; subtitle: string; query: string; image?: string };
export type SearchFilter = 'All' | 'Songs' | 'Artists' | 'Albums' | 'Playlists';
export type SearchResults = { artists: Artist[]; songs: Song[]; albums: MediaItem[]; playlists: MediaItem[] };
