import { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtistAvatar } from '../components/ArtistAvatar';
import { FilterChips } from '../components/FilterChips';
import { MediaRow } from '../components/MediaRow';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import { SongRow } from '../components/SongRow';
import { StateView } from '../components/StateView';
import { SuggestionRow } from '../components/SuggestionRow';
import { TopResultCard } from '../components/TopResultCard';
import { useAsync } from '../hooks/useAsync';
import { useChromeInset } from '../hooks/useChromeInset';
import { useSearchResults, useSuggestions } from '../hooks/useSearch';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { fetchPopularArtists } from '../services/deezer';
import { colors, spacing } from '../theme';
import type { Artist, SearchFilter } from '../types';
import { buildRows, type ResultRow } from '../utils/results';

const RECENT = ['karan aujla', 'arijit singh', 'chill vibes', 'punjabi', 'workout'];
const AvatarSeparator = () => <View style={{ width: spacing.sm }} />;

export default function SearchInputScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'SearchInput'>) {
  const initial = route.params?.initialQuery ?? '';
  const { top } = useSafeAreaInsets();
  const bottom = useChromeInset();
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState<string | null>(initial || null);
  const [filter, setFilter] = useState<SearchFilter>('All');

  const suggestions = useSuggestions(query);
  const { data: popular } = useAsync(fetchPopularArtists, []);
  const { status, data, retry } = useSearchResults(submitted);
  const rows = useMemo(() => (data ? buildRows(data, filter) : []), [data, filter]);

  const submit = useCallback((text: string) => {
    Keyboard.dismiss();
    setQuery(text);
    setSubmitted(text.trim() || null);
    setFilter('All');
  }, []);
  const onChange = useCallback((t: string) => { setQuery(t); setSubmitted(null); }, []);
  const clear = useCallback(() => { setQuery(''); setSubmitted(null); }, []);
  const openArtist = useCallback((artist: Artist) => navigation.navigate('Artist', { artist }), [navigation]);

  const renderRow = useCallback(({ item }: { item: ResultRow }) => {
    switch (item.kind) {
      case 'header': return <SectionHeader title={item.title} onAction={item.action ? () => setFilter(item.action as SearchFilter) : undefined} />;
      case 'top': return <TopResultCard artist={item.artist} onPress={() => openArtist(item.artist)} />;
      case 'song': return <SongRow song={item.song} queue={item.queue} />;
      case 'artists': return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatars}>
          {item.artists.map((a, i) => <ArtistAvatar key={a.id} artist={a} index={i} onPress={openArtist} />)}
        </ScrollView>
      );
      case 'artist': return <MediaRow round image={item.artist.image} title={item.artist.name} subtitle="Artist" verified onPress={() => openArtist(item.artist)} />;
      case 'media': return (
        <MediaRow image={item.media.image} title={item.media.title} subtitle={item.media.subtitle}
          onPress={() => (item.media.artist ? openArtist(item.media.artist) : submit(item.media.title))} />
      );
    }
  }, [openArtist, submit]);

  return (
    <View style={[styles.screen, { paddingTop: top + spacing.sm }]}>
      <View style={styles.topRow}>
        <SearchBar autoFocus={!initial} value={query} onChangeText={onChange} onSubmit={() => submit(query)} onClear={clear} />
        <Animated.View entering={FadeInRight.springify().damping(18)} exiting={FadeOutRight}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Text style={styles.cancel}>Cancel</Text></Pressable>
        </Animated.View>
      </View>

      {submitted === null ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: bottom }}>
          {(query.trim() ? suggestions : RECENT).map((s, i) => (
            <SuggestionRow key={s} text={s} index={i} recent={!query.trim()} onPress={submit} />
          ))}
          {!query.trim() && (
            <>
              <SectionHeader title="Popular artists" />
              <FlatList horizontal data={popular ?? []} keyExtractor={(a) => a.id} showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={AvatarSeparator} contentContainerStyle={{ paddingHorizontal: spacing.lg }}
                renderItem={({ item, index }) => <ArtistAvatar artist={item} index={index} onPress={openArtist} />} />
            </>
          )}
        </ScrollView>
      ) : (
        <>
          <FilterChips value={filter} onChange={setFilter} />
          {(status === 'loading' || status === 'idle') && <StateView variant="loading" />}
          {status === 'error' && <StateView variant="error" subtitle="Check your connection and try again." onRetry={retry} />}
          {status === 'success' && (
            <FlatList data={rows} keyExtractor={(r) => r.key} renderItem={renderRow} keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: bottom }} initialNumToRender={10} windowSize={7}
              ListEmptyComponent={<StateView variant="empty" title={`No results for "${submitted}"`} subtitle="Try a different spelling or filter." />} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  cancel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  avatars: { paddingHorizontal: spacing.lg, gap: spacing.sm },
});
