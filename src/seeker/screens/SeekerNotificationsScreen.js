import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';

const general = [
  { id: 'n1', icon: 'shield-checkmark-outline', color: '#60a5fa', title: 'Security Updates', time: '31st Dec, 2024 | 12:00 PM', desc: 'Now you can use your Face ID or fingerprint identification to authenticate into the app.', isNew: true },
  { id: 'n2', icon: 'grid-outline', color: '#fb7185', title: 'Security Updates', time: '31st Dec, 2024 | 12:00 PM', desc: 'Now you can use your Face ID or fingerprint identification to authenticate into the app.', isNew: true },
  { id: 'n3', icon: 'person-add-outline', color: '#34d399', title: 'Security Updates', time: '31st Dec, 2024 | 12:00 PM', desc: 'Now you can use your Face ID or fingerprint identification to authenticate into the app.' },
  { id: 'n4', icon: 'grid-outline', color: '#93c5fd', title: 'Security Updates', time: '31st Dec, 2024 | 12:00 PM', desc: 'Now you can use your Face ID or fingerprint identification to authenticate into the app.' },
];

const applications = [
  { id: 'a1', icon: 'briefcase-outline', color: '#facc15', title: 'ใบสมัครงานของคุณถูกเปิดอ่านแล้ว', time: 'Today | 09:20 AM', desc: 'ผู้ประกอบการกำลังพิจารณาใบสมัครของคุณ โปรดติดตามผลอีกครั้งภายหลัง' },
  { id: 'a2', icon: 'chatbubble-ellipses-outline', color: '#38bdf8', title: 'มีข้อความใหม่จาก Bean & Brew', time: 'Yesterday | 04:35 PM', desc: 'นัดสัมภาษณ์งานตำแหน่งพนักงานร้านกาแฟ วันพรุ่งนี้เวลา 10:00 น.' },
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

const SeekerNotificationsScreen = () => {
  const [tab, setTab] = useState('general');
  const data = useMemo(() => (tab === 'general' ? general : applications), [tab]);

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
        <TabButton label="General" active={tab === 'general'} onPress={() => setTab('general')} />
        <TabButton label="Applications" active={tab === 'applications'} onPress={() => setTab('applications')} />
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
  tabUnderline: { height: 3, backgroundColor: '#FFA500', marginTop: 6, borderRadius: 2 },
  card: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  newPill: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
});

export default SeekerNotificationsScreen;
