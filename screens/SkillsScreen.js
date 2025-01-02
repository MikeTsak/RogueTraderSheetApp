import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiceRollerScreen from '../modules/DiceRollerScreen';

const skills = [
  { name: 'Acrobatics', characteristic: 'agility' },
  { name: 'Awareness', characteristic: 'perception' },
  { name: 'Barter', characteristic: 'fellowship' },
  { name: 'Blather', characteristic: 'fellowship' },
  { name: 'Carouse', characteristic: 'toughness' },
  { name: 'Charm', characteristic: 'fellowship' },
  { name: 'Chem-Use', characteristic: 'intelligence' },
  { name: 'Ciphers', characteristic: 'intelligence' },
  { name: 'Climb', characteristic: 'strength' },
  { name: 'Command', characteristic: 'fellowship' },
  { name: 'Commerce', characteristic: 'fellowship' },
  { name: 'Common Lore', characteristic: 'intelligence' },
  { name: 'Concealment', characteristic: 'agility' },
  { name: 'Contortionist', characteristic: 'agility' },
  { name: 'Deceive', characteristic: 'fellowship' },
  { name: 'Demolition', characteristic: 'intelligence' },
  { name: 'Disguise', characteristic: 'fellowship' },
  { name: 'Dodge', characteristic: 'agility' },
  { name: 'Drive', characteristic: 'agility' },
  { name: 'Evaluate', characteristic: 'intelligence' },
  { name: 'Forbidden Lore', characteristic: 'intelligence' },
  { name: 'Gamble', characteristic: 'intelligence' },
  { name: 'Inquiry', characteristic: 'fellowship' },
  { name: 'Interrogation', characteristic: 'willPower' },
  { name: 'Intimidate', characteristic: 'strength' },
  { name: 'Invocation', characteristic: 'willPower' },
  { name: 'Lip Reading', characteristic: 'perception' },
  { name: 'Literacy', characteristic: 'intelligence' },
  { name: 'Logic', characteristic: 'intelligence' },
  { name: 'Medicae', characteristic: 'intelligence' },
  { name: 'Navigation', characteristic: 'intelligence' },
  { name: 'Performer', characteristic: 'fellowship' },
  { name: 'Pilot', characteristic: 'agility' },
  { name: 'Psyniscience', characteristic: 'perception' },
  { name: 'Scholastic Lore', characteristic: 'intelligence' },
  { name: 'Scrutiny', characteristic: 'perception' },
  { name: 'Search', characteristic: 'perception' },
  { name: 'Secret Tongue', characteristic: 'intelligence' },
  { name: 'Security', characteristic: 'agility' },
  { name: 'Shadowing', characteristic: 'agility' },
  { name: 'Silent Move', characteristic: 'agility' },
  { name: 'Sleight of Hand', characteristic: 'agility' },
  { name: 'Speak Language', characteristic: 'intelligence' },
  { name: 'Survival', characteristic: 'intelligence' },
  { name: 'Swim', characteristic: 'strength' },
  { name: 'Tech-Use', characteristic: 'intelligence' },
  { name: 'Tracking', characteristic: 'intelligence' },
  { name: 'Trade', characteristic: 'intelligence' },
  { name: 'Wrangling', characteristic: 'intelligence' },
];

export default function SkillsScreen({ isEditable }) {
  const [characteristics, setCharacteristics] = useState({});
  const [skillStates, setSkillStates] = useState(() =>
    skills.reduce((acc, skill) => {
      acc[skill.name] = { dots: 0, bonus: 0, notes: '' };
      return acc;
    }, {})
  );

  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);
  const [activeSkillValue, setActiveSkillValue] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCharacteristics = await AsyncStorage.getItem('characteristics');
        const storedSkillStates = await AsyncStorage.getItem('skillStates');

        if (storedCharacteristics) {
          setCharacteristics(JSON.parse(storedCharacteristics));
        }
        if (storedSkillStates) {
          setSkillStates(JSON.parse(storedSkillStates));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('characteristics', JSON.stringify(characteristics));
        await AsyncStorage.setItem('skillStates', JSON.stringify(skillStates));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    saveData();
  }, [characteristics, skillStates]);

  const calculateSkillValue = (skillName, characteristicName) => {
    const characteristicValue = parseInt(characteristics[characteristicName] || 0, 10);
    const dotsValue = skillStates[skillName]?.dots || 0;
    const bonusValue = skillStates[skillName]?.bonus || 0;
    return characteristicValue + dotsValue * 5 + bonusValue;
  };

  const handleDotPress = (skillName, index) => {
    if (!isEditable) return;
    setSkillStates((prev) => ({
      ...prev,
      [skillName]: { ...prev[skillName], dots: index + 1 },
    }));
  };

  const rollSkill = (skillName, characteristicName) => {
    const skillValue = calculateSkillValue(skillName, characteristicName);
    setActiveSkillValue(skillValue);
    setDiceRollerVisible(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Skills</Text>
        {skills.map((skill) => (
          <View key={skill.name} style={styles.skillRow}>
            <View style={styles.skillHeader}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillCharacteristic}>
                ({skill.characteristic})
              </Text>
            </View>
            <Text style={styles.skillValue}>
              Value: {calculateSkillValue(skill.name, skill.characteristic)}
            </Text>
            <View style={styles.controls}>
              <View style={styles.dotsContainer}>
                {[...Array(5)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dot,
                      skillStates[skill.name]?.dots > index && styles.filledDot,
                    ]}
                    onPress={() => handleDotPress(skill.name, index)}
                  />
                ))}
              </View>
              <TextInput
                style={[styles.bonusInput, !isEditable && styles.readOnly]}
                editable={isEditable}
                value={(skillStates[skill.name]?.bonus || 0).toString()}
                onChangeText={(value) =>
                  setSkillStates((prev) => ({
                    ...prev,
                    [skill.name]: { ...prev[skill.name], bonus: parseInt(value, 10) || 0 },
                  }))
                }
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.rollButton}
                onPress={() => rollSkill(skill.name, skill.characteristic)}
              >
                <Text style={styles.rollButtonText}>Roll</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <DiceRollerScreen
        isVisible={isDiceRollerVisible}
        targetNumber={activeSkillValue}
        onClose={() => setDiceRollerVisible(false)}
      />
    </>
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
    textAlign: 'center',
  },
  skillRow: {
    backgroundColor: '#3b4252',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    color: '#eceff4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillCharacteristic: {
    color: '#88c0d0',
    fontSize: 14,
  },
  skillValue: {
    color: '#d8dee9',
    fontSize: 16,
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d8dee9',
    marginHorizontal: 2,
  },
  filledDot: {
    backgroundColor: '#88c0d0',
  },
  bonusInput: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 4,
    borderRadius: 4,
    textAlign: 'center',
    width: 50,
  },
  rollButton: {
    backgroundColor: '#81a1c1',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rollButtonText: {
    color: '#2e3440',
    fontWeight: 'bold',
    fontSize: 14,
  },
  readOnly: {
    backgroundColor: '#4c566a',
    color: '#d8dee9',
  },
});
