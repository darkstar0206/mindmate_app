import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Sparkles } from 'lucide-react-native';

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  const motivationalQuotes = [
    "Every small step counts! 🌟",
    "You're doing amazing! Keep going! 💪",
    "Progress, not perfection! ✨",
    "Your mental health matters! 🧠💚",
    "One day at a time! 🌅",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <View style={styles.header}>
        <Heart size={24} color="#FFFFFF" />
        <Text style={styles.title}>Welcome back, {userName}!</Text>
      </View>
      <View style={styles.quoteContainer}>
        <Sparkles size={20} color="#FFFFFF" />
        <Text style={styles.quote}>{randomQuote}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
});