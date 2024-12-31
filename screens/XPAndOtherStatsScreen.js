import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function XPAndOtherStatsScreen({ isEditable }) {
  const [xp, setXp] = React.useState('2000');
  const [profitFactor, setProfitFactor] = React.useState('30');
  const [movement, setMovement] = React.useState('4');
  // ... Add more fields as desired ...

  return (
    <View style={styles.container}>
      <Text style={styles.header}>XP & Other Stats</Text>

      <Text style={styles.label}>XP</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={xp}
        onChangeText={setXp}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Profit Factor</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={profitFactor}
        onChangeText={setProfitFactor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Movement</Text>
      <TextInput
        style={[styles.input, !isEditable && styles.readOnly]}
        editable={isEditable}
        value={movement}
        onChangeText={setMovement}
        keyboardType="numeric"
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
  },
  label: {
    fontSize: 16,
    color: '#dfddd3',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#535d75',
    color: '#dfddd3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  readOnly: {
    backgroundColor: '#5d6363',
  },
});
