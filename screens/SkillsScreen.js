import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiceRollerScreen from '../modules/DiceRollerScreen';

// Define all skills and their associated characteristics
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
  const defaultCharacteristics = {
    strength: 0,
    agility: 0,
    toughness: 0,
    intelligence: 0,
    perception: 0,
    willPower: 0,
    fellowship: 0,
  };

  const [characteristics, setCharacteristics] = useState(defaultCharacteristics);
  const [skillStates, setSkillStates] = useState(() => {
    const initialStates = {};
    skills.forEach((skill) => {
      initialStates[skill.name] = {
        dots: 0,
        bonus: 0,
        notes: '',
      };
    });
    return initialStates;
  });

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
        console.error('Failed to load data from local storage:', error);
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
        console.error('Failed to save data to local storage:', error);
      }
    };

    saveData();
  }, [characteristics, skillStates]);

  const calculateSkillValue = (skillName, characteristicName) => {
    const characteristicValue =
      parseInt(characteristics[characteristicName] || 0) +
      (skillStates[skillName]?.dots || 0) * 10;
    const skill = skillStates[skillName];
    return characteristicValue + (skill?.bonus || 0);
  };

  const handleSkillUpdate = (skillName, field, value) => {
    setSkillStates((prev) => ({
      ...prev,
      [skillName]: {
        ...prev[skillName],
        [field]: field === 'dots' || field === 'bonus' ? parseInt(value) || 0 : value,
      },
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
            <TouchableOpacity
              onPress={() => rollSkill(skill.name, skill.characteristic)}
            >
              <Text style={styles.skillName}>
                {skill.name} ({skill.characteristic})
              </Text>
              <Text style={styles.skillValue}>
                Value: {calculateSkillValue(skill.name, skill.characteristic)}
              </Text>
            </TouchableOpacity>

            <View style={styles.dotsContainer}>
              {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    skillStates[skill.name]?.dots > i && styles.filledDot,
                    !isEditable && styles.readOnlyDot,
                  ]}
                  onPress={() =>
                    isEditable &&
                    handleSkillUpdate(
                      skill.name,
                      'dots',
                      skillStates[skill.name]?.dots === i + 1 ? i : i + 1
                    )
                  }
                />
              ))}
            </View>

            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              editable={isEditable}
              value={(skillStates[skill.name]?.bonus || 0).toString()}
              onChangeText={(value) => handleSkillUpdate(skill.name, 'bonus', value)}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.notesInput, !isEditable && styles.readOnly]}
              editable={isEditable}
              placeholder="Notes..."
              value={skillStates[skill.name]?.notes || ''}
              onChangeText={(value) => handleSkillUpdate(skill.name, 'notes', value)}
            />
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
  skillRow: {
    marginBottom: 16,
    backgroundColor: '#535d75',
    borderRadius: 8,
    padding: 8,
  },
  skillName: {
    color: '#dfddd3',
    fontSize: 18,
    marginBottom: 8,
  },
  skillValue: {
    color: '#dfddd3',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dfddd3',
    marginHorizontal: 2,
  },
  filledDot: {
    backgroundColor: '#dfddd3',
  },
  readOnlyDot: {
    opacity: 0.5,
  },
  input: {
    backgroundColor: '#301a19',
    color: '#dfddd3',
    padding: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#301a19',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
  },
  readOnly: {
    backgroundColor: '#5d6363',
    color: '#aaaaaa',
  },
});
