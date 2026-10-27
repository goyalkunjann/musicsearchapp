import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../theme';

type Props = { uri?: string; size: number; round?: boolean; radius?: number };

export const Artwork = memo(function Artwork({ uri, size, round, radius }: Props) {
  return (
    <View style={{ width: size, height: size, borderRadius: round ? size / 2 : radius ?? size * 0.12, overflow: 'hidden', backgroundColor: colors.surfaceAlt }}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} recyclingKey={uri} /> : null}
    </View>
  );
});
