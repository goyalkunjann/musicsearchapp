import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchHomeScreen from '../screens/SearchHomeScreen';
import SearchInputScreen from '../screens/SearchInputScreen';
import ArtistScreen from '../screens/ArtistScreen';
import type { Artist } from '../types';

export type RootStackParamList = {
  SearchHome: undefined;
  SearchInput: { initialQuery?: string } | undefined;
  Artist: { artist: Artist };
};
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#040D0C' } }}>
    <Stack.Screen name="SearchHome" component={SearchHomeScreen} />
    <Stack.Screen name="SearchInput" component={SearchInputScreen} options={{ animation: 'fade', animationDuration: 220 }} />
    <Stack.Screen name="Artist" component={ArtistScreen} options={{ animation: 'fade_from_bottom' }} />
  </Stack.Navigator>
);
