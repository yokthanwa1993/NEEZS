import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';

const general = [
  { id: 'g1', icon: 'shield-checkmark-outline', color: '#60a5fa', title: 'อัปเดตความปลอดภัย', time: 'Today | 09:00', desc: 'ยืนยันตัวตนด้วยลายนิ้วมือหรือ Face ID รองรับแล้ว', isNew: true },
  { id: 'g2', icon: 'cloud-download-outline', color: '#a78bfa', title: 'แอปเวอร์ชันใหม่', time: 'Yesterday | 16:20', desc: 'ปรับปรุงประสิทธิภาพการค้นหาผู้สมัครและระบบแชท' },
];

const recruiting = [
  { id: 'r1', icon: 'person-add-outline', color: '#34d399', title: 'มีผู้สมัครใหม่ (Barista)', time: 'วันนี้ | 10:12', desc: 'ปิยะวดี ธรรมรักษ์ ส่งใบสมัครสำหรับตำแหน่ง Barista', isNew: true },
  { id: 'r2', icon: 'chatbubble-ellipses-outline', color: '#38bdf8', title: 'ข้อความใหม่จากผู้สมัคร', time: 'เมื่อสักครู่', desc: 'ณัฐธิดา กิมกิตติเจริญ: ขอรายละเอียดเวลาทำงานเพิ่มค่ะ' },
  { id: 'r3', icon: 'calendar-outline', color: '#f59e0b', title: 'ยืนยันนัดสัมภาษณ์', time: 'พรุ่งนี้ | 09:00', desc: 'วีรยุทธ กล้าหาญ ตอบรับสัมภาษณ์ตำแหน่ง พนักงานหน้าร้าน' },
];

const TabButton = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={styles.tabBtn}>
    <Text weight={700} style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    {active ? <View style={styles.tabUnderline} /> : null}
  </Pressable>
);

const NewPill = () => (
  <View style={styles.newPill}><Text weight={700} style={{ color: '#fff', fontSize: 12 }}>New</Text></View>
);

const IconCircle = ({ name, bg }) => (
  <View style={[styles.iconCircle, { backgroundColor: bg + '33' }]}> 
    <Ionicons name={name} size={20} color={bg} />
  </View>
);

const NotificationItem = ({ item }) => (
  <View style={styles.card}> 
    <IconCircle name={item.icon} bg={item.color} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text weight={700} style={{ color: '#111827', fontSize: 15 }}>{item.title}</Text>
        {item.isNew ? <NewPill /> : null}
      </View>
      <Text style={{ color: '#6b7280', marginTop: 2 }}>{item.time}</Text>
      <Text style={{ color: '#374151', marginTop: 10 }}>{item.desc}</Text>
    </View>
  </View>
);

const EmployerNotificationsScreen = () => {
  const [tab, setTab] = useState('recruiting');
  const data = useMemo(() => (tab === 'general' ? general : recruiting), [tab]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text weight={700} style={styles.headerTitle}>Notifications</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="search" size={20} color="#6b7280" style={{ marginRight: 16 }} />
          <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton label="การสรรหา" active={tab === 'recruiting'} onPress={() => setTab('recruiting')} />
        <TabButton label="ทั่วไป" active={tab === 'general'} onPress={() => setTab('general')} />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  headerTitle: { color: '#111827', fontSize: 18 },
  tabsRow: { flexDirection: 'row', paddingTop: 6, paddingBottom: 10 },
  tabBtn: { marginRight: 20 },
  tabLabel: { color: '#374151' },
  tabLabelActive: { color: '#111827' },
  tabUnderline: { height: 3, backgroundColor: '#f5c518', marginTop: 6, borderRadius: 2 },
  card: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  newPill: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
});

export default EmployerNotificationsScreen;
