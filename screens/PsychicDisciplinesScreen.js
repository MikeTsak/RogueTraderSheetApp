import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function PsychicDisciplinesScreen({ isEditable }) {
  const [psychicPowers, setPsychicPowers] = React.useState('Telepathy, Biomancy...');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Psychic Disciplines</Text>

      <TextInput
        style={[styles.inputMulti, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={psychicPowers}
        onChangeText={setPsychicPowers}
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
