import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, H1, H2, MediumText } from '../../shared/components/Typography';
import SectionHeader from '../../shared/components/SectionHeader';
import ApplicantCard from '../components/ApplicantCard';
import { employerJobs, highlightedApplicants } from '../../shared/data/mockData';
import * as authService from '../../shared/services/authService';

const EmployerScreen = () => {
  const handleSignOut = async () => {
    Alert.alert(
      'ออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: async () => {
            const result = await authService.signOutUser();
            if (!result.success) {
              Alert.alert('ข้อผิดพลาด', result.error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroBox}>
          <View style={styles.header}>
            <H1 style={styles.heroTitle}>จัดการผู้สมัครงานแบบเรียลไทม์</H1>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Ionicons name="log-out-outline" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <MediumText style={styles.heroSubtitle}>
            ติดตามผู้สมัครงาน นัดสัมภาษณ์ และคัดเลือกบุคลากรที่มีศักยภาพในทุกตำแหน่ง
          </MediumText>
        </View>
        <SectionHeader
          title="ประกาศงานที่เปิดรับ"
          actionLabel="สร้างใหม่"
          onActionPress={() => {}}
          color="#e0f2fe"
          actionColor="#38bdf8"
        />
        {employerJobs.map((posting) => (
          <View key={posting.id} style={styles.postingCard}>
            <View style={styles.postingHeader}>
              <Text weight={600} style={styles.postingTitle}>{posting.title}</Text>
              <Text weight={600} style={[styles.statusBadge, styles[`status${posting.status}`] || styles.statusDefault]}>
                {posting.status}
              </Text>
            </View>
            <Text weight={500} style={styles.postingMeta}>{posting.applicants} applicants in review</Text>
            <View style={styles.shiftRow}>
              {posting.shifts.map((shift) => (
                <View key={shift} style={styles.shiftBadge}>
                  <Text weight={500} style={styles.shiftText}>{shift}</Text>
                </View>
              ))}
            </View>
            {posting.notes ? <Text style={styles.postingNotes}>{posting.notes}</Text> : null}
          </View>
        ))}
        <SectionHeader
          title="Highlighted applicants"
          actionLabel="View all"
          onActionPress={() => {}}
          color="#e0f2fe"
          actionColor="#38bdf8"
        />
        {highlightedApplicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroBox: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    color: '#e2e8f0',
    flex: 1,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#cbd5f5',
  },
  postingCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  postingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postingTitle: {
    fontSize: 18,
    color: '#f8fafc',
  },
  postingMeta: {
    marginTop: 10,
    color: '#cbd5f5',
  },
  shiftRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  shiftBadge: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  shiftText: {
    color: '#e0f2fe',
  },
  postingNotes: {
    marginTop: 12,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  statusOpen: {
    backgroundColor: '#22d3ee',
  },
  statusInterviewing: {
    backgroundColor: '#facc15',
  },
  statusDefault: {
    backgroundColor: '#94a3b8',
  },
});

export default EmployerScreen;
