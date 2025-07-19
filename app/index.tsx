import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, Switch, TextInput, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, PlusCircle, Settings, BarChart3, Sparkles, Moon, Sun, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get('window');
function Dashboard() {
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
      let completed = 0, total = 0, bestStreak = 0, streak = 0;
      for (let i = 0; i < last7.length; i++) {
        const c = (last7[i].habits || []).length;
        completed += c;
        total += habitOptions.length;
        if (c === habitOptions.length) {
          streak++;
          if (streak > bestStreak) bestStreak = streak;
        } else {
          streak = 0;
        }
      }
      setHabitsStats({
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
        bestStreak
      });
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
  const [notifications, setNotifications] = useState(false);
  // Navigation state for tab switching
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trends'>('dashboard');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated background gradient filling the whole screen */}
      <LinearGradient
        colors={["#f093fb", "#f5576c", "#4f5bd5", "#43e97b", "#38f9d7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.absoluteBg, { height }]}
      />
      {activeTab === 'dashboard' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Enhanced Header with Multiple Gradients and floating shapes */}
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
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
              colors={["#ff9a9e", "#fecfef", "#ffeaa7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeCard}
            >
              <View style={styles.glassOverlay}>
                <View style={styles.welcomeIconContainer}>
                  <LinearGradient
                    colors={["#ff6b6b", "#ee5a24"]}
                    style={styles.welcomeIconGradient}
                  >
                    <Heart color="#fff" size={24} />
                  </LinearGradient>
                  <Sparkles color="#fff" size={20} style={styles.sparkleIcon} />
                </View>
                <Text style={styles.welcomeTitle}>Welcome back, Alex!</Text>
                <Text style={styles.welcomeSubtitle}>You're absolutely crushing it! 🚀</Text>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={["#00b894", "#00cec9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressFill}
                  />
                </View>
                <Text style={styles.progressText}>Weekly Progress: 85%</Text>
              </View>
            </LinearGradient>

            {/* Floating Action Bar for quick settings and actions - moved to top and made more visible */}
            <View style={styles.actionBarWrapper}>
              <LinearGradient
                colors={["#667eea", "#43e97b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionBar}
              >
                <TouchableOpacity style={styles.actionBarItem} onPress={() => setSettingsVisible(true)}>
                  <Settings color="#fff" size={28} />
                  <Text style={styles.actionBarLabel}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBarItem}>
                  <Sun color="#fff" size={28} />
                  <Text style={styles.actionBarLabel}>Theme</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBarItem}>
                  <Sparkles color="#fff" size={28} />
                  <Text style={styles.actionBarLabel}>Boost</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Habits Summary Only (no graphs) */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Habits Summary (Last 7 Entries)</Text>
              {habitsStats && (
                <Text style={{ color: '#667eea', fontWeight: 'bold', fontSize: 16, marginBottom: 6, textAlign: 'center' }}>
                  {`This week: ${habitsStats.completed} / ${habitsStats.total} habits completed (${habitsStats.percent}%)\nBest streak: ${habitsStats.bestStreak} day${habitsStats.bestStreak === 1 ? '' : 's'}`}
                </Text>
              )}
              {habitsSummary.length > 0 ? (
                <View style={{width: '100%', marginBottom: 12}}>
                  {habitsSummary.map((h, idx) => (
                    <Text key={idx} style={{color: '#43e97b', fontWeight: '600', fontSize: 15, marginBottom: 2}}>
                      {h.date}: {h.completed.length} / {h.total} habits completed
                      {h.completed.length > 0 && (
                        <Text style={{color: '#667eea', fontWeight: '400', fontSize: 14}}>  [
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
                <Text style={{ color: '#aaa', marginTop: 12 }}>No habit data yet. Add a log entry!</Text>
              )}
            </View>

            {/* Enhanced Stats Grid with Creative Cards */}
            <View style={styles.statsGrid}>
              {/* Total Entries Card */}
              <LinearGradient
                colors={["#43e97b", "#38f9d7", "#f093fb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>📋</Text>
                </View>
                <Text style={styles.statValue}>23</Text>
                <Text style={styles.statUnit}>logs</Text>
                <Text style={styles.statLabel}>Total Entries</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>

              {/* Mood Card with Emoji Theme */}
              <LinearGradient
                colors={["#00b894", "#00cec9", "#55efc4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>😊</Text>
                </View>
                <Text style={styles.statValue}>4.2</Text>
                <Text style={styles.statUnit}>/5</Text>
                <Text style={styles.statLabel}>Avg Mood</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>

              {/* Sleep Card with Moon Theme */}
              <LinearGradient
                colors={["#fdcb6e", "#e17055", "#d63031"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Moon color="#fff" size={24} />
                </View>
                <Text style={styles.statValue}>7.5</Text>
                <Text style={styles.statUnit}>hrs</Text>
                <Text style={styles.statLabel}>Avg Sleep</Text>
                <View style={styles.cardDecor} />
              </LinearGradient>
            </View>

            {/* Vibrant Footer Gradient filling the bottom */}
            <LinearGradient
              colors={["#43e97b", "#38f9d7", "#f093fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.footer}
            >
              <Text style={styles.footerText}>Keep shining, Alex! 🌈</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Trends screen is rendered by importing Trends component */}
            {React.createElement(require('./trends').default)}
          </View>
        </ScrollView>
      )}

      {/* Log Entry Modal - always rendered at root */}
      <Modal
        visible={logModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLogModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Entry</Text>
            <Text style={{ marginBottom: 12, color: '#667eea', fontWeight: '600', fontSize: 16 }}>
              How are you feeling today?
            </Text>
            <View style={styles.moodRow}>
              {moodOptions.map((mood, idx) => (
                <TouchableOpacity
                  key={mood.emoji}
                  style={[
                    styles.moodOption,
                    selectedMood === idx && styles.moodOptionSelected,
                  ]}
                  onPress={() => setSelectedMood(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginBottom: 6, color: '#667eea', fontWeight: '600', fontSize: 16 }}>
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
                minimumTrackTintColor="#667eea"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#43e97b"
              />
              <Text style={styles.sleepValue}>{sleepHours} hrs</Text>
            </View>
            {/* Habits checklist */}
            <Text style={{ marginBottom: 6, color: '#667eea', fontWeight: '600', fontSize: 16 }}>
              Which habits did you complete today?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, width: '100%' }}>
              {habitOptions.map(habit => (
                <TouchableOpacity
                  key={habit.key}
                  style={{
                    backgroundColor: selectedHabits.includes(habit.key) ? '#43e97b' : '#eee',
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
                  <Text style={{ color: selectedHabits.includes(habit.key) ? '#fff' : '#667eea', fontWeight: '600' }}>{habit.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.logInput}
              placeholder="Type something..."
              placeholderTextColor="#aaa"
              value={reflection}
              onChangeText={setReflection}
              multiline
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.okModalBtn} onPress={handleSaveLogEntry}>
                <Text style={styles.okModalText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setLogModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
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
            <TouchableOpacity style={styles.clearCacheBtn} onPress={handleClearCache}>
              <Text style={styles.clearCacheText}>Clear Cache</Text>
            </TouchableOpacity>
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
            style={[styles.tabItem, activeTab === 'trends' && styles.activeTab]}
            onPress={() => setActiveTab('trends')}
          >
            <View style={styles.inactiveTabBg}>
              <BarChart3 color={activeTab === 'trends' ? '#43e97b' : '#667eea'} size={24} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'trends' && styles.activeTabLabel]}>Trends</Text>
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