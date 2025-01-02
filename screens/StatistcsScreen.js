import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatisticsScreen({ isEditable }) {
  const [corruption, setCorruption] = useState({
    points: '',
    degree: '',
    malignancies: '',
  });
  const [wounds, setWounds] = useState({
    total: '',
    current: 0,
    criticalDamage: '',
    fatigue: '',
  });
  const [insanity, setInsanity] = useState({
    points: '',
    degree: '',
    disorders: '',
  });
  const [lifting, setLifting] = useState({
    lift: '',
    carry: '',
    push: '',
  });
  const [fatePoints, setFatePoints] = useState({
    total: '',
    current: 0,
  });
  const [movement, setMovement] = useState({
    halfMove: '',
    fullMove: '',
    charge: '',
    run: '',
    baseLeap: '',
    baseJump: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCorruption = await AsyncStorage.getItem('corruption');
        const storedWounds = await AsyncStorage.getItem('wounds');
        const storedInsanity = await AsyncStorage.getItem('insanity');
        const storedLifting = await AsyncStorage.getItem('lifting');
        const storedFatePoints = await AsyncStorage.getItem('fatePoints');
        const storedMovement = await AsyncStorage.getItem('movement');

        if (storedCorruption) setCorruption(JSON.parse(storedCorruption));
        if (storedWounds) setWounds(JSON.parse(storedWounds));
        if (storedInsanity) setInsanity(JSON.parse(storedInsanity));
        if (storedLifting) setLifting(JSON.parse(storedLifting));
        if (storedFatePoints) setFatePoints(JSON.parse(storedFatePoints));
        if (storedMovement) setMovement(JSON.parse(storedMovement));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('corruption', JSON.stringify(corruption));
        await AsyncStorage.setItem('wounds', JSON.stringify(wounds));
        await AsyncStorage.setItem('insanity', JSON.stringify(insanity));
        await AsyncStorage.setItem('lifting', JSON.stringify(lifting));
        await AsyncStorage.setItem('fatePoints', JSON.stringify(fatePoints));
        await AsyncStorage.setItem('movement', JSON.stringify(movement));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    saveData();
  }, [corruption, wounds, insanity, lifting, fatePoints, movement]);

  const updateField = (category, field, value) => {
    const categoryMap = {
      wounds: setWounds,
      fatePoints: setFatePoints,
      insanity: setInsanity,
      lifting: setLifting,
      corruption: setCorruption,
      movement: setMovement,
    };
    if (categoryMap[category]) {
      categoryMap[category]((prev) => ({ ...prev, [field]: value }));
    }
  };

  const renderSection = (title, fields, state) => (
    <View key={title} style={styles.section}>
      <Text style={styles.header}>{title}</Text>
      <View style={styles.box}>
        {fields.map(({ label, field, placeholder, type }) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              editable={isEditable}
              placeholder={placeholder}
              placeholderTextColor="#dfddd3"
              value={state[field]?.toString()} // Ensure the value is derived from the state
              onChangeText={(value) => updateField(title.toLowerCase(), field, value)}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection('Wounds', [
        { label: 'Total', field: 'total', placeholder: 'Total' },
        { label: 'Current', field: 'current', placeholder: 'Current' },
        { label: 'Critical Damage', field: 'criticalDamage', placeholder: 'Critical Damage' },
        { label: 'Fatigue', field: 'fatigue', placeholder: 'Fatigue' },
      ], wounds)}

      {renderSection('Fate Points', [
        { label: 'Total', field: 'total', placeholder: 'Total' },
        { label: 'Current', field: 'current', placeholder: 'Current' },
      ], fatePoints)}

      {renderSection('Insanity', [
        { label: 'Points', field: 'points', placeholder: 'Points' },
        { label: 'Degree', field: 'degree', placeholder: 'Degree' },
        { label: 'Disorders', field: 'disorders', placeholder: 'Disorders' },
      ], insanity)}

      {renderSection('Lifting', [
        { label: 'Lift', field: 'lift', placeholder: 'Lift' },
        { label: 'Carry', field: 'carry', placeholder: 'Carry' },
        { label: 'Push', field: 'push', placeholder: 'Push' },
      ], lifting)}

      {renderSection('Corruption', [
        { label: 'Points', field: 'points', placeholder: 'Points' },
        { label: 'Degree', field: 'degree', placeholder: 'Degree' },
        { label: 'Malignancies', field: 'malignancies', placeholder: 'Malignancies' },
      ], corruption)}

      {renderSection('Movement', [
        { label: 'Half Move', field: 'halfMove', placeholder: 'Half Move' },
        { label: 'Full Move', field: 'fullMove', placeholder: 'Full Move' },
        { label: 'Charge', field: 'charge', placeholder: 'Charge' },
        { label: 'Run', field: 'run', placeholder: 'Run' },
        { label: 'Base Leap', field: 'baseLeap', placeholder: 'Base Leap' },
        { label: 'Base Jump', field: 'baseJump', placeholder: 'Base Jump' },
      ], movement)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e3440',
    padding: 12,
  },
  header: {
    fontSize: 18,
    color: '#eceff4',
    marginBottom: 8,
  },
  box: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#3b4252',
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#d8dee9',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 6,
    borderRadius: 6,
  },
  readOnly: {
    backgroundColor: '#5e81ac',
  },
});
