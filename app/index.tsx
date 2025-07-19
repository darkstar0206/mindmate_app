import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, PlusCircle, Settings, BarChart3, Sparkles, Moon, Sun, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated background gradient filling the whole screen */}
      <LinearGradient
        colors={["#f093fb", "#f5576c", "#4f5bd5", "#43e97b", "#38f9d7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.absoluteBg, { height }]}
      />
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
              <TouchableOpacity style={styles.actionBarItem}>
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

          {/* Enhanced Stats Grid with Creative Cards */}
          <View style={styles.statsGrid}>
            {/* Streak Card with Fire Animation Effect */}
            <LinearGradient
              colors={["#fd79a8", "#fdcb6e", "#e84393"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>�</Text>
              </View>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statUnit}>days</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
              <View style={styles.cardDecor} />
            </LinearGradient>

            {/* Logs Card with Journal Theme */}
            <LinearGradient
              colors={["#a29bfe", "#74b9ff", "#0984e3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>�</Text>
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

          {/* Modern Glass Tab Bar */}
          <LinearGradient
            colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]}
            style={styles.tabBar}
          >
            <View style={styles.tabBarContent}>
              <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.activeTabBg}
                >
                  <BarChart3 color="#fff" size={24} />
                </LinearGradient>
                <Text style={[styles.tabLabel, styles.activeTabLabel]}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <View style={styles.inactiveTabBg}>
                  <PlusCircle color="#667eea" size={24} />
                </View>
                <Text style={styles.tabLabel}>Log Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <View style={styles.inactiveTabBg}>
                  <Settings color="#667eea" size={24} />
                </View>
                <Text style={styles.tabLabel}>Settings</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});

export default Dashboard;