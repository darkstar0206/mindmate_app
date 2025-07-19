import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Target, CheckCircle, Sun, Moon } from 'lucide-react-native';

const challengeTemplates = [
  {
    key: 'meditation',
    text: 'Try meditation 3 days this week!',
    icon: <Sun color="#8B5CF6" size={28} />,
  },
  {
    key: 'exercise',
    text: 'Complete 2 exercise sessions this week!',
    icon: <Target color="#43e97b" size={28} />,
  },
  {
    key: 'water',
    text: 'Drink 8 glasses of water every day for 5 days!',
    icon: <CheckCircle color="#38f9d7" size={28} />,
  },
  {
    key: 'sleep',
    text: 'Sleep at least 7 hours for 4 nights!',
    icon: <Moon color="#fdcb6e" size={28} />,
  },
  {
    key: 'reflection',
    text: 'Write a daily reflection for 5 days!',
    icon: <Sparkles color="#EC4899" size={28} />,
  },
];

type Challenge = { key: string; text: string; icon: React.ReactNode };
export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // Pick 2-3 random challenges for the week
    const shuffled = challengeTemplates.sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, 3));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#fbc2eb", "#a6c1ee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Wellness Challenges</Text>
        <Text style={styles.subtitle}>Boost your wellness with these fun goals!</Text>
      </LinearGradient>
      <View style={styles.challengesList}>
        {challenges.map((c, idx) => (
          <LinearGradient
            key={c.key}
            colors={["#f8ffae", "#43e97b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeCard}
          >
            <View style={styles.icon}>{c.icon}</View>
            <Text style={styles.challengeText}>{c.text}</Text>
          </LinearGradient>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5CF6',
    opacity: 0.8,
    textAlign: 'center',
  },
  challengesList: {
    width: '92%',
    alignItems: 'center',
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#43e97b',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
  },
  challengeText: {
    fontSize: 17,
    color: '#2563eb',
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
});
