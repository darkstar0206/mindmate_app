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
    currentStreak: 7,
    totalEntries: 23,
    avgMood: 4.2,
    avgSleep: 7.5,
  });

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
            value={userData.currentStreak}
            unit="days"
            icon={<Target size={24} color="#8B5CF6" />}
            gradient={['#8B5CF6', '#A855F7']}
          />
          <StatCard
            title="Total Entries"
            value={userData.totalEntries}
            unit="logs"
            icon={<BookOpen size={24} color="#EC4899" />}
            gradient={['#EC4899', '#F97316']}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Avg Mood"
            value={userData.avgMood}
            unit="/5"
            icon={<TrendingUp size={24} color="#14B8A6" />}
            gradient={['#14B8A6', '#10B981']}
          />
          <StatCard
            title="Avg Sleep"
            value={userData.avgSleep}
            unit="hrs"
            icon={<Moon size={24} color="#F59E0B" />}
            gradient={['#F59E0B', '#EAB308']}
          />
        </View>

        <ChartCard
          title="Mood Trends"
          subtitle="Last 7 days"
          icon={<TrendingUp size={20} color="#8B5CF6" />}>
          <LineChart
            data={moodData}
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
            data={sleepData}
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