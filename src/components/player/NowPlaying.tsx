import { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Artwork } from '../Artwork';
import { LyricsPanel, type PanelMode } from './LyricsPanel';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from '../../store/playerStore';
import { formatTime } from '../../utils/format';
import { colors, radius, spacing, typography } from '../../theme';

type Mode = 'player' | PanelMode;

const Pill = ({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={styles.pill}>
    <Ionicons name={icon} size={15} color={colors.text} />
    <Text style={styles.pillText}>{label}</Text>
  </Pressable>
);

export const NowPlaying = memo(function NowPlaying({ onCollapse }: { onCollapse: () => void }) {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const song = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const [mode, setMode] = useState<Mode>('player');

  const float = useSharedValue(0);
  useEffect(() => { float.value = withRepeat(withTiming(1, { duration: 2800 }), -1, true); }, [float]);
  const artStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { translateY: interpolate(float.value, [0, 1], [0, -10]) }, { rotateY: '-16deg' }, { rotateX: '6deg' }],
  }));

  if (!song) return null;
  const { toggle, skip, seek } = usePlayerStore.getState();
  const artSize = width * 0.68;

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: song.image }} style={StyleSheet.absoluteFill} blurRadius={50} contentFit="cover" recyclingKey={song.image} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(4,13,12,0.74)' }]} />
      {mode !== 'player' ? (
        <LyricsPanel song={song} mode={mode} onMode={setMode} onBack={() => setMode('player')} onCollapse={onCollapse} />
      ) : (
        <View style={[styles.wrap, { paddingTop: top + 8, paddingBottom: bottom + 16 }]}>
          <View style={styles.header}>
            <Pressable onPress={onCollapse} hitSlop={12} accessibilityLabel="Collapse player"><Ionicons name="chevron-down" size={28} color={colors.text} /></Pressable>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </View>

          <View style={styles.art}>
            <View style={[styles.ring, { width: artSize * 1.05 }]} />
            <Animated.View style={[styles.artShadow, artStyle]}><Artwork uri={song.image} size={artSize} radius={18} /></Animated.View>
          </View>

          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[typography.title, { fontSize: 32 }]}>{song.title}</Text>
              <Text numberOfLines={1} style={[typography.caption, { fontSize: 14, marginTop: 4 }]}>{song.artistName}</Text>
            </View>
            <View style={styles.heart}><Ionicons name="heart-outline" size={22} color={colors.text} /></View>
          </View>

          <ProgressBar progress={position / song.duration} onSeek={(r) => seek(Math.round(r * song.duration))} />
          <View style={styles.times}>
            <Text style={typography.caption}>{formatTime(position)}</Text>
            <Text style={typography.caption}>-{formatTime(song.duration - position)}</Text>
          </View>

          <View style={styles.controls}>
            <Ionicons name="shuffle" size={24} color={colors.primary} />
            <Pressable onPress={() => skip(-1)}><Ionicons name="play-skip-back" size={30} color={colors.text} /></Pressable>
            <Pressable onPress={toggle} style={styles.playBtn} accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={34} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => skip(1)}><Ionicons name="play-skip-forward" size={30} color={colors.text} /></Pressable>
            <Ionicons name="repeat" size={24} color={colors.text} />
          </View>

          <View style={styles.pills}>
            <Pill icon="chatbox-ellipses-outline" label="Lyrics" onPress={() => setMode('lyrics')} />
            <Pill icon="pulse-outline" label="Visualizer" onPress={() => setMode('visualizer')} />
            <Pill icon="list-outline" label="Queue" />
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  art: { alignItems: 'center', justifyContent: 'center', flex: 1, marginVertical: spacing.md },
  ring: { position: 'absolute', bottom: 8, height: 46, borderRadius: 100, borderWidth: 2, borderColor: 'rgba(31,226,154,0.7)', shadowColor: colors.primary, shadowOpacity: 0.9, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } },
  artShadow: { borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  heart: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  playBtn: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.6, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  pills: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  pillText: { color: colors.text, fontSize: 12, fontWeight: '600' },
});
