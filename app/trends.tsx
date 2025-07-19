import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const habitOptions = [
  { key: 'exercise', label: 'Exercise' },
  { key: 'meditation', label: 'Meditation' },
  { key: 'read', label: 'Read' },
  { key: 'water', label: 'Drink Water' },
  { key: 'sleep_early', label: 'Sleep Early' },
];

export default function Trends() {
  const [moodData, setMoodData] = useState<number[]>([]);
  const [moodLabels, setMoodLabels] = useState<string[]>([]);
  const [sleepData, setSleepData] = useState<number[]>([]);
  const [sleepLabels, setSleepLabels] = useState<string[]>([]);
  const [habitsPerDay, setHabitsPerDay] = useState<number[]>([]);
  const [habitsLabels, setHabitsLabels] = useState<string[]>([]);
  const [habitsSummary, setHabitsSummary] = useState<{date: string, completed: string[], total: number}[]>([]);
  const [habitsStats, setHabitsStats] = useState<{total: number, completed: number, percent: number, bestStreak: number} | null>(null);

  const loadLogEntries = async () => {
    try {
      const raw = await AsyncStorage.getItem('logEntries');
      let entries: any[] = raw ? JSON.parse(raw) : [];
      entries = entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const last7 = entries.slice(0, 7).reverse();
      setMoodData(last7.map((e: any) => e.mood + 1));
      setMoodLabels(last7.map((e: any) => {
        const d = new Date(e.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }));
      setSleepData(last7.map((e: any) => e.sleep));
      setSleepLabels(last7.map((e: any) => {
        const d = new Date(e.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }));
      setHabitsPerDay(last7.map((e: any) => Array.isArray(e.habits) ? e.habits.length : 0));
      setHabitsLabels(last7.map((e: any) => {
        const d = new Date(e.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }));
      setHabitsSummary(last7.map((e: any) => {
        const d = new Date(e.date);
        return {
          date: `${d.getDate()}/${d.getMonth() + 1}`,
          completed: Array.isArray(e.habits) ? e.habits : [],
          total: habitOptions.length,
        };
      }));
      let total = last7.length * habitOptions.length;
      let completed = last7.reduce((sum: number, e: any) => sum + (Array.isArray(e.habits) ? e.habits.length : 0), 0);
      let percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      let bestStreak = 0, currentStreak = 0;
      for (let i = 0; i < last7.length; i++) {
        if (Array.isArray(last7[i].habits) && last7[i].habits.length > 0) {
          currentStreak++;
          if (currentStreak > bestStreak) bestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      }
      setHabitsStats({ total, completed, percent, bestStreak });
    } catch (e) {
      setMoodData([]);
      setMoodLabels([]);
      setSleepData([]);
      setSleepLabels([]);
    }
  };

  useEffect(() => {
    loadLogEntries();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Trends & Graphs</Text>
        {/* Mood Trend Graph */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Mood Trend (Last 7 Entries)</Text>
          {moodData.length > 0 ? (
            <LineChart
              data={{
                labels: moodLabels,
                datasets: [
                  {
                    data: moodData,
                  },
                ],
              }}
              width={width * 0.88}
              height={220}
              yAxisSuffix=""
              yAxisInterval={1}
              fromZero
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f093fb',
                backgroundGradientTo: '#43e97b',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#43e97b',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              yLabelsOffset={8}
              segments={5}
            />
          ) : (
            <Text style={{ color: '#aaa', marginTop: 24 }}>No mood data yet. Add a log entry!</Text>
          )}
        </View>
        {/* Sleep Trend Graph */}
        <View style={[styles.chartContainer, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 }] }>
          <Text style={[styles.chartTitle, { color: '#222' }]}>Sleep Trend (Last 7 Entries)</Text>
          {sleepData.length > 0 ? (
            <LineChart
              data={{
                labels: sleepLabels,
                datasets: [
                  {
                    data: sleepData,
                  },
                ],
              }}
              width={width * 0.88}
              height={220}
              yAxisSuffix=" hrs"
              yAxisInterval={1}
              fromZero
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(67, 233, 123, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#43e97b',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                backgroundColor: '#fff',
              }}
              yLabelsOffset={8}
              segments={5}
            />
          ) : (
            <Text style={{ color: '#aaa', marginTop: 24 }}>No sleep data yet. Add a log entry!</Text>
          )}
        </View>
        {/* Habits Graph */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Habits Completion Graph</Text>
          {habitsPerDay.length > 0 ? (
            <BarChart
              data={{
                labels: habitsLabels,
                datasets: [
                  {
                    data: habitsPerDay,
                  },
                ],
              }}
              width={width * 0.88}
              height={180}
              yAxisLabel={''}
              yAxisSuffix={''}
              yAxisInterval={1}
              fromZero
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(67, 233, 123, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  stroke: '#eee',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                backgroundColor: '#fff',
              }}
              yLabelsOffset={8}
              segments={habitOptions.length}
              showBarTops={true}
              withInnerLines={true}
            />
          ) : (
            <Text style={{ color: '#aaa', marginTop: 12 }}>No habit data yet. Add a log entry!</Text>
          )}
          {habitsStats && (
            <Text style={{ color: '#667eea', fontWeight: 'bold', fontSize: 16, marginTop: 8, textAlign: 'center' }}>
              {`This week: ${habitsStats.completed} / ${habitsStats.total} habits completed (${habitsStats.percent}%)\nBest streak: ${habitsStats.bestStreak} day${habitsStats.bestStreak === 1 ? '' : 's'}`}
            </Text>
          )}
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
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 24,
    marginBottom: 18,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
    textAlign: 'center',
  },
});
