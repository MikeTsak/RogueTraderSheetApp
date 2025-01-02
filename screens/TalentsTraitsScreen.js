import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TalentsTraitsScreen({ isEditable }) {
  const [data, setData] = useState({
    talents: 'Mighty Shot',
    traits: 'Astartes...',
    specialAbilities: '',
    psychicDisciplines: '',
    psychicTechniques: [{ name: '', sustain1: '', sustain2: '' }],
    profitFactor: { starting: '', current: '', misfortunes: '' },
  });

  useEffect(() => {
    // Load data from local storage on mount
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('talentsTraitsData');
        if (storedData) setData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Save data to local storage whenever it changes
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
      profitFactor: { ...data.profitFactor, [field]: value },
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

      <View style={styles.section}>
        <Text style={styles.label}>Talents</Text>
        <TextInput
          style={[styles.inputMulti, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.talents}
          onChangeText={(value) => handleInputChange('talents', value)}
          multiline
          placeholder="Enter talents..."
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Traits</Text>
        <TextInput
          style={[styles.inputMulti, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.traits}
          onChangeText={(value) => handleInputChange('traits', value)}
          multiline
          placeholder="Enter traits..."
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Special Abilities</Text>
        <TextInput
          style={[styles.inputMulti, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.specialAbilities}
          onChangeText={(value) => handleInputChange('specialAbilities', value)}
          multiline
          placeholder="Enter special abilities..."
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Psychic Disciplines</Text>
        <TextInput
          style={[styles.inputMulti, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.psychicDisciplines}
          onChangeText={(value) => handleInputChange('psychicDisciplines', value)}
          multiline
          placeholder="Enter psychic disciplines..."
          placeholderTextColor="#dfddd3"
        />
      </View>

      <Text style={styles.header}>Psychic Techniques</Text>
      {data.psychicTechniques.map((technique, index) => (
        <View key={index} style={styles.techniqueContainer}>
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.name}
            onChangeText={(value) => handleTechniqueChange(index, 'name', value)}
            placeholder="Technique Name"
            placeholderTextColor="#dfddd3"
          />
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.sustain1}
            onChangeText={(value) => handleTechniqueChange(index, 'sustain1', value)}
            placeholder="Sustain 1"
            placeholderTextColor="#dfddd3"
          />
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={technique.sustain2}
            onChangeText={(value) => handleTechniqueChange(index, 'sustain2', value)}
            placeholder="Sustain 2"
            placeholderTextColor="#dfddd3"
          />
        </View>
      ))}
      {isEditable && (
        <TouchableOpacity style={styles.addButton} onPress={addTechnique}>
          <Icon name="add" size={24} color="#dfddd3" />
          <Text style={styles.addButtonText}>Add Technique</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.header}>Profit Factor</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Starting</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.profitFactor.starting}
          onChangeText={(value) => handleProfitFactorChange('starting', value)}
          placeholder="Starting Profit Factor"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Current</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.profitFactor.current}
          onChangeText={(value) => handleProfitFactorChange('current', value)}
          placeholder="Current Profit Factor"
          placeholderTextColor="#dfddd3"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Misfortunes</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.readOnly]}
          editable={isEditable}
          value={data.profitFactor.misfortunes}
          onChangeText={(value) => handleProfitFactorChange('misfortunes', value)}
          placeholder="Misfortunes"
          placeholderTextColor="#dfddd3"
        />
      </View>
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e3440',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#eceff4',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#eceff4',
    marginBottom: 8,
  },
  inputMulti: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  techniqueContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#3b4252',
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e81ac',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#eceff4',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  spacer: {
    height: 100,
  },
  readOnly: {
    backgroundColor: '#3b4252',
    color: '#aeb5c0',
  },
});
