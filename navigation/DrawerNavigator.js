import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';

// Screens
import CharacterSelectionScreen from '../screens/CharacterSelectionScreen';
import TabNavigator from './TabNavigator'; // The tab-based "RogueSheet"

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <View style={styles.container}>
      <Drawer.Navigator
        initialRouteName="CharacterSelection"
        screenOptions={{
          headerShown: false, // Hide the default header
        }}
      >
        <Drawer.Screen
          name="CharacterSelection"
          component={CharacterSelectionScreen}
          options={{ title: 'Character Selection' }}
        />
        <Drawer.Screen
          name="RogueSheet"
          component={TabNavigator}
          options={{
            // If you want to hide it from the drawer list, do:
            drawerLabel: () => null,
            title: undefined,
            drawerIcon: () => null,
          }}
        />
      </Drawer.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20, // Adjust this value to create more space at the top
    paddingTop: 10, // Optional additional padding
  },
});
