import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiceRollerScreen from '../modules/DiceRollerScreen';

export default function CharacteristicsScreen({ isEditable }) {
  const defaultCharacteristics = {
    weaponSkill: '00',
    ballisticSkill: '00',
    strength: '00',
    toughness: '00',
    agility: '00',
    intelligence: '00',
    perception: '00',
    willPower: '00',
    fellowship: '00',
  };

  const [characteristics, setCharacteristics] = useState(defaultCharacteristics);
  const [adjustments, setAdjustments] = useState(
    Object.fromEntries(Object.keys(defaultCharacteristics).map((key) => [key, 0]))
  );

  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);
  const [activeTargetNumber, setActiveTargetNumber] = useState(null);

  useEffect(() => {
    // Load characteristics from AsyncStorage
    const loadCharacteristics = async () => {
      try {
        const storedCharacteristics = await AsyncStorage.getItem('characteristics');
        if (storedCharacteristics) {
          setCharacteristics(JSON.parse(storedCharacteristics));
        }
      } catch (error) {
        console.error('Failed to load characteristics:', error);
      }
    };
    loadCharacteristics();
  }, []);

  useEffect(() => {
    // Save characteristics to AsyncStorage whenever they change
    const saveCharacteristics = async () => {
      try {
        await AsyncStorage.setItem('characteristics', JSON.stringify(characteristics));
      } catch (error) {
        console.error('Failed to save characteristics:', error);
      }
    };
    saveCharacteristics();
  }, [characteristics]);

  // Function to show the dice roller
  const showDiceRoller = (key) => {
    const baseValue = parseInt(characteristics[key]) || 0;
    const modifiedValue = baseValue + adjustments[key];
    setActiveTargetNumber(modifiedValue); // Set the target number with adjustments
    setDiceRollerVisible(true);
  };

  const handleDotPress = (key, dotIndex) => {
    setAdjustments((prevAdjustments) => {
      const newAdjustments = { ...prevAdjustments };
      const currentAdjustment = newAdjustments[key];

      if (dotIndex < 4 && currentAdjustment >= dotIndex * 5 + 5) {
        newAdjustments[key] -= 5;
      } else if (dotIndex < 4 && currentAdjustment < dotIndex * 5 + 5) {
        newAdjustments[key] += 5;
      }
      return newAdjustments;
    });
  };

  const renderCharacteristic = (label, key) => (
    <View style={styles.characteristicContainer} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => !isEditable && showDiceRoller(key)} // Show dice roller only when not editable
      >
        <View pointerEvents={isEditable ? 'auto' : 'none'}>
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={
              isEditable
                ? characteristics[key]
                : (parseInt(characteristics[key]) + adjustments[key]).toString()
            }
            onChangeText={(value) =>
              setCharacteristics((prev) => ({ ...prev, [key]: value }))
            }
            keyboardType="numeric"
          />
        </View>
      </TouchableOpacity>
      <View style={styles.dotsContainer}>
        {[...Array(4)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              adjustments[key] >= (index + 1) * 5 ? styles.activeDot : null,
            ]}
            onPress={() => isEditable && handleDotPress(key, index)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Characteristics</Text>
      <View style={styles.grid}>
        {renderCharacteristic('Weapon Skill (WS)', 'weaponSkill')}
        {renderCharacteristic('Ballistic Skill (BS)', 'ballisticSkill')}
        {renderCharacteristic('Strength (S)', 'strength')}
        {renderCharacteristic('Toughness (T)', 'toughness')}
        {renderCharacteristic('Agility (Ag)', 'agility')}
        {renderCharacteristic('Intelligence (Int)', 'intelligence')}
        {renderCharacteristic('Perception (Per)', 'perception')}
        {renderCharacteristic('Will Power (WP)', 'willPower')}
        {renderCharacteristic('Fellowship (Fel)', 'fellowship')}
      </View>
      <DiceRollerScreen
        isVisible={isDiceRollerVisible}
        targetNumber={activeTargetNumber} // Pass the calculated target number
        onClose={() => setDiceRollerVisible(false)}
      />
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
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characteristicContainer: {
    width: '45%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#dfddd3',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#dfddd3',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#692210',
  },
});
