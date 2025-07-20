import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { TrendingUp, Moon, Target, BookOpen, Calendar } from 'lucide-react-native';
import { WelcomeCard } from '@/components/WelcomeCard';
import { StatCard } from '@/components/StatCard';
import { ChartCard } from '@/components/ChartCard';

const screenWidth = Dimensions.get('window').width;


export default function Dashboard() {
  const [userData, setUserData] = useState({
    currentStreak: 0,
    totalEntries: 0,
    avgMood: 0,
    avgSleep: 0,
  });

  // Simulate fetching logs and updating stats
  useEffect(() => {
    // TODO: Replace this mock with your real log fetching logic
    // Example log structure: { date, mood, sleep }
    const logs = [
      { date: '2025-07-14', mood: 4, sleep: 7 },
      { date: '2025-07-15', mood: 3, sleep: 6.5 },
      { date: '2025-07-16', mood: 5, sleep: 8 },
      { date: '2025-07-17', mood: 4, sleep: 7.5 },
      { date: '2025-07-18', mood: 5, sleep: 6 },
      { date: '2025-07-19', mood: 3, sleep: 8.5 },
      { date: '2025-07-20', mood: 4, sleep: 7 },
    ];

    const totalEntries = logs.length;
    const avgMood = logs.length > 0 ? (logs.reduce((sum, l) => sum + l.mood, 0) / logs.length) : 0;
    const avgSleep = logs.length > 0 ? (logs.reduce((sum, l) => sum + l.sleep, 0) / logs.length) : 0;

    // Calculate current streak (consecutive days with entries, ending today)
    let streak = 0;
    let day = new Date();
    for (let i = logs.length - 1; i >= 0; i--) {
      const logDate = new Date(logs[i].date);
      if (
        logDate.getFullYear() === day.getFullYear() &&
        logDate.getMonth() === day.getMonth() &&
        logDate.getDate() === day.getDate()
      ) {
        streak++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }

    setUserData({
      currentStreak: streak,
      totalEntries,
      avgMood: Number(avgMood.toFixed(1)),
      avgSleep: Number(avgSleep.toFixed(1)),
    });
  }, []);

  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [4, 3, 5, 4, 5, 3, 4],
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const sleepData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [7, 6.5, 8, 7.5, 6, 8.5, 7],
        color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#8B5CF6',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <Text style={styles.headerTitle}>MindMate</Text>
        <Text style={styles.headerSubtitle}>Your wellness journey</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <WelcomeCard userName="Alex" />
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Current Streak"
            value={typeof userData.currentStreak === 'number' && !isNaN(userData.currentStreak) ? userData.currentStreak : 0}
            unit="days"
            icon={<Target size={24} color="#8B5CF6" />}
            gradient={['#8B5CF6', '#A855F7']}
          />
          <StatCard
            title="Total Entries"
            value={typeof userData.totalEntries === 'number' && !isNaN(userData.totalEntries) ? userData.totalEntries : 0}
            unit="logs"
            icon={<BookOpen size={24} color="#EC4899" />}
            gradient={['#EC4899', '#F97316']}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Avg Mood"
            value={typeof userData.avgMood === 'number' && !isNaN(userData.avgMood) ? userData.avgMood : 0}
            unit="/5"
            icon={<TrendingUp size={24} color="#14B8A6" />}
            gradient={['#14B8A6', '#10B981']}
          />
          <StatCard
            title="Avg Sleep"
            value={typeof userData.avgSleep === 'number' && !isNaN(userData.avgSleep) ? userData.avgSleep : 0}
            unit="hrs"
            icon={<Moon size={24} color="#F59E0B" />}
            gradient={['#F59E0B', '#EAB308']}
          />
        </View>


        {/*
          If you see a React Hooks order warning, restart Metro with:
          npx expo start -c
          This clears cache and fixes stale hook order issues from hot reloads.
        */}
        <ChartCard
          title="Mood Trends"
          subtitle="Last 7 days"
          icon={<TrendingUp size={20} color="#8B5CF6" />}>
          <LineChart
            data={{
              labels: Array.isArray(moodData.labels) ? moodData.labels : [],
              datasets:
                Array.isArray(moodData.datasets) && moodData.datasets.length > 0 && moodData.datasets[0]
                  ? [
                      {
                        ...moodData.datasets[0],
                        data: Array.isArray(moodData.datasets[0].data) ? moodData.datasets[0].data : [],
                      },
                    ]
                  : [
                      {
                        data: [],
                        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                        strokeWidth: 3,
                      },
                    ],
            }}
            width={screenWidth - 80}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard
          title="Sleep Patterns"
          subtitle="Hours per night"
          icon={<Moon size={20} color="#14B8A6" />}>
          <LineChart
            data={{
              labels: Array.isArray(sleepData.labels) ? sleepData.labels : [],
              datasets:
                Array.isArray(sleepData.datasets) && sleepData.datasets.length > 0 && sleepData.datasets[0]
                  ? [
                      {
                        ...sleepData.datasets[0],
                        data: Array.isArray(sleepData.datasets[0].data) ? sleepData.datasets[0].data : [],
                      },
                    ]
                  : [
                      {
                        data: [],
                        color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
                        strokeWidth: 3,
                      },
                    ],
            }}
            width={screenWidth - 80}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
              propsForDots: {
                ...chartConfig.propsForDots,
                stroke: '#14B8A6',
              },
            }}
            bezier
            style={styles.chart}
          />
        </ChartCard>

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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});