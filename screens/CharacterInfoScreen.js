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

      <View style={styles.section}>
        <Text style={styles.label}>Character Name</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.name}
          onChangeText={(val) => handleInputChange('name', val)}
          placeholder="Enter Character Name"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Player Name</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.playerName}
          onChangeText={(val) => handleInputChange('playerName', val)}
          placeholder="Enter Player Name"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Career Path</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.careerPath}
          onChangeText={(val) => handleInputChange('careerPath', val)}
          placeholder="Enter Career Path"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Rank</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.rank}
          onChangeText={(val) => handleInputChange('rank', val)}
          placeholder="Enter Rank"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Home World</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.homeWorld}
          onChangeText={(val) => handleInputChange('homeWorld', val)}
          placeholder="Enter Home World"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Motivation</Text>
        <TextInput
          style={[styles.input, styles.textArea, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.motivation}
          onChangeText={(val) => handleInputChange('motivation', val)}
          placeholder="Enter Motivation"
          placeholderTextColor="#dfddd3"
          multiline
        />
      </View>

      <View style={styles.section}>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Experience Points</Text>
        <Text style={styles.labelSmall}>XP to Spend</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.xpToSpend || ''}
          onChangeText={(val) => handleInputChange('xpToSpend', val)}
          placeholder="Enter XP to Spend"
          placeholderTextColor="#dfddd3"
          keyboardType="numeric"
        />
        <Text style={styles.labelSmall}>Total XP Spent</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.totalXpSpent || ''}
          onChangeText={(val) => handleInputChange('totalXpSpent', val)}
          placeholder="Enter Total XP Spent"
          placeholderTextColor="#dfddd3"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mutations</Text>
        <TextInput
          style={[styles.input, styles.textArea, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={characterData.mutations || ''}
          onChangeText={(val) => handleInputChange('mutations', val)}
          placeholder="Enter Mutations"
          placeholderTextColor="#dfddd3"
          multiline
        />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d6363',
    padding: 16,
    fontFamily: 'SpaceGrotesk_400Regular', // Normal text in container
  },
  header: {
    fontSize: 28,
    color: '#dfddd3',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_700Bold', // Bold version
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: '#dfddd3',
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_700Bold', // Bold version
  },
  labelSmall: {
    fontSize: 16,
    color: '#dfddd3',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk_400Regular', // You can keep normal weight here
  },
  input: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 10,
    borderRadius: 8,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  readOnly: {
    backgroundColor: '#3e4551',
  },
  spacer: {
    height: 100,
  },
});
