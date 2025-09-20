import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, H1, H2, MediumText } from '../../shared/components/Typography';
import FilterPill from '../components/FilterPill';
import JobCard from '../components/JobCard';
import SectionHeader from '../../shared/components/SectionHeader';
import { jobCategories, seekerJobs } from '../../shared/data/mockData';
import * as authService from '../../shared/services/authService';

const SeekerScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = useMemo(() => ['All', ...jobCategories], []);

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

  const filteredJobs = useMemo(() => {
    if (selectedCategory === 'All') {
      return seekerJobs;
    }
    return seekerJobs.filter((job) => job.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredJobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.header}>
              <H1 style={styles.heroHeading}>ค้นหางานที่เหมาะกับคุณ</H1>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <MediumText style={styles.heroSubheading}>เลือกดูโอกาสงานคุณภาพ สมัครง่าย ค้นหาเร็ว</MediumText>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
              renderItem={({ item }) => (
                <FilterPill
                  label={item === 'All' ? 'ทั้งหมด' : item}
                  active={item === selectedCategory}
                  onPress={() => setSelectedCategory(item)}
                />
              )}
            />
            <SectionHeader title="งานแนะนำ" actionLabel="ดูทั้งหมด" onActionPress={() => setSelectedCategory('All')} />
          </View>
        )}
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>ยังไม่มีงาน</Text>
            <Text style={styles.emptySubtitle}>ลองเปลี่ยนหมวดหมู่หรือกลับมาดูใหม่อีกครั้ง</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroHeading: {
    fontSize: 26,
    color: '#0f172a',
    flex: 1,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  heroSubheading: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 18,
  },
  pillRow: {
    paddingVertical: 8,
    marginBottom: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#1f2937',
  },
  emptySubtitle: {
    marginTop: 8,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default SeekerScreen;
