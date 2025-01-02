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

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);

  // Load notes from local storage on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        } else {
          setNotes([{ title: 'New Note', content: '' }]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadNotes();
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };

    saveNotes();
  }, [notes]);

  // Add a new note
  const addNote = () => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { title: `Note ${prevNotes.length + 1}`, content: '' },
    ]);
    setActiveNoteIndex(notes.length);
  };

  // Delete a note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setActiveNoteIndex(Math.max(0, index - 1));
  };

  // Update a note's content
  const updateNoteContent = (content) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, i) =>
        i === activeNoteIndex ? { ...note, content } : note
      )
    );
  };

  // Update a note's title
  const updateNoteTitle = (title) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, i) =>
        i === activeNoteIndex ? { ...note, title } : note
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>

      {/* Scrollable Titles */}
      <ScrollView
        horizontal
        style={styles.titlesContainer}
        showsHorizontalScrollIndicator={false}
      >
        {notes.map((note, index) => (
          <View key={index} style={styles.titleWrapper}>
            <TouchableOpacity
              style={[
                styles.titleTab,
                index === activeNoteIndex && styles.activeTitleTab,
              ]}
              onPress={() => setActiveNoteIndex(index)}
            >
              <Text style={styles.titleText}>{note.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNote(index)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Note Editor */}
      {notes.length > 0 && (
        <View style={styles.noteEditor}>
          <TextInput
            style={styles.titleInput}
            value={notes[activeNoteIndex]?.title || ''}
            onChangeText={updateNoteTitle}
            placeholder="Note Title"
            placeholderTextColor="#dfddd3"
          />
          <TextInput
            style={styles.textArea}
            value={notes[activeNoteIndex]?.content || ''}
            onChangeText={updateNoteContent}
            placeholder="Write your notes here..."
            placeholderTextColor="#dfddd3"
            multiline
          />
        </View>
      )}
    </View>
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
  titlesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  titleTab: {
    backgroundColor: '#4c566a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 120,
  },
  activeTitleTab: {
    backgroundColor: '#88c0d0',
  },
  titleText: {
    color: '#eceff4',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 4,
    backgroundColor: '#bf616a',
    borderRadius: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#eceff4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#a3be8c',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#2e3440',
    fontSize: 24,
    fontWeight: 'bold',
  },
  noteEditor: {
    flex: 1,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#3b4252',
    borderRadius: 8,
  },
  titleInput: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: '#4c566a',
    color: '#eceff4',
    padding: 10,
    borderRadius: 8,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
  },
});
