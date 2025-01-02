import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

// Screens
import CharacterSelectionScreen from '../screens/CharacterSelectionScreen';
import TabNavigator from './TabNavigator'; // The tab-based "RogueSheet"

const Drawer = createDrawerNavigator();

function DataManagementScreen({ navigation }) {
  const exportAllCharacters = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem('ROGUE_TRADER_CHARACTERS');
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      const json = JSON.stringify(characters);

      // Save to Downloads directory
      const downloadDir = `${FileSystem.documentDirectory}Download`;
      const fileUri = `${downloadDir}/characters.json`;

      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      await FileSystem.writeAsStringAsync(fileUri, json);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share Character Data',
        });
      }

      Alert.alert('Export Successful', `Data saved to Downloads and shared.`);
    } catch (error) {
      Alert.alert('Export Failed', 'An error occurred while exporting data.');
      console.error('Export Error:', error);
    }
  };

  const importAllCharacters = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

      if (result.type === 'success') {
        const fileContent = await FileSystem.readAsStringAsync(result.uri);
        const data = JSON.parse(fileContent);

        if (Array.isArray(data)) {
          await AsyncStorage.setItem('ROGUE_TRADER_CHARACTERS', JSON.stringify(data));
          Alert.alert('Import Successful', 'All character data has been imported.');
        } else {
          Alert.alert('Invalid Data', 'The file format is not valid.');
        }
      }
    } catch (error) {
      Alert.alert('Import Failed', 'An error occurred while importing data.');
      console.error('Import Error:', error);
    }
  };

  return (
    <View style={styles.dataManagementContainer}>
      <Text style={styles.title}>Manage Your Characters</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={exportAllCharacters}>
        <Text style={styles.buttonText}>Export All Characters</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={importAllCharacters}>
        <Text style={styles.buttonText}>Import Characters</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <View style={styles.container}>
      <Drawer.Navigator
        initialRouteName="CharacterSelection"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#2e3440',
            width: 240,
          },
          drawerLabelStyle: {
            color: '#eceff4',
            fontSize: 16,
            fontWeight: '600',
          },
          drawerItemStyle: {
            marginVertical: 5,
            borderRadius: 10,
          },
          drawerActiveTintColor: '#bf616a',
          drawerInactiveTintColor: '#d8dee9',
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
            drawerLabel: () => null,
            title: "RogueSheet",
            drawerIcon: () => null,
          }}
        />
        <Drawer.Screen
          name="DataManagement"
          component={DataManagementScreen}
          options={{ title: 'Export & Import' }}
        />
      </Drawer.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#3b4252',
  },
  dataManagementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b4252',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#eceff4',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5e81ac',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  buttonText: {
    color: '#eceff4',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
