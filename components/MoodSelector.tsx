import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MoodSelectorProps {
  selectedMood: number;
  onMoodSelect: (mood: number) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  selectedMood, 
  onMoodSelect 
}) => {
  const moods = [
    { emoji: '😢', label: 'Very Sad', value: 1, color: '#EF4444' },
    { emoji: '😔', label: 'Sad', value: 2, color: '#F97316' },
    { emoji: '😐', label: 'Okay', value: 3, color: '#EAB308' },
    { emoji: '😊', label: 'Good', value: 4, color: '#22C55E' },
    { emoji: '😄', label: 'Amazing', value: 5, color: '#10B981' },
  ];

  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.value}
          style={[
            styles.moodButton,
            selectedMood === mood.value && {
              backgroundColor: mood.color,
              transform: [{ scale: 1.1 }],
            },
          ]}
          onPress={() => onMoodSelect(mood.value)}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text
            style={[
              styles.label,
              selectedMood === mood.value && styles.selectedLabel,
            ]}>
            {mood.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});