import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore } from '../store/playerStore';
import { layout } from '../theme';

/** Bottom padding so content never hides behind the tab bar (+ mini-player when something plays). */
export const useChromeInset = () => {
  const { bottom } = useSafeAreaInsets();
  const hasSong = usePlayerStore((s) => s.current !== null);
  return layout.tabBarHeight + bottom + (hasSong ? layout.miniHeight + 16 : 0) + 24;
};
