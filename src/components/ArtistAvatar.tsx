import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Artwork } from './Artwork';
import { colors, typography } from '../theme';
import type { Artist } from '../types';

type Props = { artist: Artist; index: number; onPress: (a: Artist) => void };

export const ArtistAvatar = memo(function ArtistAvatar({ artist, index, onPress }: Props) {
  return (
    <Animated.View entering={FadeInRight.delay(index * 60).springify().damping(16)}>
      <Pressable onPress={() => onPress(artist)} style={styles.item}>
        <Artwork uri={artist.image} size={72} round />
        <Text numberOfLines={1} style={[typography.caption, { color: colors.text }]}>{artist.name}</Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({ item: { alignItems: 'center', gap: 8, width: 82 } });
