import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  characteristicsRow: {
    flexDirection: 'row',
    overflow: 'scroll',
  },
  characteristicItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  characteristicLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  characteristicInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
    marginBottom: 4,
  },
});

export default styles;
