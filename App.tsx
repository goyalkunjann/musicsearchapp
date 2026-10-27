import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator, navigationRef } from './src/navigation/RootNavigator';
import { BottomBar } from './src/components/BottomBar';
import { PlayerSheet } from './src/components/player/PlayerSheet';
import { usePlaybackTicker } from './src/hooks/usePlaybackTicker';
import { colors } from './src/theme';

const navTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg } };

export default function App() {
  usePlaybackTicker();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer ref={navigationRef} theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
        <BottomBar />
        <PlayerSheet />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
