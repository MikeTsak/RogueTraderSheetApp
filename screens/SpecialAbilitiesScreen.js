import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function SpecialAbilitiesScreen({ isEditable }) {
  const [abilities, setAbilities] = React.useState('Emperor’s Blessing, Adeptus Astartes...');
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Special Abilities</Text>

      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={abilities}
        onChangeText={setAbilities}
        multiline
      />
    </ScrollView>
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
  },
  inputMulti: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
});
