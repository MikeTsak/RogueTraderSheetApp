import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; //  <-- Import from React Navigation
import DiceRollerScreen from '../modules/DiceRollerScreen';

// The original skills array
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

// Utility to group skills by first letter
function groupSkillsByLetter(skillsArray) {
  const grouped = {};
  skillsArray.forEach((skill) => {
    const firstLetter = skill.name[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(skill);
  });
  // Sort each group's skills alphabetically
  Object.keys(grouped).forEach((letter) => {
    grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
  });
  return grouped;
}

export default function SkillsScreen({ isEditable, route }) {
  const { characterId = 'default_character' } = route?.params || {};

  // 1) Group and sort your skills by letter.
  const groupedSkills = groupSkillsByLetter(skills);
  // 2) Get a sorted array of letter keys
  const letters = Object.keys(groupedSkills).sort();

  // If you need to store characteristics, do so here:
  const [characteristics, setCharacteristics] = useState({});

  // skillStates is where we keep track of dots, bonus, notes, etc.
  const [skillStates, setSkillStates] = useState(() =>
    skills.reduce((acc, skill) => {
      acc[skill.name] = { dots: 0, bonus: 0, notes: '' };
      return acc;
    }, {})
  );

  // For the Dice Roller
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);
  const [activeSkillValue, setActiveSkillValue] = useState(null);

  // Ref for the main ScrollView
  const scrollViewRef = useRef(null);
  // Holds Y-positions for each letter group
  const [sectionPositions, setSectionPositions] = useState({});

  // Load from AsyncStorage
  const loadData = async () => {
    try {
      const storedCharacteristics = await AsyncStorage.getItem(
        `characteristics_${characterId}`
      );
      const storedSkillStates = await AsyncStorage.getItem(
        `skillStates_${characterId}`
      );

      if (storedCharacteristics) {
        setCharacteristics(JSON.parse(storedCharacteristics));
      } else {
        console.warn('No characteristics found in AsyncStorage');
      }

      if (storedSkillStates) {
        setSkillStates(JSON.parse(storedSkillStates));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Save to AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        `characteristics_${characterId}`,
        JSON.stringify(characteristics)
      );
      await AsyncStorage.setItem(
        `skillStates_${characterId}`,
        JSON.stringify(skillStates)
      );
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Reload data when screen regains focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [characterId])
  );

  // Automatically save whenever skillStates or characteristics change
  React.useEffect(() => {
    saveData();
  }, [characteristics, skillStates]);

  // Calculate final skill value
  const calculateSkillValue = (skillName, characteristicName) => {
    const characteristicValue = parseInt(characteristics[characteristicName] || '0', 10);
    const dotsValue = skillStates[skillName]?.dots || 0;
    const bonusValue = skillStates[skillName]?.bonus || 0;
    return characteristicValue + dotsValue * 5 + bonusValue;
  };

  // Called when you press a dot. This increments the dot count for that skill.
  const handleDotPress = (skillName, index) => {
    if (!isEditable) return;
    setSkillStates((prev) => ({
      ...prev,
      [skillName]: { ...prev[skillName], dots: index + 1 },
    }));
  };

  // Rolling a skill
  const rollSkill = (skillName, characteristicName) => {
    const skillValue = calculateSkillValue(skillName, characteristicName);
    setActiveSkillValue(skillValue);
    setDiceRollerVisible(true);
  };

  // Tapping a letter to scroll to that group's Y-position
  const handlePressLetter = (letter) => {
    if (scrollViewRef.current && sectionPositions[letter] !== undefined) {
      scrollViewRef.current.scrollTo({
        y: sectionPositions[letter],
        animated: true,
      });
    }
  };

  return (
    <>
      {/* Top bar for letters */}
      <View style={styles.lettersBarContainer}>
        <Text style={styles.header}>Skills</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {letters.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={styles.letterButton}
              onPress={() => handlePressLetter(letter)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {letters.map((letter) => {
          const letterGroup = groupedSkills[letter];
          return (
            <View
              key={letter}
              onLayout={(e) => {
                // Save the Y position for this letter
                const layout = e.nativeEvent.layout;
                setSectionPositions((prev) => ({
                  ...prev,
                  [letter]: layout.y + (prev[letter] || 0),
                }));
              }}
            >
              <Text style={styles.letterHeader}>{letter}</Text>
              {letterGroup.map((skill) => (
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
                          [skill.name]: {
                            ...prev[skill.name],
                            bonus: parseInt(value, 10) || 0,
                          },
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
            </View>
          );
        })}
      </ScrollView>

      <DiceRollerScreen
        isVisible={isDiceRollerVisible}
        targetNumber={activeSkillValue}
        onClose={() => setDiceRollerVisible(false)}
      />
    </>
  );
}

// Styles remain unchanged (or adapt to your preference)
const styles = StyleSheet.create({
  lettersBarContainer: {
    backgroundColor: '#3b4252',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    color: '#eceff4',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    textAlign: 'center',
  },
  letterButton: {
    marginRight: 10,
    backgroundColor: '#81a1c1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  letterText: {
    color: '#2e3440',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#2e3440',
    padding: 16,
  },
  letterHeader: {
    fontSize: 20,
    color: '#eceff4',
    marginVertical: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
    textDecorationLine: 'underline',
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
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  skillCharacteristic: {
    color: '#88c0d0',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  skillValue: {
    color: '#d8dee9',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_400Regular',
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
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  rollButton: {
    backgroundColor: '#81a1c1',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rollButtonText: {
    color: '#2e3440',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  readOnly: {
    backgroundColor: '#4c566a',
    color: '#d8dee9',
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});
