# Music Search: React Native (Expo + TypeScript)

Spotify-style interactive search: animated search, results, artist profile and a mini/expanded player.

## Demo
[▶ Watch the demo video](docs/demo.mp4)

## Run
    npm install
    npx expo start --tunnel --clear

Scan the QR code with Expo Go, or press `i` for the iOS simulator.

## Highlights
- 3D stacked category list (Reanimated, UI-thread only)
- Staggered spring suggestions with debounced, abortable fetches
- Parallax artist hero, plus loading / empty / error states

## Architecture
    src/
      components/   reusable UI + player/ (MiniPlayer, NowPlaying, LyricsPanel, Visualizer)
      screens/      SearchHome, SearchInput, Artist
      hooks/        useAsync, useSearch, useChromeInset, usePlaybackTicker
      services/     Deezer API client
      store/        zustand player store
      navigation/   typed native stack
      theme/ types/ utils/

## Decisions and trade-offs
- zustand with boolean selectors, so only affected rows re-render
- Data and images come from the free Deezer API (no key), cached in memory


