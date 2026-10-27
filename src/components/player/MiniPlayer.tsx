import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Artwork } from '../Artwork';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from '../../store/playerStore';
import { colors, layout, radius, typography } from '../../theme';

export const MiniPlayer = memo(function MiniPlayer({ onPress }: { onPress: () => void }) {
  const song = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => (s.current ? s.position / s.current.duration : 0));
  const toggle = usePlayerStore((s) => s.toggle);
  if (!song) return null;
  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityLabel="Open now playing">
      <View style={styles.row}>
        <Artwork uri={song.image} size={42} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={typography.body}>{song.title}</Text>
          <Text numberOfLines={1} style={typography.caption}>{song.artistName}</Text>
        </View>
        <Pressable onPress={toggle} hitSlop={12}>
          <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={34} color={colors.text} />
        </Pressable>
      </View>
      <ProgressBar progress={progress} thin />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { height: layout.miniHeight, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, paddingHorizontal: 10, justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
});
