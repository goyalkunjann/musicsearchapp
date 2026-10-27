import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SongRow } from '../components/SongRow';
import { StateView } from '../components/StateView';
import { useAsync } from '../hooks/useAsync';
import { useChromeInset } from '../hooks/useChromeInset';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { fetchArtistPage } from '../services/deezer';
import { usePlayerStore } from '../store/playerStore';
import { colors, radius, spacing, typography } from '../theme';
import type { Song } from '../types';
import { compact } from '../utils/format';

const HERO = 440;
const TABS = ['Music', 'Events', 'Merch', 'About'] as const;

export default function ArtistScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Artist'>) {
  const { artist: seed } = route.params; // passed from the previous screen -> hero renders instantly
  const { top } = useSafeAreaInsets();
  const bottom = useChromeInset();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Music');
  const { status, data, retry } = useAsync((s) => fetchArtistPage(seed.id, s), [seed.id]);
  const songs = data?.songs ?? [];
  const fans = data?.artist.fans ?? seed.fans;

  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => { y.value = e.contentOffset.y; });
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(y.value, [-HERO, 0, HERO], [-HERO / 2, 0, HERO * 0.4], Extrapolation.CLAMP) },
      { scale: interpolate(y.value, [-HERO, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));

  const playAll = useCallback((shuffle: boolean) => {
    if (!songs.length) return;
    const pick = shuffle ? songs[Math.floor(Math.random() * songs.length)] : songs[0];
    const { play, current } = usePlayerStore.getState();
    if (current?.id !== pick.id) play(pick, songs);
  }, [songs]);

  const renderItem = useCallback(({ item, index }: { item: Song; index: number }) =>
    <SongRow song={item} queue={songs} variant="popular" index={index + 1} />, [songs]);

  const header = (
    <View>
      <View style={{ height: HERO, overflow: 'hidden' }}>
        <Animated.View style={[StyleSheet.absoluteFill, heroStyle]}>
          <Image source={{ uri: seed.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        </Animated.View>
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', colors.bg]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.nameWrap}>
          <View style={styles.metaRow}>
            <Text numberOfLines={1} style={[typography.title, { fontSize: 36, flexShrink: 1 }]}>{seed.name}</Text>
            <Ionicons name="checkmark-circle" size={24} color={colors.verified} />
          </View>
          {fans ? <Text style={[typography.caption, { color: colors.text }]}>{compact(fans)} monthly listeners</Text> : null}
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={() => playAll(false)} style={styles.play} accessibilityLabel="Play">
          <Ionicons name="play" size={18} color="#001a10" /><Text style={styles.playText}>Play</Text>
        </Pressable>
        <Pressable onPress={() => setFollowing((f) => !f)} style={[styles.follow, following && { borderColor: colors.primary }]}>
          <Text style={[typography.body, following && { color: colors.primary }]}>{following ? 'Following' : 'Follow'}</Text>
        </Pressable>
        <Pressable onPress={() => playAll(true)} style={styles.shuffle} accessibilityLabel="Shuffle"><Ionicons name="shuffle" size={20} color={colors.text} /></Pressable>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[typography.body, { fontSize: 14, color: tab === t ? colors.primary : colors.muted }]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'Music' && <Text style={[typography.heading, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }]}>Popular</Text>}
    </View>
  );

  const empty = tab !== 'Music' ? <StateView variant="empty" title="Nothing here yet" subtitle={`${tab} will show up here.`} />
    : status === 'error' ? <StateView variant="error" subtitle="Couldn't load songs." onRetry={retry} />
    : status === 'success' ? <StateView variant="empty" title="No songs found" />
    : <StateView variant="loading" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Pressable onPress={() => navigation.goBack()} style={[styles.back, { top: top + 8, left: spacing.lg }]} accessibilityLabel="Back">
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
      <View style={[styles.back, { top: top + 8, right: spacing.lg }]}><Ionicons name="ellipsis-vertical" size={18} color={colors.text} /></View>
      <Animated.FlatList data={tab === 'Music' ? songs : []} keyExtractor={(s) => s.id} renderItem={renderItem}
        ListHeaderComponent={header} ListEmptyComponent={empty} onScroll={onScroll} scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottom }} showsVerticalScrollIndicator={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  nameWrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.md, gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  play: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 26, height: 46, borderRadius: radius.pill, backgroundColor: colors.primary },
  playText: { color: '#001a10', fontSize: 15, fontWeight: '800' },
  follow: { paddingHorizontal: 26, height: 46, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  shuffle: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', gap: spacing.xl, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  tab: { paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  back: { position: 'absolute', zIndex: 10, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
});
