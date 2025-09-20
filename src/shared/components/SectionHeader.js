import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Typography';

const SectionHeader = ({ title, actionLabel, onActionPress, color = '#111827', actionColor = '#f5c518' }) => {
  return (
    <View style={styles.container}>
      <Text weight={700} style={[styles.title, { color }]}>{title}</Text>
      {actionLabel ? (
        <Text
          weight={600}
          accessibilityRole="button"
          onPress={onActionPress}
          style={[styles.action, { color: actionColor }]}
        >
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: '#111827',
  },
  action: {
    fontSize: 14,
  },
});

export default SectionHeader;
