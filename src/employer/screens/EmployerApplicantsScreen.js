import React from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { highlightedApplicants } from '../../shared/data/mockData';

const BRAND = '#FFA500';

function seeded(str = '') {
  return String(str)
    .split('')
    .reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 10000, 7);
}

function getRating(item) {
  const s = seeded(item.id);
  // 3.5 - 5.0 step .1
  const base = 3.5 + ((s % 16) / 10);
  return Math.min(5, Math.round(base * 10) / 10);
}

function getDistanceKm(item) {
  const s = seeded(item.id + '-km');
  const km = 0.5 + (s % 150) / 10; // 0.5 - 15.0 km
  return Math.round(km * 10) / 10;
}

function getAccent(seedStr) {
  const colors = ['#FFD28A', '#FECACA', '#C7D2FE', '#BBF7D0', '#FDE68A'];
  const idx = seeded(seedStr) % colors.length;
  return colors[idx];
}

const Row = ({ item, onPress }) => {
  const imgIndex = 1 + (seeded(item.id + '-img') % 70);
  const ring = getAccent(item.id);
  return (
  <View style={styles.row}> 
    <Image source={{ uri: `https://i.pravatar.cc/300?img=${imgIndex}` }} style={[styles.avatar, { borderColor: ring }]} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text weight={800} style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>{item.role} • {item.experience}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Ionicons name="star" size={14} color={BRAND} />
        <Text style={styles.metaBold}> {getRating(item)} </Text>
        <Text style={{ color: '#9ca3af' }}>•</Text>
        <Ionicons name="location-outline" size={14} color="#6b7280" style={{ marginLeft: 6 }} />
        <Text style={styles.meta}> {getDistanceKm(item)} กม.</Text>
      </View>
      {item.bio ? <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text> : null}
      {/* Action buttons */}
      <View style={styles.actionRow}>
        <Pressable
          style={styles.acceptBtn}
          onPress={() => Alert.alert('ยืนยันผู้สมัคร', `เชิญ ${item.name} เข้าสัมภาษณ์`, [ { text: 'ตกลง' } ])}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text weight={800} style={styles.btnText}>ยืนยัน</Text>
        </Pressable>
        <Pressable
          style={styles.rejectBtn}
          onPress={() => Alert.alert('ปฏิเสธผู้สมัคร', `ต้องการปฏิเสธ ${item.name} หรือไม่?`, [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ปฏิเสธ', style: 'destructive' },
          ])}
        >
          <Ionicons name="close" size={18} color="#fff" />
          <Text weight={800} style={styles.btnText}>ปฏิเสธ</Text>
        </Pressable>
      </View>
    </View>
    <Pressable hitSlop={10} style={styles.bookmark} onPress={onPress}>
      <Ionicons name="bookmark-outline" size={20} color="#111827" />
    </Pressable>
  </View>
);
}

const EmployerApplicantsScreen = ({ route, navigation }) => {
  const { title = 'ผู้สมัครทั้งหมด', applicants = [] } = route.params || {};

  // ให้โปรไฟล์หลากหลาย: เรียงด้วยค่า seed เพื่อสุ่มอย่างคงที่
  const base = applicants.length ? applicants : highlightedApplicants;
  const data = [...base].sort((a, b) => seeded(a.id) - seeded(b.id));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={800} style={styles.title}>{title} ({data.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('EmployerApplicantDetail', { applicant: item })}>
            <Row item={item} onPress={() => navigation.navigate('EmployerApplicantDetail', { applicant: item })} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default EmployerApplicantsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10 },
  title: { fontSize: 18, color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f3f4f6', borderRadius: 14, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  // Portrait 16:9 (width:height = 9:16)
  avatar: { width: 72, height: 128, borderRadius: 8, backgroundColor: '#e5e7eb', borderWidth: 2, resizeMode: 'cover' },
  name: { fontSize: 16, color: '#0f172a' },
  meta: { color: '#6b7280', marginTop: 2 },
  metaBold: { color: '#111827', fontWeight: '700' },
  bio: { color: '#374151', marginTop: 6 },
  tags: { flexDirection: 'row', marginTop: 8 },
  tag: { backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginRight: 8 },
  tagText: { color: '#111827', fontSize: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  acceptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#22c55e', paddingVertical: 12, borderRadius: 12, paddingHorizontal: 16, minWidth: 120, marginRight: 10 },
  rejectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 12, paddingHorizontal: 16, minWidth: 120 },
  btnText: { color: '#fff', marginLeft: 8, fontSize: 14 },
  bookmark: { padding: 6 },
});
