import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dumbbell, Book, Radiation as Meditation, Coffee, Heart, Music } from 'lucide-react-native';

interface HabitTrackerProps {
  selectedHabits: string[];
  onHabitsChange: (habits: string[]) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  selectedHabits, 
  onHabitsChange 
}) => {
  const habits = [
    { id: 'exercise', name: 'Exercise', icon: Dumbbell, color: '#EF4444' },
    { id: 'reading', name: 'Reading', icon: Book, color: '#3B82F6' },
    { id: 'meditation', name: 'Meditation', icon: Meditation, color: '#8B5CF6' },
    { id: 'water', name: 'Hydration', icon: Coffee, color: '#14B8A6' },
    { id: 'gratitude', name: 'Gratitude', icon: Heart, color: '#EC4899' },
    { id: 'music', name: 'Music', icon: Music, color: '#F59E0B' },
  ];

  const toggleHabit = (habitId: string) => {
    if (selectedHabits.includes(habitId)) {
      onHabitsChange(selectedHabits.filter(id => id !== habitId));
    } else {
      onHabitsChange([...selectedHabits, habitId]);
    }
  };

  return (
    <View style={styles.container}>
      {habits.map((habit) => {
        const isSelected = selectedHabits.includes(habit.id);
        const IconComponent = habit.icon;
        
        return (
          <TouchableOpacity
            key={habit.id}
            style={[
              styles.habitButton,
              isSelected && {
                backgroundColor: habit.color,
                borderColor: habit.color,
              },
            ]}
            onPress={() => toggleHabit(habit.id)}>
            <IconComponent 
              size={20} 
              color={isSelected ? '#FFFFFF' : habit.color} 
            />
            <Text
              style={[
                styles.habitText,
                isSelected && styles.selectedHabitText,
              ]}>
              {habit.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    minWidth: '48%',
  },
  habitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  selectedHabitText: {
    color: '#FFFFFF',
  },
});