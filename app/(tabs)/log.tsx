import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Smile, Target, BookOpen, Check } from 'lucide-react-native';
import { MoodSelector } from '@/components/MoodSelector';
import { HabitTracker } from '@/components/HabitTracker';
import { SleepSlider } from '@/components/SleepSlider';

export default function LogEntry() {
  const [selectedMood, setSelectedMood] = useState(0);
  const [sleepHours, setSleepHours] = useState(8);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEntry = async () => {
    if (selectedMood === 0) {
      Alert.alert('Missing Information', 'Please select your mood');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Entry Saved! 🎉',
        'Your wellness data has been logged successfully.',
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMood(0);
    setSleepHours(8);
    setSelectedHabits([]);
    setReflection('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#14B8A6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <Text style={styles.headerSubtitle}>How are you feeling today?</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Smile size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Mood</Text>
          </View>
          <MoodSelector 
            selectedMood={selectedMood} 
            onMoodSelect={setSelectedMood} 
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Moon size={24} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Sleep Hours</Text>
          </View>
          <SleepSlider 
            value={sleepHours} 
            onValueChange={setSleepHours} 
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Target size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Habits</Text>
          </View>
          <HabitTracker 
            selectedHabits={selectedHabits}
            onHabitsChange={setSelectedHabits}
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Daily Reflection</Text>
          </View>
          <TextInput
            style={styles.reflectionInput}
            multiline
            numberOfLines={4}
            placeholder="What's on your mind today? How are you feeling?"
            placeholderTextColor="#9CA3AF"
            value={reflection}
            onChangeText={setReflection}
          />
          <Text style={styles.wordCount}>{reflection.length} characters</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveEntry}
          disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}>
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Entry'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  reflectionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  wordCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  saveButton: {
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});