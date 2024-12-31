import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import CharacterInfoScreen from '../screens/CharacterInfoScreen';
import CharacteristicsScreen from '../screens/CharacteristicsScreen';
import SkillsScreen from '../screens/SkillsScreen';
import TalentsTraitsScreen from '../screens/TalentsTraitsScreen';
import SpecialAbilitiesScreen from '../screens/SpecialAbilitiesScreen';
import PsychicDisciplinesScreen from '../screens/PsychicDisciplinesScreen';
import XPAndOtherStatsScreen from '../screens/XPAndOtherStatsScreen';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator({ route, navigation }) {
  // We get characterId from route.params
  const { characterId } = route.params || {};

  const [isEditable, setIsEditable] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    try {
      const jsonValue = await AsyncStorage.getItem('ROGUE_TRADER_CHARACTERS');
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue);
        setAllCharacters(parsed);

        // Find the one matching characterId
        const current = parsed.find((c) => c.id === characterId);
        if (current) {
          setCharacterData(current);
        }
      }
    } catch (e) {
      console.log('Error loading characters:', e);
    }
  }

  // Called when user presses the floppy disk
  async function saveCharacterData() {
    if (!characterData) return;
    // Update that character in the array
    const updatedList = allCharacters.map((c) => {
      if (c.id === characterData.id) {
        return characterData; // the updated data
      }
      return c;
    });
    setAllCharacters(updatedList);

    try {
      await AsyncStorage.setItem(
        'ROGUE_TRADER_CHARACTERS',
        JSON.stringify(updatedList)
      );
    } catch (e) {
      console.log('Error saving character:', e);
    }
  }

  // Toggle editing / saving
  function handleEditPress() {
    if (isEditable) {
      // Save data
      saveCharacterData();
      setIsEditable(false);
    } else {
      // Enter edit mode
      setIsEditable(true);
    }
  }

  // Custom header with hamburger + character name (or Loading...)
  function renderCustomHeader() {
    return (
      <View style={styles.customHeader}>
        {/* Hamburger Menu Icon */}
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu" size={24} color="#dfddd3" />
        </TouchableOpacity>

        {/* Character Name or Loading... */}
        <Text style={styles.headerTitle}>
          {characterData ? characterData.name : 'Loading...'}
        </Text>
      </View>
    );
  }

  // The pinned bottom-left button (pencil ↔ floppy)
  function renderEditSaveButton() {
    return (
      <View style={styles.editButtonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Icon
            name={isEditable ? 'save' : 'edit'}
            size={24}
            color="#dfddd3"
          />
        </TouchableOpacity>
      </View>
    );
  }

  // A small “developed by miketsak.gr” footer at the bottom center
  function renderFooter() {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>developed by miketsak.gr</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#301a19' }}>
      {/** 1) Our custom top bar (hamburger + name) */}
      {renderCustomHeader()}

      {/** 2) The actual tab navigator */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: '#535d75' },
            tabBarLabelStyle: { color: '#dfddd3', fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: '#dfddd3' },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="CharacterInfo"
            options={{ tabBarLabel: 'CHAR' }}
          >
            {(props) => (
              <CharacterInfoScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Characteristics"
            options={{ tabBarLabel: 'STATS' }}
          >
            {(props) => (
              <CharacteristicsScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Skills"
            options={{ tabBarLabel: 'SKILLS' }}
          >
            {(props) => (
              <SkillsScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="TalentsTraits"
            options={{ tabBarLabel: 'T&T' }}
          >
            {(props) => (
              <TalentsTraitsScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="SpecialAbilities"
            options={{ tabBarLabel: 'ABILITIES' }}
          >
            {(props) => (
              <SpecialAbilitiesScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="PsychicDisciplines"
            options={{ tabBarLabel: 'PSYCHIC' }}
          >
            {(props) => (
              <PsychicDisciplinesScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="XPAndOtherStats"
            options={{ tabBarLabel: 'XP / ETC' }}
          >
            {(props) => (
              <XPAndOtherStatsScreen
                {...props}
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>

        {/** 3) The pencil/floppy button */}
        {renderEditSaveButton()}

        {/** 4) The small footer */}
        {renderFooter()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#535d75',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#dfddd3',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 50, // or whatever looks good
    right: 20,
  },
  editButton: {
    backgroundColor: '#692210',
    padding: 12,
    borderRadius: 28,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 5,
  },
  footerText: {
    color: '#dfddd3',
  },
});
