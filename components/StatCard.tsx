import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  gradient: string[];
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  gradient 
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.value}>
          {value}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
});