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

export default function GearScreen({ isEditable }) {
  const [gear, setGear] = useState('');
  const [acquisitions, setAcquisitions] = useState('');
  const [armor, setArmor] = useState({
    head: { value: '', type: '' },
    body: { value: '', type: '' },
    rightArm: { value: '', type: '' },
    leftArm: { value: '', type: '' },
    rightLeg: { value: '', type: '' },
    leftLeg: { value: '', type: '' },
  });
  const [weapons, setWeapons] = useState([]);

  const armorSectionsOrder = [
    { section: 'head', percentile: '1-10' },
    { section: 'body', percentile: '31-70' },
    { section: 'rightArm', percentile: '11-20' },
    { section: 'leftArm', percentile: '21-30' },
    { section: 'rightLeg', percentile: '71-85' },
    { section: 'leftLeg', percentile: '86-100' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedGear = await AsyncStorage.getItem('gear');
        const storedAcquisitions = await AsyncStorage.getItem('acquisitions');
        const storedArmor = await AsyncStorage.getItem('armor');
        const storedWeapons = await AsyncStorage.getItem('weapons');

        if (storedGear) setGear(storedGear);
        if (storedAcquisitions) setAcquisitions(storedAcquisitions);
        if (storedArmor) setArmor(JSON.parse(storedArmor));
        if (storedWeapons) setWeapons(JSON.parse(storedWeapons));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('gear', gear);
        await AsyncStorage.setItem('acquisitions', acquisitions);
        await AsyncStorage.setItem('armor', JSON.stringify(armor));
        await AsyncStorage.setItem('weapons', JSON.stringify(weapons));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    saveData();
  }, [gear, acquisitions, armor, weapons]);

  const updateArmor = (section, field, value) => {
    setArmor((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const addWeapon = () => {
    setWeapons((prev) => [
      ...prev,
      {
        name: '',
        class: '',
        damage: '',
        type: '',
        pen: '',
        range: '',
        rof: '',
        clip: '',
        reload: '',
        specialRules: '',
      },
    ]);
  };

  const updateWeapon = (index, field, value) => {
    setWeapons((prev) =>
      prev.map((weapon, i) =>
        i === index ? { ...weapon, [field]: value } : weapon
      )
    );
  };

  const removeWeapon = (index) => {
    setWeapons((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gear</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={gear}
        onChangeText={setGear}
        placeholder="Enter gear details..."
        multiline
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.header}>Acquisitions</Text>
      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={acquisitions}
        onChangeText={setAcquisitions}
        placeholder="Enter acquisitions..."
        multiline
        placeholderTextColor="#dfddd3"
      />

      <Text style={styles.header}>Armor</Text>
      <View style={styles.armorContainer}>
        {armorSectionsOrder.map(({ section, percentile }) => (
          <View key={section} style={styles.armorBox}>
            <Text style={styles.label}>
              {section.toUpperCase()} ({percentile})
            </Text>
            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              editable={isEditable}
              placeholder="Value"
              value={armor[section].value}
              onChangeText={(value) => updateArmor(section, 'value', value)}
              placeholderTextColor="#dfddd3"
            />
            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              editable={isEditable}
              placeholder="Type"
              value={armor[section].type}
              onChangeText={(value) => updateArmor(section, 'type', value)}
              placeholderTextColor="#dfddd3"
            />
          </View>
        ))}
      </View>

      <Text style={styles.header}>Weapons</Text>
      {weapons.map((weapon, index) => (
        <View key={index} style={styles.weaponContainer}>
          <Text style={styles.weaponHeader}>Weapon {index + 1}</Text>
          <View style={styles.weaponRow}>
            <TextInput
              style={styles.input}
              editable={isEditable}
              placeholder="Name"
              value={weapon.name}
              onChangeText={(value) => updateWeapon(index, 'name', value)}
              placeholderTextColor="#dfddd3"
            />
            <TextInput
              style={styles.input}
              editable={isEditable}
              placeholder="Class"
              value={weapon.class}
              onChangeText={(value) => updateWeapon(index, 'class', value)}
              placeholderTextColor="#dfddd3"
            />
          </View>
          <View style={styles.weaponRow}>
            <TextInput
              style={styles.input}
              editable={isEditable}
              placeholder="Damage"
              value={weapon.damage}
              onChangeText={(value) => updateWeapon(index, 'damage', value)}
              placeholderTextColor="#dfddd3"
            />
            <TextInput
              style={styles.input}
              editable={isEditable}
              placeholder="Type"
              value={weapon.type}
              onChangeText={(value) => updateWeapon(index, 'type', value)}
              placeholderTextColor="#dfddd3"
            />
            <TextInput
              style={styles.input}
              editable={isEditable}
              placeholder="Pen"
              value={weapon.pen}
              onChangeText={(value) => updateWeapon(index, 'pen', value)}
              placeholderTextColor="#dfddd3"
            />
          </View>
          <TextInput
            style={styles.inputMulti}
            editable={isEditable}
            placeholder="Special Rules"
            value={weapon.specialRules}
            onChangeText={(value) =>
              updateWeapon(index, 'specialRules', value)
            }
            multiline
            placeholderTextColor="#dfddd3"
          />
          {isEditable && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeWeapon(index)}
            >
              <Text style={styles.buttonText}>Remove Weapon</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {isEditable && (
        <TouchableOpacity style={styles.addButton} onPress={addWeapon}>
          <Text style={styles.buttonText}>Add Weapon</Text>
        </TouchableOpacity>
      )}

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
    fontFamily: 'SpaceGrotesk_700Bold',
    textAlign: 'center',
  },
  inputMulti: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  input: {
    flex: 1,
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  armorContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  armorBox: {
    width: '48%',
    backgroundColor: '#3b4252',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    color: '#eceff4',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  weaponContainer: {
    padding: 10,
    backgroundColor: '#3b4252',
    borderRadius: 8,
    marginBottom: 16,
  },
  weaponHeader: {
    color: '#eceff4',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  weaponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#5e81ac',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#bf616a',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#eceff4',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  spacer: {
    height: 50,
  },
});
