import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '../../shared/components/Typography';

const FilterPill = ({ label, active, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, active && styles.pillActive, pressed && styles.pillPressed]}>
      <Text weight={500} style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
    backgroundColor: '#ffffff',
  },
  pillActive: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  pillPressed: {
    opacity: 0.85,
  },
  label: {
    color: '#374151',
  },
  labelActive: {
    color: '#ffffff',
  },
});

export default FilterPill;
