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
      wounds: 'wounds',
      'fate points': 'fatePoints',
      insanity: 'insanity',
      lifting: 'lifting',
      corruption: 'corruption',
      movement: 'movement',
    };
  
    const mappedCategory = categoryMap[category.toLowerCase()];
    const setters = {
      wounds: setWounds,
      fatePoints: setFatePoints,
      insanity: setInsanity,
      lifting: setLifting,
      corruption: setCorruption,
      movement: setMovement,
    };
  
    if (setters[mappedCategory]) {
      setters[mappedCategory]((prev) => ({ ...prev, [field]: value }));
    } else {
      console.error(`Category "${category}" is not mapped to a state setter.`);
    }
  };
  

  const renderCounter = (label, value, category, field) => (
    <View key={field} style={styles.counterContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counterControls}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => {
            const newValue = Math.max(0, parseInt(value || 0, 10) - 1);
            updateField(category, field, newValue.toString());
          }}
        >
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value || 0}</Text>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => {
            const newValue = parseInt(value || 0, 10) + 1;
            updateField(category, field, newValue.toString());
          }}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSection = (title, fields, state, setState) => (
    <View key={title} style={styles.section}>
      <Text style={styles.header}>{title}</Text>
      <View style={styles.box}>
        {fields.map(({ label, field, placeholder, type }) =>
          type === 'counter' ? (
            renderCounter(label, state[field], title.toLowerCase(), field)
          ) : (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, !isEditable && styles.readOnly]}
                editable={isEditable}
                placeholder={placeholder}
                placeholderTextColor="#dfddd3"
                value={state[field]?.toString()}
                onChangeText={(value) => updateField(title.toLowerCase(), field, value)}
              />
            </View>
          )
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection(
        'Wounds',
        [
          { label: 'Total', field: 'total', placeholder: 'Total', type: 'input' },
          { label: 'Current', field: 'current', placeholder: '', type: 'counter' },
          { label: 'Critical Damage', field: 'criticalDamage', placeholder: 'Critical Damage', type: 'input' },
          { label: 'Fatigue', field: 'fatigue', placeholder: 'Fatigue', type: 'input' },
        ],
        wounds,
        setWounds
      )}

      {renderSection(
        'Fate Points',
        [
          { label: 'Total', field: 'total', placeholder: 'Total', type: 'input' },
          { label: 'Current', field: 'current', placeholder: '', type: 'counter' },
        ],
        fatePoints,
        setFatePoints
      )}

      {renderSection(
        'Insanity',
        [
          { label: 'Points', field: 'points', placeholder: 'Current Points', type: 'input' },
          { label: 'Degree', field: 'degree', placeholder: 'Degree', type: 'input' },
          { label: 'Disorders', field: 'disorders', placeholder: 'Disorders', type: 'input' },
        ],
        insanity,
        setInsanity
      )}

      {renderSection(
        'Lifting',
        [
          { label: 'Lift', field: 'lift', placeholder: 'Lift', type: 'input' },
          { label: 'Carry', field: 'carry', placeholder: 'Carry', type: 'input' },
          { label: 'Push', field: 'push', placeholder: 'Push', type: 'input' },
        ],
        lifting,
        setLifting
      )}

      {renderSection(
        'Corruption',
        [
          { label: 'Points', field: 'points', placeholder: 'Current Points', type: 'input' },
          { label: 'Degree', field: 'degree', placeholder: 'Degree', type: 'input' },
          { label: 'Malignancies', field: 'malignancies', placeholder: 'Malignancies', type: 'input' },
        ],
        corruption,
        setCorruption
      )}

      {renderSection(
        'Movement',
        [
          { label: 'Half Move', field: 'halfMove', placeholder: 'Half Move', type: 'input' },
          { label: 'Full Move', field: 'fullMove', placeholder: 'Full Move', type: 'input' },
          { label: 'Charge', field: 'charge', placeholder: 'Charge', type: 'input' },
          { label: 'Run', field: 'run', placeholder: 'Run', type: 'input' },
          { label: 'Base Leap', field: 'baseLeap', placeholder: 'Base Leap', type: 'input' },
          { label: 'Base Jump', field: 'baseJump', placeholder: 'Base Jump', type: 'input' },
        ],
        movement,
        setMovement
      )}

      <View style={styles.spacer} />
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
    fontWeight: 'bold',
    textAlign: 'left',
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
  counterContainer: {
    marginBottom: 12,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#81a1c1',
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  counterButtonText: {
    fontSize: 16,
    color: '#eceff4',
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 16,
    color: '#eceff4',
    fontWeight: 'bold',
  },
  spacer: {
    height: 60,
  },
});
