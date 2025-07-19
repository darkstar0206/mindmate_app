import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SleepSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const SleepSlider: React.FC<SleepSliderProps> = ({ 
  value, 
  onValueChange 
}) => {
  const getSleepQuality = (hours: number) => {
    if (hours < 6) return { text: 'Too Little', color: '#EF4444' };
    if (hours < 7) return { text: 'Could be better', color: '#F97316' };
    if (hours <= 8) return { text: 'Good', color: '#22C55E' };
    if (hours <= 9) return { text: 'Great', color: '#10B981' };
    return { text: 'Too Much', color: '#F59E0B' };
  };

  const quality = getSleepQuality(value);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hoursText}>{value.toFixed(1)} hours</Text>
        <Text style={[styles.qualityText, { color: quality.color }]}>
          {quality.text}
        </Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={4}
        maximumValue={12}
        value={value}
        onValueChange={onValueChange}
        step={0.5}
        minimumTrackTintColor="#14B8A6"
        maximumTrackTintColor="#E5E7EB"
        // Removed invalid thumbStyle prop
      />
      
      <View style={styles.labels}>
        <Text style={styles.labelText}>4h</Text>
        <Text style={styles.labelText}>12h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  qualityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#14B8A6',
    width: 20,
    height: 20,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});