import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Artwork } from '../Artwork';
import { Visualizer } from './Visualizer';
import { useAsync } from '../../hooks/useAsync';
import { fetchLyrics } from '../../services/deezer';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { Song } from '../../types';

export type PanelMode = 'lyrics' | 'visualizer';
type Props = { song: Song; mode: PanelMode; onMode: (m: PanelMode) => void; onBack: () => void; onCollapse: () => void };

const LyricsView = memo(function LyricsView({ song }: { song: Song }) {
  const position = usePlayerStore((s) => s.position);
  const { status, data: lines = [] } = useAsync((sig) => fetchLyrics(song.artistName, song.title, sig), [song.id]);
  if (status === 'loading' || status === 'idle') return <ActivityIndicator color={colors.primary} style={{ marginTop: 80 }} />;
  if (!lines.length) return <Text style={[typography.caption, styles.empty]}>Lyrics aren't available for this track.{'\n'}Try the Visualizer instead.</Text>;
  // Lyrics API has no timestamps, so the highlight is estimated from playback progress.
  const active = Math.min(lines.length - 1, Math.floor((position / song.duration) * lines.length));
  const start = Math.max(0, active - 2);
  return (
    <View style={{ gap: 18, paddingHorizontal: spacing.xl, paddingTop: 40 }}>
      {lines.slice(start, start + 8).map((l, i) => (
        <Text key={`${start + i}-${l}`} style={[styles.line, start + i === active && styles.activeLine]}>{l}</Text>
      ))}
    </View>
  );
});

export const LyricsPanel = memo(function LyricsPanel({ song, mode, onMode, onBack, onCollapse }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggle = usePlayerStore((s) => s.toggle);
  return (
    <View style={{ flex: 1, paddingTop: top + 8, paddingBottom: bottom + 16 }}>
      <View style={styles.header}>
        <Pressable onPress={onCollapse} hitSlop={12}><Ionicons name="chevron-down" size={28} color={colors.text} /></Pressable>
        <View style={styles.seg}>
          {(['lyrics', 'visualizer'] as const).map((m) => (
            <Pressable key={m} onPress={() => onMode(m)} style={[styles.segItem, mode === m && styles.segActive]}>
              <Text style={[typography.body, { fontSize: 13, color: mode === m ? colors.primary : colors.muted }]}>{m === 'lyrics' ? 'Lyrics' : 'Visualizer'}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ width: 28 }} />
      </View>
      <View style={{ flex: 1, justifyContent: mode === 'visualizer' ? 'center' : 'flex-start' }}>
        {mode === 'lyrics' ? <LyricsView song={song} /> : <Visualizer playing={isPlaying} />}
      </View>
      <Pressable onPress={onBack} style={styles.mini}>
        <Artwork uri={song.image} size={44} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={typography.body}>{song.title}</Text>
          <Text numberOfLines={1} style={typography.caption}>{song.artistName}</Text>
        </View>
        <Pressable onPress={toggle} hitSlop={10}><Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={34} color={colors.text} /></Pressable>
        <Ionicons name="expand-outline" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  seg: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.pill, padding: 3 },
  segItem: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: radius.pill },
  segActive: { backgroundColor: 'rgba(31,226,154,0.18)' },
  line: { color: 'rgba(255,255,255,0.4)', fontSize: 24, fontWeight: '700', lineHeight: 32 },
  activeLine: { color: colors.primary },
  empty: { textAlign: 'center', marginTop: 100, lineHeight: 20 },
  mini: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: spacing.lg, padding: 10, borderRadius: radius.md, backgroundColor: 'rgba(18,33,31,0.9)', borderWidth: 1, borderColor: colors.border },
});
