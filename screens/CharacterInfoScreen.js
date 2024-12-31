// screens/CharacterInfoScreen.js
import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CharacterInfoScreen({
  isEditable,
  characterData,
  setCharacterData,
}) {
  useEffect(() => {
    // Load character data from AsyncStorage on component mount
    const loadCharacterData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('characterData');
        if (storedData) {
          setCharacterData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load character data:', error);
      }
    };

    loadCharacterData();
  }, []);

  useEffect(() => {
    // Save character data to AsyncStorage whenever it changes
    const saveCharacterData = async () => {
      try {
        await AsyncStorage.setItem('characterData', JSON.stringify(characterData));
      } catch (error) {
        console.error('Failed to save character data:', error);
      }
    };

    if (characterData) {
      saveCharacterData();
    }
  }, [characterData]);

  if (!characterData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  // Handlers for each field
  const handleInputChange = (field, value) => {
    setCharacterData({
      ...characterData,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Character Info</Text>

      <Text style={styles.label}>Character Name</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.name}
        onChangeText={(val) => handleInputChange('name', val)}
        placeholder="Enter Character Name"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Player Name</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.playerName}
        onChangeText={(val) => handleInputChange('playerName', val)}
        placeholder="Enter Player Name"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Career Path</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.careerPath}
        onChangeText={(val) => handleInputChange('careerPath', val)}
        placeholder="Enter Career Path"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Rank</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.rank}
        onChangeText={(val) => handleInputChange('rank', val)}
        placeholder="Enter Rank"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Home World</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.homeWorld}
        onChangeText={(val) => handleInputChange('homeWorld', val)}
        placeholder="Enter Home World"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Motivation</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.motivation}
        onChangeText={(val) => handleInputChange('motivation', val)}
        placeholder="Enter Motivation"
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.description}
        onChangeText={(val) => handleInputChange('description', val)}
        placeholder="Enter Description"
        placeholderTextColor="#dfddd3"
        multiline
      />

      <Text style={styles.label}>Experience Points</Text>

      <Text style={styles.label}>XP to Spend</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.xpToSpend || ''}
        onChangeText={(val) => handleInputChange('xpToSpend', val)}
        placeholder="Enter XP to Spend"
        placeholderTextColor="#dfddd3"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Total XP Spent</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={characterData.totalXpSpent || ''}
        onChangeText={(val) => handleInputChange('totalXpSpent', val)}
        placeholder="Enter Total XP Spent"
        placeholderTextColor="#dfddd3"
        keyboardType="numeric"
      />
    </ScrollView>
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
  textArea: {
    height: 100, // Larger height for multi-line input
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
});
