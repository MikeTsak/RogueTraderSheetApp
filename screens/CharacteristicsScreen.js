import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiceRollerScreen from '../modules/DiceRollerScreen';

export default function CharacteristicsScreen({ route = {}, isEditable }) {
  const { characterId = 'default_character' } = route.params || {}; // Fallback to a default characterId

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
  const [activeDots, setActiveDots] = useState(
    Object.fromEntries(Object.keys(defaultCharacteristics).map((key) => [key, 0]))
  );

  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);
  const [activeTargetNumber, setActiveTargetNumber] = useState(null);

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const storedCharacteristics = await AsyncStorage.getItem(`characteristics_${characterId}`);
        const storedDots = await AsyncStorage.getItem(`activeDots_${characterId}`);

        if (storedCharacteristics) setCharacteristics(JSON.parse(storedCharacteristics));
        if (storedDots) setActiveDots(JSON.parse(storedDots));
      } catch (error) {
        console.error('Failed to load characteristics or dots:', error);
      }
    };
    loadCharacteristics();
  }, [characterId]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(`characteristics_${characterId}`, JSON.stringify(characteristics));
        await AsyncStorage.setItem(`activeDots_${characterId}`, JSON.stringify(activeDots));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    saveData();
  }, [characteristics, activeDots, characterId]);

  const showDiceRoller = (key) => {
    const baseValue = parseInt(characteristics[key]) || 0;
    setActiveTargetNumber(baseValue);
    setDiceRollerVisible(true);
  };

  const handleDotPress = (key, dotIndex) => {
    setActiveDots((prevDots) => {
      const updatedDots = { ...prevDots };
      updatedDots[key] = updatedDots[key] === dotIndex + 1 ? dotIndex : dotIndex + 1;
      return updatedDots;
    });
  };

  const renderCharacteristic = (label, key) => (
    <View style={styles.characteristicContainer} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => !isEditable && showDiceRoller(key)}
        activeOpacity={0.7}
      >
        <View pointerEvents={isEditable ? 'auto' : 'none'}>
          <TextInput
            style={[styles.input, !isEditable && styles.readOnly]}
            editable={isEditable}
            value={characteristics[key]}
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
              activeDots[key] > index && styles.activeDot,
            ]}
            onPress={() => isEditable && handleDotPress(key, index)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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
        targetNumber={activeTargetNumber}
        onClose={() => setDiceRollerVisible(false)}
      />
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3e4551',
    padding: 16,
    // You can set a default font for normal text here (optional):
    // fontFamily: 'SpaceGrotesk_400Regular',
  },
  header: {
    fontSize: 28,
    color: '#dfddd3',
    marginBottom: 20,
    textAlign: 'center',
    // Use the bold font family explicitly
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characteristicContainer: {
    width: '45%',
    marginBottom: 16,
    backgroundColor: '#535d75',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 18,
    color: '#dfddd3',
    marginBottom: 8,
    textAlign: 'center',
    // Use the bold font for labels
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  input: {
    backgroundColor: '#2e3440',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    // Use the regular font for inputs
    fontFamily: 'SpaceGrotesk_400Regular',
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
    backgroundColor: '#8b0000',
  },
  spacer: {
    height: 100,
  },
});
