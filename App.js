import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
// For the loading placeholder:
import AppLoading from 'expo-app-loading';

import DrawerNavigator from './navigation/DrawerNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
