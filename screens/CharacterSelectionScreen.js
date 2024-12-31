import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CharacterSelectionScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);

  // Each time this screen is focused, re-load the character list:
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
      console.log('Error loading characters:', e);
    }
  }

  async function handleCreateNewCharacter() {
    const newCharacter = {
      id: Date.now().toString(),
      name: 'New Character',
      // more default fields...
    };

    const updated = [...characters, newCharacter];
    setCharacters(updated);

    try {
      await AsyncStorage.setItem('ROGUE_TRADER_CHARACTERS', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving new character:', e);
    }

    // Navigate to the new character's sheet
    navigation.navigate('RogueSheet', { characterId: newCharacter.id });
  }

  function handleSelectCharacter(characterId) {
    // Navigate to the existing character's sheet
    navigation.navigate('RogueSheet', { characterId });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.charItem}
      onPress={() => handleSelectCharacter(item.id)}
    >
      <Text style={styles.charName}>{item.name}</Text>
      <Icon name="arrow-forward-ios" size={20} color="#dfddd3" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Character Selection</Text>
      {characters.length === 0 ? (
        <Text style={styles.empty}>No characters found.</Text>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateNewCharacter}>
        <Icon name="add" size={24} color="#dfddd3" />
        <Text style={styles.createButtonText}>Create New Character</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d6363',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#dfddd3',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#dfddd3',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
});
