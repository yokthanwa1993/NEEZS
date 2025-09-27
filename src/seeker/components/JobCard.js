import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';

const JobCard = ({ job, onPress }) => {
  return (
    <Pressable onPress={() => onPress?.(job)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      {job.image ? (
        <Image source={{ uri: job.image }} style={styles.cover} />
      ) : null}
      <View style={styles.headerRow}>
        <Text weight={600} style={styles.title}>{job.title}</Text>
        <Text weight={500} style={styles.schedule}>{job.schedule}</Text>
      </View>
      <Text weight={500} style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#6b7280" />
        <Text style={styles.metaText}> {job.workHours || '09:00-18:00'}</Text>
        <View style={{ width: 12 }} />
        <Ionicons name="calendar-outline" size={14} color="#6b7280" />
        <Text style={styles.metaText}> {job.endAt || '31/12 23:59'}</Text>
      </View>
      <Text weight={600} style={styles.salary}>{job.salary}</Text>
      <View style={styles.badgeRow}>
        {job.badges?.map((badge) => (
          <View key={badge} style={styles.badge}>
            <Text weight={500} style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>
      {job.description ? <Text style={styles.description}>{job.description}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cover: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: '#1f2937',
    marginRight: 12,
  },
  schedule: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  company: {
    marginTop: 8,
    color: '#4b5563',
  },
  location: {
    marginTop: 4,
    color: '#6b7280',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: { color: '#6b7280' },
  salary: {
    marginTop: 6,
    color: '#047857',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#4b5563',
    fontSize: 12,
  },
  description: {
    marginTop: 12,
    color: '#374151',
    lineHeight: 20,
  },
});

export default JobCard;
