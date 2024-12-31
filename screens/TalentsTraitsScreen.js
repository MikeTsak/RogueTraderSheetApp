import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TalentsTraitsScreen({ isEditable }) {
  const [data, setData] = useState({
    talents: 'Mighty Shot',
    traits: 'Astartes...',
    specialAbilities: '',
    psychicDisciplines: '',
    psychicTechniques: [
      { name: '', sustain1: '', sustain2: '' },
    ],
    profitFactor: {
      starting: '',
      current: '',
      misfortunes: '',
    },
  });

  // Load data from local storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('talentsTraitsData');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('talentsTraitsData', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [data]);

  // Handlers for updates
  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleProfitFactorChange = (field, value) => {
    setData({
      ...data,
      profitFactor: {
        ...data.profitFactor,
        [field]: value,
      },
    });
  };

  const handleTechniqueChange = (index, field, value) => {
    const updatedTechniques = [...data.psychicTechniques];
    updatedTechniques[index][field] = value;
    setData({ ...data, psychicTechniques: updatedTechniques });
  };

  const addTechnique = () => {
    setData({
      ...data,
      psychicTechniques: [...data.psychicTechniques, { name: '', sustain1: '', sustain2: '' }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Talents & Traits</Text>

      <Text style={styles.label}>Talents</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.talents}
        onChangeText={(value) => handleInputChange('talents', value)}
        multiline
      />

      <Text style={styles.label}>Traits</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.traits}
        onChangeText={(value) => handleInputChange('traits', value)}
        multiline
      />

      <Text style={styles.label}>Special Abilities</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.specialAbilities}
        onChangeText={(value) => handleInputChange('specialAbilities', value)}
        multiline
      />

      <Text style={styles.label}>Psychic Disciplines</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.psychicDisciplines}
        onChangeText={(value) => handleInputChange('psychicDisciplines', value)}
        multiline
      />

      <Text style={styles.label}>Psychic Techniques</Text>
      {data.psychicTechniques.map((technique, index) => (
        <View key={index} style={styles.techniqueContainer}>
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.name}
            onChangeText={(value) => handleTechniqueChange(index, 'name', value)}
            placeholder="Name"
          />
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.sustain1}
            onChangeText={(value) => handleTechniqueChange(index, 'sustain1', value)}
            placeholder="Sustain"
          />
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.sustain2}
            onChangeText={(value) => handleTechniqueChange(index, 'sustain2', value)}
            placeholder="Sustain"
          />
        </View>
      ))}
      {isEditable && (
        <Button title="Add Technique" onPress={addTechnique} />
      )}

      <Text style={styles.header}>Profit Factor</Text>

      <Text style={styles.label}>Starting</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.profitFactor.starting}
        onChangeText={(value) => handleProfitFactorChange('starting', value)}
        placeholder="Starting Profit Factor"
      />

      <Text style={styles.label}>Current</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.profitFactor.current}
        onChangeText={(value) => handleProfitFactorChange('current', value)}
        placeholder="Current Profit Factor"
      />

      <Text style={styles.label}>Misfortunes</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={data.profitFactor.misfortunes}
        onChangeText={(value) => handleProfitFactorChange('misfortunes', value)}
        placeholder="Misfortunes"
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
  inputMulti: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  techniqueContainer: {
    marginBottom: 16,
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
});
