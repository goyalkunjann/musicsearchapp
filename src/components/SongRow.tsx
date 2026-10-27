import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MediaRow } from './MediaRow';
import { usePlayerStore } from '../store/playerStore';
import { colors } from '../theme';
import type { Song } from '../types';
import { compact } from '../utils/format';

type Props = { song: Song; queue: Song[]; variant?: 'search' | 'popular'; index?: number };

/** Selectors return booleans so only the affected row re-renders when playback changes. */
export const SongRow = memo(function SongRow({ song, queue, variant = 'search', index }: Props) {
  const play = usePlayerStore((s) => s.play);
  const active = usePlayerStore((s) => s.current?.id === song.id);
  const playing = usePlayerStore((s) => s.current?.id === song.id && s.isPlaying);
  const popular = variant === 'popular';
  return (
    <MediaRow image={song.image} title={song.title} active={active} onPress={() => play(song, queue)}
      subtitle={popular ? `${compact(song.plays)} plays` : song.artistName}
      leading={popular ? <Text style={[styles.idx, active && { color: colors.primary }]}>{index}</Text> : undefined}
      trailing={popular
        ? <Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} />
        : (
          <View style={styles.trail}>
            <View style={[styles.circle, active && { borderColor: colors.primary }]}>
              <Ionicons name={playing ? 'pause' : 'play'} size={15} color={active ? colors.primary : colors.text} />
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} />
          </View>
        )} />
  );
});

const styles = StyleSheet.create({
  idx: { width: 22, color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  trail: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  circle: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
});
