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
import GearScreen from '../screens/GearScreen';
import Notesscreen from '../screens/Notesscreen';
import StatistcsScreen from '../screens/StatistcsScreen';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator({ route, navigation }) {
  const { characterId } = route.params || {};
  const [isEditable, setIsEditable] = useState(false);
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const storedCharacters = await AsyncStorage.getItem('ROGUE_TRADER_CHARACTERS');
        if (storedCharacters) {
          const characters = JSON.parse(storedCharacters);
          const selectedCharacter = characters.find((c) => c.id === characterId);
          setCharacterData(selectedCharacter || null);
        }
      } catch (error) {
        console.error('Error loading character data:', error);
      }
    };

    loadCharacterData();
  }, [characterId]);

  const saveCharacterData = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem('ROGUE_TRADER_CHARACTERS');
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      const updatedCharacters = characters.map((c) =>
        c.id === characterData.id ? characterData : c
      );

      await AsyncStorage.setItem(
        'ROGUE_TRADER_CHARACTERS',
        JSON.stringify(updatedCharacters)
      );
    } catch (error) {
      console.error('Error saving character data:', error);
    }
  };

  const handleEditPress = () => {
    if (isEditable) {
      saveCharacterData();
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" size={24} color="#dfddd3" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {characterData ? characterData.name : 'Loading...'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#301a19' }}>
      {renderCustomHeader()}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: '#535d75' },
            tabBarLabelStyle: { color: '#dfddd3', fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: '#dfddd3' },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen name="CharacterInfo">
            {() => (
              <CharacterInfoScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Characteristics">
            {() => (
              <CharacteristicsScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Skills">
            {() => (
              <SkillsScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="TalentsTraits">
            {() => (
              <TalentsTraitsScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Gear">
            {() => (
              <GearScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Statistics">
            {() => (
              <StatistcsScreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Notes">
            {() => (
              <Notesscreen
                characterData={characterData}
                setCharacterData={setCharacterData}
                isEditable={isEditable}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
      <View style={styles.editButtonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Icon name={isEditable ? 'save' : 'edit'} size={24} color="#dfddd3" />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>developed by miketsak.gr</Text>
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
    bottom: 50,
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
