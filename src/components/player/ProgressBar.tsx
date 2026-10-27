import { memo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

type Props = { progress: number; onSeek?: (ratio: number) => void; thin?: boolean };

export const ProgressBar = memo(function ProgressBar({ progress, onSeek, thin }: Props) {
  const width = useRef(1);
  return (
    <Pressable disabled={!onSeek} onLayout={(e) => { width.current = e.nativeEvent.layout.width; }}
      onPress={(e) => onSeek?.(Math.min(1, Math.max(0, e.nativeEvent.locationX / width.current)))}
      style={{ height: thin ? 3 : 28, justifyContent: 'center' }}>
      <View style={[styles.track, thin && { height: 2 }]}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      {!thin && <View style={[styles.thumb, { left: `${progress * 100}%` }]} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.text },
  thumb: { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6, backgroundColor: colors.text },
});
