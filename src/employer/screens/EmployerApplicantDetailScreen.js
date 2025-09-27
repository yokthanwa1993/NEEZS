import React from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';

const BRAND = '#FFA500';

function Avatar({ seed }) {
  const uri = `https://i.pravatar.cc/200?img=${(String(seed || '').length * 9) % 70}`;
  return <Image source={{ uri }} style={styles.avatar} />;
}

const Pill = ({ label, tone = 'default' }) => (
  <View style={[styles.pill, tone === 'brand' && styles.pillBrand, tone === 'muted' && styles.pillMuted]}>
    <Text style={[styles.pillText, tone === 'brand' && { color: '#065F46' }]}>{label}</Text>
  </View>
);

const Stat = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <View style={styles.statIcon}><Ionicons name={icon} size={16} color={BRAND} /></View>
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text weight={900} style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const EmployerApplicantDetailScreen = ({ route, navigation }) => {
  const a = route?.params?.applicant || {
    id: 'applicant-1',
    name: 'สิรินุช วงศ์ดี',
    role: 'พนักงานบริการลูกค้า',
    experience: 'ประสบการณ์ 2 ปี',
    bio: 'สื่อสารดี ยิ้มแย้ม พร้อมเรียนรู้งานใหม่ ๆ ทำงานเป็นทีมและทำงานภายใต้ความกดดันได้',
    skills: ['บริการลูกค้า', 'สื่อสารดี', 'ทำงานเป็นทีม', 'ยืดหยุ่นเวลา'],
    expected: '50–80 บาท/ชั่วโมง',
    type: 'เต็มเวลา / พาร์ทไทม์',
    location: 'กรุงเทพฯ',
    availability: 'เริ่มงานได้ทันที',
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={800} style={styles.headerTitle}>ข้อมูลผู้สมัคร</Text>
        <Pressable hitSlop={10}>
          <Ionicons name="notifications-outline" size={20} color="#111827" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar seed={a.id} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text weight={900} style={styles.name}>{a.name}</Text>
            <Text style={styles.role}>{a.role} • {a.location}</Text>
          </View>
          <Pressable style={styles.bookmark}><Ionicons name="bookmark-outline" size={20} color="#111827" /></Pressable>
        </View>

        {/* About */}
        <Text weight={800} style={styles.sectionTitle}>รายละเอียดผู้สมัคร</Text>
        <Text style={styles.paragraph}>
          {a.bio}
        </Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {a.skills?.map((s) => <Pill key={s} label={s} />)}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat icon="briefcase-outline" label="ประสบการณ์" value={a.experience || '—'} />
          <Stat icon="cash-outline" label="คาดหวังรายได้" value={a.expected || '—'} />
        </View>
        <View style={styles.statsRow}>
          <Stat icon="time-outline" label="ประเภทงาน" value={a.type || '—'} />
          <Stat icon="checkmark-circle-outline" label="ความพร้อม" value={a.availability || '—'} />
        </View>

        {/* CTA */}
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('EmployerChat')}> 
          <Text weight={800} style={styles.primaryBtnText}>เชิญสัมภาษณ์</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployerApplicantDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10 },
  headerTitle: { color: '#111827', fontSize: 18 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb' },
  name: { color: '#0f172a', fontSize: 18 },
  role: { color: '#6b7280', marginTop: 2 },
  bookmark: { padding: 6 },
  sectionTitle: { marginTop: 16, marginBottom: 8, color: '#111827', fontSize: 16 },
  paragraph: { color: '#374151', lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  pill: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginRight: 8, marginBottom: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  pillText: { color: '#111827', fontSize: 12 },
  pillBrand: { backgroundColor: '#d1fae5', borderColor: '#bbf7d0' },
  pillMuted: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 14, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', flex: 1, marginRight: 10 },
  statIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  statLabel: { color: '#6b7280', fontSize: 12 },
  statValue: { color: '#0f172a', fontSize: 14 },
  primaryBtn: { marginTop: 20, backgroundColor: BRAND, paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  primaryBtnText: { color: '#111827', fontSize: 16 },
});

