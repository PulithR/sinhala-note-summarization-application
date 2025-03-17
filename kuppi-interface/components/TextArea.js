import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function TextArea({ value, onChangeText }) {
  return (
    <TextInput
      style={styles.textArea}
      placeholder="Type Your Content here..."
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={4}
      maxLength={3000}
    />
  );
}

const styles = StyleSheet.create({
  textArea: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
