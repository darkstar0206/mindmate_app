import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../config/firebase';
// @ts-ignore
import Sentiment from 'sentiment';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, Switch, TextInput, Alert, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, PlusCircle, Settings, BarChart3, Sparkles, Moon, Sun, Brain, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
const { height, width } = Dimensions.get('window');
function Dashboard() {
  const router = useRouter();
  // Auth state
  const [user, setUser] = useState<any>(null); // Accepts Firebase User or null
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.replace('/auth/login');
      }
    });
    return () => unsubscribe();
  }, []);
  // Weekly/Monthly summary state
  const [weeklySummary, setWeeklySummary] = useState<{avgMood: number, habitPercent: number} | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<{avgMood: number, habitPercent: number} | null>(null);
  const [streak, setStreak] = useState<number>(0);
  // Gamification state
  const [level, setLevel] = useState<number>(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<number>(0);
  const [challengeBadge, setChallengeBadge] = useState<string | null>(null);
  // AI-Based Mood Coach: analyze mood/sleep/habits/reflections for tips
  const [aiCoachTip, setAiCoachTip] = useState<string | null>(null);
  const [motivationalPrompt, setMotivationalPrompt] = useState<string | null>(null);
  const sentiment = new Sentiment();

  // Animation state
  const progressAnim = useState(new Animated.Value(0))[0];
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [lottieType, setLottieType] = useState<'badge'|'streak'|null>(null);

  // Analyze log data for patterns, sentiment, and set a tip and motivational prompt
  const analyzeForTip = (entries: any[]) => {
    if (!entries || entries.length === 0) {
      setAiCoachTip(null);
      setMotivationalPrompt(null);
      return;
    }
    // Sentiment analysis on last reflection
    const lastReflection = entries[0]?.reflection || '';
    const sentimentScore = lastReflection ? sentiment.analyze(lastReflection).score : 0;
    // Habit streaks
    const streaks: { [key: string]: number } = {};
    habitOptions.forEach(h => { streaks[h.key] = 0; });
    let prevDate: Date | null = null;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const entryDate = new Date(entry.date);
      habitOptions.forEach(h => {
        if (entry.habits && entry.habits.includes(h.key)) {
          if (!prevDate || (prevDate && (prevDate.getDate() - entryDate.getDate() === 1))) {
            streaks[h.key]++;
          }
        }
      });
      prevDate = entryDate;
    }
    // Find best streak
    let bestHabit = '', bestStreak = 0;
    Object.entries(streaks).forEach(([key, streak]) => {
      if (streak > bestStreak) {
        bestStreak = streak;
        bestHabit = key;
      }
    });
    // Mood trend
    const moods = entries.map(e => e.mood).filter((m: number) => typeof m === 'number');
    const avgMood = moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
    // Compose advice
    if (sentimentScore < -2) {
      setAiCoachTip('Your recent reflection seems a bit down. Remember, tough days are part of the journey. Try some self-care or talk to a friend!');
    } else if (sentimentScore > 2) {
      setAiCoachTip('Your reflection is very positive! Keep spreading those good vibes.');
    } else if (bestStreak >= 3 && bestHabit) {
      const habitLabel = habitOptions.find(h => h.key === bestHabit)?.label || bestHabit;
      setAiCoachTip(`You're ${bestStreak} days into ${habitLabel}! Keep it going 🎯`);
    } else if (avgMood < 2.5) {
      setAiCoachTip('Your mood has been low lately. Try a new activity or reach out to someone you trust.');
    } else {
      setAiCoachTip('Keep up the great work! Consistency is key to wellness.');
    }
    // Motivational prompt
    const prompts = [
      'Every day is a fresh start. You got this! 💪',
      'Small steps every day lead to big changes.',
      'Celebrate your progress, not just perfection.',
      'You are stronger than you think.',
      'Take a deep breath and smile. 😊',
    ];
    setMotivationalPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };
  // Stub for missing loadLogEntries function
  // Load log entries and update habits summary/stats
  const loadLogEntries = async () => {
    try {
      const raw = await AsyncStorage.getItem('logEntries');
      let entries = raw ? JSON.parse(raw) : [];
      // Sort by date descending
      type Entry = { date: string; mood: number; sleep: number; reflection: string; habits: string[] };
      const typedEntries: Entry[] = entries;
      typedEntries.sort((a: Entry, b: Entry) => new Date(b.date).getTime() - new Date(a.date).getTime());
      // Last 7 entries for summary
      const last7: Entry[] = typedEntries.slice(0, 7);
      const summary = last7.map((entry: Entry) => ({
        date: new Date(entry.date).toLocaleDateString(),
        completed: entry.habits || [],
        total: habitOptions.length
      }));
      setHabitsSummary(summary);
      // Stats: total, completed, percent, best streak
      let completed = 0, total = 0, bestStreak = 0, streakCount = 0;
      for (let i = 0; i < last7.length; i++) {
        const c = (last7[i].habits || []).length;
        completed += c;
        total += habitOptions.length;
        if (c === habitOptions.length) {
          streakCount++;
          if (streakCount > bestStreak) bestStreak = streakCount;
        } else {
          streakCount = 0;
        }
      }
      setHabitsStats({
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
        bestStreak
      });
      // --- Weekly/Monthly Mood & Habit Summary ---
      const now1 = new Date();
      // Weekly
      const weekAgo = new Date(now1);
      weekAgo.setDate(now1.getDate() - 6);
      const weeklyEntries = typedEntries.filter(e => new Date(e.date) >= weekAgo);
      const weeklyMood = weeklyEntries.map(e => e.mood).filter((m: number) => typeof m === 'number');
      const weeklyAvgMood = weeklyMood.length ? (weeklyMood.reduce((a, b) => a + b, 0) / weeklyMood.length) : 0;
      const weeklyHabits = weeklyEntries.reduce((acc, e) => acc + (e.habits?.length || 0), 0);
      const weeklyHabitPercent = weeklyEntries.length ? Math.round((weeklyHabits / (weeklyEntries.length * habitOptions.length)) * 100) : 0;
      setWeeklySummary({ avgMood: weeklyAvgMood, habitPercent: weeklyHabitPercent });
      // Monthly
      const monthAgo1 = new Date(now1);
      monthAgo1.setDate(now1.getDate() - 29);
      const monthlyEntries = typedEntries.filter(e => new Date(e.date) >= monthAgo1);
      const monthlyMood = monthlyEntries.map(e => e.mood).filter((m: number) => typeof m === 'number');
      const monthlyAvgMood = monthlyMood.length ? (monthlyMood.reduce((a, b) => a + b, 0) / monthlyMood.length) : 0;
      const monthlyHabits = monthlyEntries.reduce((acc, e) => acc + (e.habits?.length || 0), 0);
      const monthlyHabitPercent = monthlyEntries.length ? Math.round((monthlyHabits / (monthlyEntries.length * habitOptions.length)) * 100) : 0;
      setMonthlySummary({ avgMood: monthlyAvgMood, habitPercent: monthlyHabitPercent });
      // --- Personalized Wellness Report ---
      // Calculate improvement in mood
      let moodChange = 0;
      if (weeklyMood.length > 0 && monthlyMood.length > 0) {
        const prevWeekMood = monthlyMood.slice(0, weeklyMood.length).reduce((a, b) => a + b, 0) / (weeklyMood.length || 1);
        moodChange = weeklyAvgMood - prevWeekMood;
      }
      // Find most completed habit this week
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
      // Compose report
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
      // --- Streak Badge ---
      // Count consecutive days with any log entry (not just habits)
      let streakVal = 0;
      let prevDay = null;
      for (let i = 0; i < typedEntries.length; i++) {
        const entryDate = new Date(typedEntries[i].date);
        if (i === 0) {
          streakVal = 1;
        } else {
          const prevDate = new Date(typedEntries[i - 1].date);
          const diff = Math.floor((prevDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streakVal++;
          } else {
            break;
          }
        }
      }
      setStreak(streakVal);

      // --- Gamification: Level, Badges, Progress ---
      // Level: 1 per 10 logs
      setLevel(Math.max(1, Math.floor(typedEntries.length / 10) + 1));
      // Badges: streaks, consistency, challenge completion
      const newBadges: string[] = [];
      if (streakVal >= 7) {
        newBadges.push('7-Day Streak');
        setShowConfetti(true);
        setShowLottie(true);
        setLottieType('streak');
        setTimeout(() => setShowConfetti(false), 2500);
        setTimeout(() => setShowLottie(false), 2500);
      }
      if (streakVal >= 30) {
        newBadges.push('30-Day Streak');
        setShowConfetti(true);
        setShowLottie(true);
        setLottieType('streak');
        setTimeout(() => setShowConfetti(false), 2500);
        setTimeout(() => setShowLottie(false), 2500);
      }
      if (weeklySummary && weeklySummary.habitPercent >= 90) newBadges.push('Weekly Consistency');
      if (monthlySummary && monthlySummary.habitPercent >= 90) newBadges.push('Monthly Consistency');
      // Challenge badge (stub: if any challenge completed, award)
      // You can expand this logic if you track challenge completion
      if (typedEntries.some(e => e.habits && e.habits.includes('meditation'))) {
        setChallengeBadge('Meditation Master');
        newBadges.push('Meditation Master');
      } else {
        setChallengeBadge(null);
      }
      setBadges(newBadges);
      // Monthly progress bar: percent of days with any log in last 30 days
      const now2 = new Date();
      const monthAgo2 = new Date(now2);
      monthAgo2.setDate(now2.getDate() - 29);
      const daysLogged = new Set(typedEntries.filter(e => new Date(e.date) >= monthAgo2).map(e => new Date(e.date).toDateString()));
      setMonthlyProgress(Math.round((daysLogged.size / 30) * 100));

      // AI Coach: analyze all entries for tips
      analyzeForTip(typedEntries);
    } catch (e) {
      setHabitsSummary([]);
      setHabitsStats(null);
    }
  };
  // Load on mount
  useEffect(() => {
    loadLogEntries();
  }, []);
  // Stub for missing handleClearCache function
  const handleClearCache = () => {};
  // Modal and log entry state
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [reflection, setReflection] = useState<string>('');
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // Load dark mode from AsyncStorage
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const value = await AsyncStorage.getItem('darkMode');
        if (value !== null) setDarkMode(JSON.parse(value));
      } catch (e) {}
    };
    loadDarkMode();
  }, []);
  const [notifications, setNotifications] = useState(false);
  // Navigation state for tab switching
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trends' | 'challenges' | 'wellnessReport'>('dashboard');
  // Habits graph and summary state
  const [habitsPerDay, setHabitsPerDay] = useState<number[]>([]);
  const [habitsLabels, setHabitsLabels] = useState<string[]>([]);
  const [habitsSummary, setHabitsSummary] = useState<{date: string, completed: string[], total: number}[]>([]);
  const [habitsStats, setHabitsStats] = useState<{total: number, completed: number, percent: number, bestStreak: number} | null>(null);
  // Habits tracking state
  const habitOptions = [
    { key: 'exercise', label: 'Exercise' },
    { key: 'meditation', label: 'Meditation' },
    { key: 'read', label: 'Read' },
    { key: 'water', label: 'Drink Water' },
    { key: 'sleep_early', label: 'Sleep Early' },
  ];
  // Mood options for modal
  const moodOptions: { emoji: string; label: string }[] = [
    { emoji: '😄', label: 'Great' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '🙁', label: 'Bad' },
    { emoji: '😢', label: 'Awful' },
  ];
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  // Load log entries from AsyncStorage and update graph data
  // (removed duplicate/stray return and moodOptions)

  // Save log entry handler
  const handleSaveLogEntry = async () => {
    if (selectedMood === null) {
      Alert.alert('Please select your mood!');
      return;
    }
    try {
      const entry = {
        date: new Date().toISOString(),
        mood: selectedMood,
        sleep: sleepHours,
        reflection,
        habits: selectedHabits,
      };
      const raw = await AsyncStorage.getItem('logEntries');
      let entries = raw ? JSON.parse(raw) : [];
      entries.push(entry);
      await AsyncStorage.setItem('logEntries', JSON.stringify(entries));
      setLogModalVisible(false);
      setSelectedMood(null);
      setSleepHours(7);
      setReflection('');
      setSelectedHabits([]);
      loadLogEntries(); // reload data after saving
    } catch (e) {
      Alert.alert('Error saving log entry');
    }
  };

  useEffect(() => {
    // Animate progress bar on mount
    Animated.timing(progressAnim, {
      toValue: monthlyProgress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [monthlyProgress]);

  if (!user) {
    // Optionally render a loading spinner here
    return null;
  }
  return (
    <SafeAreaView style={[styles.safeArea, { flex: 1 }]}> 
    {/* Full-screen vibrant gradient background */}
    <LinearGradient
      colors={darkMode ? ["#232526", "#414345"] : ["#667eea", "#764ba2", "#f093fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
    {/* Confetti and Lottie celebratory moments */}
    {showConfetti && (
      <LottieView
        source={require('../assets/lottie/confetti.json')}
        autoPlay
        loop={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, zIndex: 100 }}
      />
    )}
    {showLottie && lottieType === 'badge' && (
      <LottieView
        source={require('../assets/lottie/badge.json')}
        autoPlay
        loop={false}
        style={{ position: 'absolute', top: 80, left: 0, right: 0, height: 120, zIndex: 100 }}
      />
    )}
    {showLottie && lottieType === 'streak' && (
      <LottieView
        source={require('../assets/lottie/streak.json')}
        autoPlay
        loop={false}
        style={{ position: 'absolute', top: 80, left: 0, right: 0, height: 120, zIndex: 100 }}
      />
    )}
    {activeTab === 'dashboard' ? (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
      {/* --- Mood & Habit Insights Card --- */}
      {(weeklySummary || monthlySummary) && (
        <LinearGradient
          colors={darkMode ? ["#232526", "#414345"] : ["#f8ffae", "#43e97b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 22,
            padding: 18,
            marginBottom: 14,
            borderWidth: 0,
            alignItems: 'center',
            shadowColor: darkMode ? '#000' : '#43e97b',
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: darkMode ? '#f8ffae' : '#2563eb', fontWeight: 'bold', fontSize: 17, marginBottom: 6, letterSpacing: 0.2 }}>Mood & Habit Insights</Text>
          {weeklySummary && (
            <Text style={{ color: darkMode ? '#43e97b' : '#0ea5e9', fontSize: 15, fontWeight: '600', marginBottom: 2 }}>
              Weekly Avg Mood: {weeklySummary.avgMood.toFixed(2)} / 5 | Habits: {weeklySummary.habitPercent}%
            </Text>
          )}
          {monthlySummary && (
            <Text style={{ color: darkMode ? '#43e97b' : '#0ea5e9', fontSize: 15, fontWeight: '600' }}>
              Monthly Avg Mood: {monthlySummary.avgMood.toFixed(2)} / 5 | Habits: {monthlySummary.habitPercent}%
            </Text>
          )}
        </LinearGradient>
      )}
      {/* --- Gamification: Streak Badge, Level, Badges, Progress --- */}
      {streak > 1 && (
        <Animated.View style={{
          alignSelf: 'center',
          backgroundColor: darkMode ? '#232526' : '#fff',
          borderRadius: 18,
          paddingVertical: 6,
          paddingHorizontal: 18,
          marginBottom: 10,
          borderWidth: 2,
          borderColor: '#43e97b',
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#43e97b',
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 2,
          transform: [{ scale: showLottie && lottieType === 'streak' ? 1.15 : 1 }],
        }}>
          <Sparkles color="#43e97b" size={22} style={{ marginRight: 8 }} />
          <Text style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 16 }}>🔥 {streak} day streak!</Text>
        </Animated.View>
      )}
      {/* Level Display */}
      <View style={{ alignSelf: 'center', backgroundColor: darkMode ? '#232526' : '#e0ffe9', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 18, marginBottom: 10, borderWidth: 1, borderColor: '#43e97b', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: darkMode ? '#f8ffae' : '#2563eb', fontWeight: 'bold', fontSize: 15 }}>Level {level}</Text>
      </View>
      {/* Badges Display */}
      {badges.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
          {badges.map((badge, idx) => (
            <Animated.View key={idx} style={{
              backgroundColor: darkMode ? '#414345' : '#f8ffae',
              borderRadius: 14,
              paddingVertical: 4,
              paddingHorizontal: 12,
              margin: 4,
              borderWidth: 1,
              borderColor: '#43e97b',
              transform: [{ scale: showLottie && lottieType === 'badge' ? 1.15 : 1 }],
              shadowColor: showLottie && lottieType === 'badge' ? '#43e97b' : 'transparent',
              shadowOpacity: showLottie && lottieType === 'badge' ? 0.5 : 0,
              shadowRadius: showLottie && lottieType === 'badge' ? 10 : 0,
            }}>
              <Text style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 13 }}>{badge}</Text>
            </Animated.View>
          ))}
        </View>
      )}
      {/* Challenge Badge */}
      {challengeBadge && (
        <View style={{ alignSelf: 'center', backgroundColor: darkMode ? '#232526' : '#c2e9fb', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 10, borderWidth: 1, borderColor: '#43e97b' }}>
          <Text style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 13 }}>🏅 {challengeBadge}</Text>
        </View>
      )}
      {/* Monthly Progress Bar */}
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 16 }}>
        <Text style={{ color: darkMode ? '#f8ffae' : '#2563eb', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>Monthly Goal Progress</Text>
        <View style={{ height: 14, backgroundColor: darkMode ? '#232526' : '#e0e0e0', borderRadius: 8, overflow: 'hidden', marginBottom: 2 }}>
          <Animated.View style={{ width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), height: '100%', backgroundColor: '#43e97b', borderRadius: 8 }} />
        </View>
        <Text style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 13 }}>{monthlyProgress}% of days logged this month</Text>
      </View>
      {motivationalPrompt && (
        <LinearGradient
          colors={darkMode ? ["#232526", "#414345"] : ["#fff1f2", "#fbc2eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 22,
            padding: 18,
            marginBottom: 14,
            borderWidth: 0,
            alignItems: 'center',
            shadowColor: darkMode ? '#000' : '#EC4899',
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <Sparkles color={darkMode ? '#f8ffae' : '#EC4899'} size={32} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: darkMode ? '#f8ffae' : '#EC4899', fontWeight: 'bold', fontSize: 17, marginBottom: 2, letterSpacing: 0.2 }}>Motivational Prompt</Text>
            <Text style={{ color: darkMode ? '#43e97b' : '#7c3aed', fontSize: 16, textAlign: 'left', fontWeight: '600' }}>{motivationalPrompt}</Text>
          </View>
        </LinearGradient>
      )}
      {/* AI-Based Mood Coach - Improved Card */}
      {aiCoachTip && (
        <LinearGradient
          colors={darkMode ? ["#232526", "#414345"] : ["#e0ffe9", "#c2e9fb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 22,
            padding: 18,
            marginBottom: 18,
            borderWidth: 0,
            alignItems: 'center',
            shadowColor: darkMode ? '#000' : '#43e97b',
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <Brain color={darkMode ? '#43e97b' : '#43e97b'} size={32} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: darkMode ? '#f8ffae' : '#43e97b', fontWeight: 'bold', fontSize: 17, marginBottom: 2, letterSpacing: 0.2 }}>AI-Based Mood Coach</Text>
            <Text style={{ color: darkMode ? '#43e97b' : '#2563eb', fontSize: 16, textAlign: 'left', fontWeight: '600' }}>{aiCoachTip}</Text>
          </View>
        </LinearGradient>
      )}
            {/* Enhanced Header with Multiple Gradients and floating shapes */}
            <LinearGradient
              colors={darkMode ? ["#232526", "#414345"] : ["#667eea", "#764ba2", "#f093fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientHeader, darkMode && { borderBottomColor: '#232526' }]}
            >
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={["#ff9a9e", "#fecfef"]}
                    style={styles.logoGradient}
                  >
                    <Brain color="#fff" size={28} />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>MindMate</Text>
                <Text style={styles.subtitle}>✨ Your wellness journey ✨</Text>
              </View>
              {/* Floating decorative elements */}
              <View style={[styles.floatingElement, styles.element1]}>
                <LinearGradient colors={["#ffeaa7", "#fab1a0"]} style={styles.smallCircle} />
              </View>
              <View style={[styles.floatingElement, styles.element2]}>
                <LinearGradient colors={["#a29bfe", "#fd79a8"]} style={styles.smallCircle} />
              </View>
              <View style={[styles.floatingElement, styles.element3]}>
                <LinearGradient colors={["#00cec9", "#55a3ff"]} style={styles.smallCircle} />
              </View>
            </LinearGradient>

            {/* Enhanced Welcome Card with Glass Effect */}
            <LinearGradient
              colors={darkMode ? ["#232526", "#414345"] : ["#ff9a9e", "#fecfef", "#ffeaa7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeCard}
            >
              <View style={[styles.glassOverlay, darkMode && { backgroundColor: 'rgba(36,36,40,0.7)' }]}> 
                <View style={styles.welcomeIconContainer}>
                  <LinearGradient
                    colors={["#ff6b6b", "#ee5a24"]}
                    style={styles.welcomeIconGradient}
                  >
                    <Heart color="#fff" size={24} />
                  </LinearGradient>
                  <Sparkles color="#fff" size={20} style={styles.sparkleIcon} />
                </View>
                <Text style={[styles.welcomeTitle, darkMode && { color: '#f8ffae' }]}>Welcome back, {user?.displayName || 'User'}!</Text>
                <Text style={[styles.welcomeSubtitle, darkMode && { color: '#e0e0e0' }]}>You're absolutely crushing it! 🚀</Text>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={["#00b894", "#00cec9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressFill}
                  />
                </View>
                <Text style={[styles.progressText, darkMode && { color: '#f8ffae' }]}>Weekly Progress: 85%</Text>
              </View>
            </LinearGradient>

            {/* Floating Action Bar for quick settings and actions - moved to top and made more visible */}
            <View style={styles.actionBarWrapper}>
              <LinearGradient
                colors={darkMode ? ["#232526", "#414345"] : ["#667eea", "#43e97b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.actionBar, darkMode && { borderColor: '#232526' }]}
              >
                <TouchableOpacity style={styles.actionBarItem} onPress={() => setSettingsVisible(true)}>
                  <Settings color="#fff" size={28} />
                  <Text style={styles.actionBarLabel}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBarItem} onPress={() => setDarkMode(d => !d)}>
                  <Sun color={darkMode ? '#f8ffae' : '#fff'} size={28} />
                  <Text style={[styles.actionBarLabel, darkMode && { color: '#f8ffae' }]}>Theme</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBarItem}>
                  <Sparkles color="#fff" size={28} />
                  <Text style={styles.actionBarLabel}>Boost</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Habits Summary Only (no graphs) */}
            <View style={[styles.chartContainer, darkMode && { backgroundColor: 'rgba(36,36,40,0.85)' }]}> 
              <Text style={[styles.chartTitle, darkMode && { color: '#f8ffae' }]}>Habits Summary (Last 7 Entries)</Text>
              {habitsStats && (
                <Text style={{ color: darkMode ? '#43e97b' : '#667eea', fontWeight: 'bold', fontSize: 16, marginBottom: 6, textAlign: 'center' }}>
                  {`This week: ${habitsStats.completed} / ${habitsStats.total} habits completed (${habitsStats.percent}%)\nBest streak: ${habitsStats.bestStreak} day${habitsStats.bestStreak === 1 ? '' : 's'}`}
                </Text>
              )}
              {habitsSummary.length > 0 ? (
                <View style={{width: '100%', marginBottom: 12}}>
                  {habitsSummary.map((h, idx) => (
                    <Text key={idx} style={{color: darkMode ? '#f8ffae' : '#43e97b', fontWeight: '600', fontSize: 15, marginBottom: 2}}>
                      {h.date}: {h.completed.length} / {h.total} habits completed
                      {h.completed.length > 0 && (
                        <Text style={{color: darkMode ? '#43e97b' : '#667eea', fontWeight: '400', fontSize: 14}}>  [
                          {h.completed.map((key, i) => {
                            const habit = habitOptions.find(opt => opt.key === key);
                            return habit ? habit.label + (i < h.completed.length - 1 ? ', ' : '') : '';
                          })}
                        ]</Text>
                      )}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={{ color: darkMode ? '#aaa' : '#aaa', marginTop: 12 }}>No habit data yet. Add a log entry!</Text>
              )}
            </View>

            {/* Enhanced Stats Grid with Creative Cards */}
            <View style={styles.statsGrid}>
              {/* Total Entries Card */}
              <LinearGradient
                colors={darkMode ? ["#232526", "#414345"] : ["#43e97b", "#38f9d7", "#f093fb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>📋</Text>
                </View>
                <Text style={[styles.statValue, darkMode && { color: '#f8ffae' }]}>23</Text>
                <Text style={[styles.statUnit, darkMode && { color: '#f8ffae' }]}>logs</Text>
                <Text style={[styles.statLabel, darkMode && { color: '#f8ffae' }]}>Total Entries</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>

              {/* Mood Card with Emoji Theme */}
              <LinearGradient
                colors={darkMode ? ["#232526", "#414345"] : ["#00b894", "#00cec9", "#55efc4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>😊</Text>
                </View>
                <Text style={[styles.statValue, darkMode && { color: '#f8ffae' }]}>4.2</Text>
                <Text style={[styles.statUnit, darkMode && { color: '#f8ffae' }]}>/5</Text>
                <Text style={[styles.statLabel, darkMode && { color: '#f8ffae' }]}>Avg Mood</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>

              {/* Sleep Card with Moon Theme */}
              <LinearGradient
                colors={darkMode ? ["#232526", "#414345"] : ["#fdcb6e", "#e17055", "#d63031"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Moon color="#fff" size={24} />
                </View>
                <Text style={[styles.statValue, darkMode && { color: '#f8ffae' }]}>7.5</Text>
                <Text style={[styles.statUnit, darkMode && { color: '#f8ffae' }]}>hrs</Text>
                <Text style={[styles.statLabel, darkMode && { color: '#f8ffae' }]}>Avg Sleep</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>
            </View>

            {/* Vibrant Footer Gradient filling the bottom */}
            <LinearGradient
              colors={darkMode ? ["#232526", "#414345"] : ["#43e97b", "#38f9d7", "#f093fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.footer}
            >
              <Text style={[styles.footerText, darkMode && { color: '#f8ffae' }]}>Keep shining, {user?.displayName || 'User'}! 🌈</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      ) : activeTab === 'trends' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Trends screen is rendered by importing Trends component */}
            {React.createElement(require('./trends').default)}
          </View>
        </ScrollView>
      ) : activeTab === 'challenges' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Challenges screen is rendered by importing Challenges component */}
            {React.createElement(require('./challenges').default)}
          </View>
        </ScrollView>
      ) : activeTab === 'wellnessReport' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Wellness Report screen */}
            {React.createElement(require('./wellnessReport').default, { darkMode })}
          </View>
        </ScrollView>
      ) : null}
      

      {/* Log Entry Modal - always rendered at root */}
      <Modal
        visible={logModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLogModalVisible(false)}
      >
        <View style={[styles.modalOverlay, darkMode && { backgroundColor: 'rgba(24,24,27,0.7)' }]}> 
          <View style={[styles.modalContent, darkMode && { backgroundColor: '#232526' }]}> 
            <Text style={[styles.modalTitle, darkMode && { color: '#f8ffae' }]}>Log Entry</Text>
            <Text style={{ marginBottom: 12, color: darkMode ? '#43e97b' : '#667eea', fontWeight: '600', fontSize: 16 }}>
              How are you feeling today?
            </Text>
            <View style={styles.moodRow}>
              {moodOptions.map((mood, idx) => (
                <TouchableOpacity
                  key={mood.emoji}
                  style={[
                    styles.moodOption,
                    selectedMood === idx && styles.moodOptionSelected,
                    darkMode && { backgroundColor: 'rgba(67,233,123,0.07)', borderColor: selectedMood === idx ? '#43e97b' : 'transparent' }
                  ]}
                  onPress={() => setSelectedMood(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.moodEmoji, darkMode && { color: '#43e97b' }]}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, darkMode && { color: '#43e97b' }]}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginBottom: 6, color: darkMode ? '#43e97b' : '#667eea', fontWeight: '600', fontSize: 16 }}>
              How many hours did you sleep?
            </Text>
            <View style={styles.sleepRow}>
              <Slider
                style={{ flex: 1, height: 36 }}
                minimumValue={0}
                maximumValue={12}
                step={0.5}
                value={sleepHours}
                onValueChange={setSleepHours}
                minimumTrackTintColor={darkMode ? '#43e97b' : '#667eea'}
                maximumTrackTintColor={darkMode ? '#232526' : '#ccc'}
                thumbTintColor={darkMode ? '#f8ffae' : '#43e97b'}
              />
              <Text style={[styles.sleepValue, darkMode && { color: '#43e97b' }]}>{sleepHours} hrs</Text>
            </View>
            {/* Habits checklist */}
            <Text style={{ marginBottom: 6, color: darkMode ? '#43e97b' : '#667eea', fontWeight: '600', fontSize: 16 }}>
              Which habits did you complete today?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, width: '100%' }}>
              {habitOptions.map(habit => (
                <TouchableOpacity
                  key={habit.key}
                  style={{
                    backgroundColor: selectedHabits.includes(habit.key) ? (darkMode ? '#43e97b' : '#43e97b') : (darkMode ? '#232526' : '#eee'),
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    margin: 4,
                  }}
                  onPress={() => {
                    setSelectedHabits(prev =>
                      prev.includes(habit.key)
                        ? prev.filter(h => h !== habit.key)
                        : [...prev, habit.key]
                    );
                  }}
                >
                  <Text style={{ color: selectedHabits.includes(habit.key) ? '#fff' : (darkMode ? '#43e97b' : '#667eea'), fontWeight: '600' }}>{habit.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.logInput, darkMode && { backgroundColor: '#232526', color: '#f8ffae', borderColor: '#414345' }]}
              placeholder="Type something..."
              placeholderTextColor={darkMode ? '#aaa' : '#aaa'}
              value={reflection}
              onChangeText={setReflection}
              multiline
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.okModalBtn, darkMode && { backgroundColor: '#43e97b' }]} onPress={handleSaveLogEntry}>
                <Text style={[styles.okModalText, darkMode && { color: '#18181b' }]}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.closeModalBtn, darkMode && { backgroundColor: '#414345' }]} onPress={() => setLogModalVisible(false)}>
                <Text style={[styles.closeModalText, darkMode && { color: '#f8ffae' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal (moved to root) */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor={darkMode ? '#764ba2' : '#fff'}
                trackColor={{ false: '#ccc', true: '#667eea' }}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                thumbColor={notifications ? '#43e97b' : '#fff'}
                trackColor={{ false: '#ccc', true: '#43e97b' }}
              />
            </View>
            {/* Minimal Settings List */}
            <View style={{ width: '100%', marginTop: 8 }}>
              <TouchableOpacity style={styles.settingListItem} onPress={() => {
                Alert.alert('Thank you!', 'Redirecting to app store for rating...');
              }}>
                <Text style={styles.settingListText}>Give Us a Rating ⭐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingListItem} onPress={() => {
                Alert.alert('FAQ', 'Q: How do I use MindMate?\nA: Log your mood, sleep, and habits daily!\n\nQ: Is my data private?\nA: Yes, your data stays on your device.');
              }}>
                <Text style={styles.settingListText}>FAQ ❓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingListItem} onPress={() => {
                Alert.alert('Contact Us', 'Need help or want to reach out?\nEmail: support@mindmate.app\nWe usually reply within 24 hours!');
              }}>
                <Text style={styles.settingListText}>Support / Contact Us 📧</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingListItem} onPress={handleClearCache}>
                <Text style={styles.settingListText}>Clear Cache</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingListItem} onPress={() => {
                Alert.alert(
                  'Feedback',
                  'We value your feedback!\n\nTo send feedback, email: feedback@mindmate.app',
                  [
                    { text: 'Email Us', onPress: () => {
                        // Try to open email client
                        try {
                          // @ts-ignore
                          require('react-native').Linking.openURL('mailto:feedback@mindmate.app?subject=MindMate%20Feedback');
                        } catch {}
                      }
                    },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}>
                <Text style={styles.settingListText}>Feedback 📝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingListItem} onPress={() => {
                Alert.alert(
                  'About MindMate',
                  'MindMate v2.0.0\n\nYour wellness journey companion.\n\nCredits:\n- Design & Development: Uday Varma\n- Special thanks: MindMate Community\n\nMindMate helps you track your mood, sleep, and habits, offering personalized tips and motivation. Your data stays private on your device.'
                );
              }}>
                <Text style={styles.settingListText}>About ℹ️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSettingsVisible(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modern Glass Tab Bar with Trends tab */}
      <LinearGradient
        colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]}
        style={styles.tabBar}
      >
        <View style={styles.tabBarContent}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('dashboard')}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.activeTabBg}
            >
              <BarChart3 color="#fff" size={24} />
            </LinearGradient>
            <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setLogModalVisible(true)}>
            <View style={styles.inactiveTabBg}>
              <PlusCircle color="#667eea" size={24} />
            </View>
            <Text style={styles.tabLabel}>Log Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'challenges' && styles.activeTab]}
            onPress={() => setActiveTab('challenges')}
          >
            <View style={styles.inactiveTabBg}>
              <Target color={activeTab === 'challenges' ? '#43e97b' : '#667eea'} size={24} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'challenges' && styles.activeTabLabel]}>Challenges</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'trends' && styles.activeTab]}
            onPress={() => setActiveTab('trends')}
          >
            <View style={styles.inactiveTabBg}>
              <BarChart3 color={activeTab === 'trends' ? '#43e97b' : '#667eea'} size={24} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'trends' && styles.activeTabLabel]}>Trends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'wellnessReport' && styles.activeTab]}
            onPress={() => setActiveTab('wellnessReport')}
          >
            <View style={styles.inactiveTabBg}>
              <Sparkles color={activeTab === 'wellnessReport' ? '#43e97b' : '#667eea'} size={24} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'wellnessReport' && styles.activeTabLabel]}>Wellness Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setSettingsVisible(true)}>
            <View style={styles.inactiveTabBg}>
              <Settings color="#667eea" size={24} />
            </View>
            <Text style={styles.tabLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingListItem: {
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  settingListText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    marginTop: 2,
  },
  moodOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(102,126,234,0.07)',
    marginHorizontal: 2,
    minWidth: 48,
  },
  moodOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102,126,234,0.18)',
    shadowColor: '#667eea',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  logInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f7f7f7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  clearCacheBtn: {
    marginTop: 12,
    backgroundColor: '#e17055',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 6,
  },
  clearCacheText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeModalBtn: {
    marginTop: 12,
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  actionBarWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 0,
    zIndex: 20,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '95%',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#667eea',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionBarLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
    opacity: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 5,
  },
  absoluteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  footer: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 16,
    marginBottom: 0,
    shadowColor: '#43e97b',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  footerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  gradientHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
    paddingBottom: 32,
    marginBottom: 20,
    marginHorizontal: -16,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 5,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  element1: {
    top: 20,
    right: 30,
  },
  element2: {
    top: 60,
    left: 20,
  },
  element3: {
    bottom: 20,
    right: 50,
  },
  smallCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.7,
  },
  welcomeCard: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  glassOverlay: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 24,
    backdropFilter: 'blur(10px)',
  },
  welcomeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sparkleIcon: {
    marginLeft: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    opacity: 0.9,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    width: '85%',
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 5,
  },
  statUnit: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    opacity: 0.9,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  cardDecor: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabBar: {
    borderRadius: 25,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeTab: {
    transform: [{ scale: 1.1 }],
  },
  activeTabBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#667eea',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  inactiveTabBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    marginTop: 2,
  },
  sleepValue: {
    marginLeft: 12,
    fontSize: 16,
    color: '#667eea',
    fontWeight: 'bold',
    minWidth: 56,
    textAlign: 'right',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  okModalBtn: {
    backgroundColor: '#43e97b',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  okModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Dashboard;