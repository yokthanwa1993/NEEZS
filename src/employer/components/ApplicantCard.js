import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '../../shared/components/Typography';

const ApplicantCard = ({ applicant, onPress }) => {
  return (
    <Pressable onPress={() => onPress?.(applicant)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Text weight={600} style={styles.name}>{applicant.name}</Text>
      <Text weight={500} style={styles.role}>{applicant.role}</Text>
      <Text style={styles.experience}>{applicant.experience}</Text>
      {applicant.bio ? <Text style={styles.bio}>{applicant.bio}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    fontSize: 18,
    color: '#f9fafb',
  },
  role: {
    marginTop: 6,
    color: '#60a5fa',
  },
  experience: {
    marginTop: 6,
    color: '#d1d5db',
  },
  bio: {
    marginTop: 10,
    color: '#e5e7eb',
    lineHeight: 20,
  },
});

export default ApplicantCard;
