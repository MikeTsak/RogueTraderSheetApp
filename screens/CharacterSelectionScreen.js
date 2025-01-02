import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CharacterSelectionScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);

  // Reload characters each time this screen is focused
  useFocusEffect(
    useCallback(() => {
      loadCharacters();
    }, [])
  );

  async function loadCharacters() {
    try {
      const jsonValue = await AsyncStorage.getItem('ROGUE_TRADER_CHARACTERS');
      if (jsonValue) {
        setCharacters(JSON.parse(jsonValue));
      } else {
        setCharacters([]);
      }
    } catch (e) {
      console.error('Error loading characters:', e);
    }
  }

  async function saveCharacters(updatedCharacters) {
    try {
      await AsyncStorage.setItem(
        'ROGUE_TRADER_CHARACTERS',
        JSON.stringify(updatedCharacters)
      );
    } catch (e) {
      console.error('Error saving characters:', e);
    }
  }

  async function handleCreateNewCharacter() {
    const newCharacter = {
      id: Date.now().toString(),
      name: `Character ${characters.length + 1}`,
    };

    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    await saveCharacters(updatedCharacters);

    navigation.navigate('RogueSheet', { characterId: newCharacter.id });
  }

  async function handleImportCharacters() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

      if (result.type === 'success') {
        const fileContent = await FileSystem.readAsStringAsync(result.uri);
        const importedCharacters = JSON.parse(fileContent);

        if (Array.isArray(importedCharacters)) {
          const updatedCharacters = [...characters, ...importedCharacters];
          setCharacters(updatedCharacters);
          await saveCharacters(updatedCharacters);

          Alert.alert('Import Successful', 'Characters have been imported.');
        } else {
          Alert.alert('Invalid File', 'The selected file does not contain valid character data.');
        }
      }
    } catch (error) {
      Alert.alert('Import Failed', 'An error occurred while importing characters.');
      console.error('Import Error:', error);
    }
  }

  function handleSelectCharacter(characterId) {
    navigation.navigate('RogueSheet', { characterId });
  }
  

  async function handleDeleteCharacter(characterId) {
    Alert.alert(
      'Delete Character',
      'Are you sure you want to delete this character?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedCharacters = characters.filter(
              (character) => character.id !== characterId
            );
            setCharacters(updatedCharacters);
            await saveCharacters(updatedCharacters);
          },
        },
      ]
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.charItem}>
      <TouchableOpacity
        style={styles.charInfo}
        onPress={() => handleSelectCharacter(item.id)}
      >
        <Text style={styles.charName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCharacter(item.id)}
      >
        <Icon name="delete" size={24} color="#ff5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Character Selection (not working)</Text>
      {characters.length === 0 ? (
        <Text style={styles.empty}>No characters found. Create one to get started!</Text>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateNewCharacter}>
        <Icon name="add" size={24} color="#dfddd3" />
        <Text style={styles.createButtonText}>Create New Character</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.importButton} onPress={handleImportCharacters}>
        <Icon name="file-download" size={24} color="#dfddd3" />
        <Text style={styles.importButtonText}>Import Characters</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e3440',
    padding: 16,
  },
  header: {
    fontSize: 28,
    color: '#dfddd3',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#dfddd3',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  charItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4c566a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  charInfo: {
    flex: 1,
  },
  charName: {
    fontSize: 18,
    color: '#eceff4',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e81ac',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 18,
    color: '#dfddd3',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#88c0d0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  importButtonText: {
    fontSize: 18,
    color: '#dfddd3',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 16,
  },
  spacer: {
    height: 50,
  },
});
