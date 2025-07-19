import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const habitOptions = [
  { key: 'exercise', label: 'Exercise' },
  { key: 'meditation', label: 'Meditation' },
  { key: 'read', label: 'Read' },
  { key: 'water', label: 'Drink Water' },
  { key: 'sleep_early', label: 'Sleep Early' },
];

function WellnessReportScreen({ darkMode }: { darkMode: boolean }) {
  const [wellnessReport, setWellnessReport] = useState<string | null>(null);
  const [undoWellnessReport, setUndoWellnessReport] = useState<string | null>(null);
  const [weeklyPercent, setWeeklyPercent] = useState<number>(0);
  const motivationalQuotes = [
    "Every day is a fresh start. You got this! 💪",
    "Small steps every day lead to big changes.",
    "Celebrate your progress, not just perfection.",
    "You are stronger than you think.",
    "Take a deep breath and smile. 😊",
  ];
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      const raw = await AsyncStorage.getItem('logEntries');
      let entries = raw ? JSON.parse(raw) : [];
      type Entry = { date: string; mood: number; sleep: number; reflection: string; habits: string[] };
      const typedEntries: Entry[] = entries;
      typedEntries.sort((a: Entry, b: Entry) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const now1 = new Date();
      // Weekly
      const weekAgo = new Date(now1);
      weekAgo.setDate(now1.getDate() - 6);
      const weeklyEntries = typedEntries.filter(e => new Date(e.date) >= weekAgo);
      const weeklyMood = weeklyEntries.map(e => e.mood).filter((m: number) => typeof m === 'number');
      const weeklyAvgMood = weeklyMood.length ? (weeklyMood.reduce((a, b) => a + b, 0) / weeklyMood.length) : 0;
      const weeklyHabits = weeklyEntries.reduce((acc, e) => acc + (e.habits?.length || 0), 0);
      const weeklyHabitPercent = weeklyEntries.length ? Math.round((weeklyHabits / (weeklyEntries.length * habitOptions.length)) * 100) : 0;
      setWeeklyPercent(weeklyHabitPercent);
      // Monthly
      const monthAgo1 = new Date(now1);
      monthAgo1.setDate(now1.getDate() - 29);
      const monthlyEntries = typedEntries.filter(e => new Date(e.date) >= monthAgo1);
      const monthlyMood = monthlyEntries.map(e => e.mood).filter((m: number) => typeof m === 'number');
      const monthlyAvgMood = monthlyMood.length ? (monthlyMood.reduce((a, b) => a + b, 0) / monthlyMood.length) : 0;
      // --- Personalized Wellness Report ---
      let moodChange = 0;
      if (weeklyMood.length > 0 && monthlyMood.length > 0) {
        const prevWeekMood = monthlyMood.slice(0, weeklyMood.length).reduce((a, b) => a + b, 0) / (weeklyMood.length || 1);
        moodChange = weeklyAvgMood - prevWeekMood;
      }
      let topHabit = '';
      if (weeklyEntries.length > 0) {
        const habitCounts: { [key: string]: number } = {};
        habitOptions.forEach(h => { habitCounts[h.key] = 0; });
        weeklyEntries.forEach(e => {
          (e.habits || []).forEach(h => { habitCounts[h] = (habitCounts[h] || 0) + 1; });
        });
        const sortedHabits = Object.entries(habitCounts).sort((a, b) => b[1] - a[1]);
        if (sortedHabits[0][1] > 0) {
          topHabit = habitOptions.find(h => h.key === sortedHabits[0][0])?.label || sortedHabits[0][0];
        }
      }
      let report = '';
      if (weeklyEntries.length > 0) {
        report += `This week, your average mood was ${weeklyAvgMood.toFixed(2)} / 5`;
        if (moodChange !== 0) {
          report += ` (${moodChange > 0 ? 'improved' : 'declined'} by ${Math.abs(moodChange).toFixed(2)} from last week)`;
        }
        report += `.\n`;
        if (topHabit) {
          report += `${topHabit} was your most consistent habit. Keep it up!\n`;
        }
        if (weeklyHabitPercent >= 80) {
          report += `Amazing habit consistency (${weeklyHabitPercent}%)!\n`;
        } else if (weeklyHabitPercent < 40) {
          report += `Try to complete more habits for a better week.\n`;
        }
        report += `Tip: Reflect on what made this week different and set a small goal for next week.`;
      } else {
        report = 'Log some entries to see your personalized Wellness Report!';
      }
      setUndoWellnessReport(wellnessReport);
      setWellnessReport(report);
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    };
    loadReport();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.container, darkMode && { backgroundColor: 'transparent' }]}> 
        {/* Decorative Sparkles Icon */}
        <View style={{ alignItems: 'center', marginBottom: 0, marginTop: 32 }}>
          <LinearGradient colors={darkMode ? ["#43e97b", "#232526"] : ["#f8ffae", "#43e97b"]} style={{ borderRadius: 40, padding: 16 }}>
            {/* Use a simple emoji for cross-platform compatibility */}
            <Text style={{ fontSize: 40, color: '#43e97b' }}>✨</Text>
          </LinearGradient>
        </View>
        {/* Glassmorphism Card */}
        <LinearGradient
          colors={darkMode ? ["#232526", "#43e97b"] : ["#f8ffae", "#43e97b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.reportCard, {
            backdropFilter: 'blur(12px)',
            borderWidth: 2,
            borderColor: darkMode ? '#43e97b' : '#f8ffae',
            marginTop: 16,
          }]}
        >
          <Text style={{ color: darkMode ? '#2563eb' : '#2563eb', fontWeight: 'bold', fontSize: 22, marginBottom: 12, textAlign: 'center', letterSpacing: 0.5 }}>Wellness Report</Text>
          <Text style={{ color: darkMode ? '#43e97b' : '#2563eb', fontSize: 17, fontWeight: '600', marginBottom: 10, textAlign: 'center' }}>{wellnessReport}</Text>
          {/* Progress Bar */}
          <View style={{ width: '80%', marginTop: 10, marginBottom: 8 }}>
            <Text style={{ color: darkMode ? '#f8ffae' : '#2563eb', fontWeight: 'bold', fontSize: 15, marginBottom: 2, textAlign: 'center' }}>Weekly Habit Completion</Text>
            <View style={{ height: 12, backgroundColor: darkMode ? '#232526' : '#e0e0e0', borderRadius: 8, overflow: 'hidden', marginBottom: 2 }}>
              <View style={{ width: `${weeklyPercent}%`, height: '100%', backgroundColor: '#43e97b', borderRadius: 8 }} />
            </View>
            <Text style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>{weeklyPercent}% completed</Text>
          </View>
          <TouchableOpacity
            style={{ marginTop: 8, backgroundColor: darkMode ? '#414345' : '#43e97b', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 18 }}
            onPress={() => {
              setWellnessReport(undoWellnessReport);
              setUndoWellnessReport(null);
            }}
            disabled={!undoWellnessReport}
          >
            <Text style={{ color: darkMode ? '#f8ffae' : '#fff', fontWeight: 'bold', fontSize: 14 }}>Undo</Text>
          </TouchableOpacity>
        </LinearGradient>
        {/* Motivational Quote */}
        <View style={{ marginTop: 32, alignItems: 'center', width: '90%' }}>
          <LinearGradient colors={darkMode ? ["#232526", "#43e97b"] : ["#f8ffae", "#43e97b"]} style={{ borderRadius: 18, padding: 14, width: '100%' }}>
            <Text style={{ color: darkMode ? '#f8ffae' : '#2563eb', fontWeight: 'bold', fontSize: 16, textAlign: 'center', letterSpacing: 0.2 }}>Motivation</Text>
            <Text style={{ color: darkMode ? '#43e97b' : '#2563eb', fontSize: 15, textAlign: 'center', marginTop: 4 }}>{quote}</Text>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  reportCard: {
    borderRadius: 22,
    padding: 24,
    marginBottom: 24,
    borderWidth: 0,
    alignItems: 'center',
    shadowColor: '#43e97b',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default WellnessReportScreen;
