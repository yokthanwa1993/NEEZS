import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const mockChats = [
  {
    id: 'c1',
    name: 'ณัฐธิดา กิมกิตติเจริญ',
    message: 'สนใจตำแหน่งพนักงานหน้าร้านค่ะ',
    time: 'เมื่อสักครู่',
    unread: 2,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=20' },
  },
  {
    id: 'c2',
    name: 'วีรยุทธ กล้าหาญ',
    message: 'พรุ่งนี้สะดวกสัมภาษณ์ช่วงบ่ายครับ',
    time: '10 นาทีที่แล้ว',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=21' },
  },
  {
    id: 'c3',
    name: 'ทีมงาน NEEZS',
    message: 'อัปเดตฟีเจอร์ใหม่สำหรับผู้ประกอบการ',
    time: 'เมื่อวาน',
    unread: 1,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=5' },
  },
  {
    id: 'c4',
    name: 'ปิยะวดี ธรรมรักษ์',
    message: 'แนบเรซูเม่ฉบับปรับปรุงแล้วค่ะ',
    time: 'จันทร์ 09:30',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=24' },
  },
  {
    id: 'c5',
    name: 'ชนัญชิดา แสงแก้ว',
    message: 'สะดวกเริ่มงานสัปดาห์หน้าได้เลยค่ะ',
    time: 'จันทร์ 11:10',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=32' },
  },
  {
    id: 'c6',
    name: 'อธิวัฒน์ เก่งกิจ',
    message: 'แนบพอร์ตงานครัวมาให้ตรวจแล้วครับ',
    time: 'อาทิตย์ที่แล้ว',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=34' },
  },
  {
    id: 'c7',
    name: 'ภัทรานิษฐ์ อารีย์',
    message: 'นัดสัมภาษณ์พรุ่งนี้ 14:00 ได้ไหมคะ',
    time: 'เมื่อวาน 17:45',
    unread: 3,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=41' },
  },
  {
    id: 'c8',
    name: 'ทีมงาน NEEZS Jobs',
    message: 'คู่มือการใช้งานผู้ประกอบการเวอร์ชันใหม่',
    time: '2 วันที่แล้ว',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=8' },
  },
  {
    id: 'c9',
    name: 'ปณชัย สุนทร',
    message: 'ส่งเอกสารยืนยันตัวตนเรียบร้อยครับ',
    time: 'ศุกร์ 16:12',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=44' },
  },
  {
    id: 'c10',
    name: 'กชสร อินทรสกุล',
    message: 'ขอบคุณค่ะ เจอกันวันสัมภาษณ์นะคะ',
    time: 'ศุกร์ 09:10',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=46' },
  },
  {
    id: 'c11',
    name: 'คณิน วัฒนะ',
    message: 'ผมสะดวกกะกลางคืนครับ',
    time: 'พฤหัส 21:02',
    unread: 1,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=48' },
  },
  {
    id: 'c12',
    name: 'มธุรส แสงทอง',
    message: 'แนบเอกสารประวัติการทำงานไว้แล้วค่ะ',
    time: 'พุธ 15:20',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=50' },
  },
];

const Avatar = ({ avatar }) => {
  if (avatar?.type === 'image') {
    return <Image source={{ uri: avatar.src }} style={[styles.avatar, { backgroundColor: 'transparent' }]} />;
  }
  return (
    <View style={[styles.avatar, { backgroundColor: '#e5e7eb' }]} />
  );
};

const ChatItem = ({ item, onDelete }) => {
  const navigation = useNavigation();
  const RightAction = () => (
    <View style={styles.swipeAction}><Ionicons name="trash" size={22} color="#111827" /></View>
  );
  const LeftAction = () => (
    <View style={styles.swipeAction}><Ionicons name="trash" size={22} color="#111827" /></View>
  );
  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable onPress={() => onDelete(item)} style={styles.swipePress}><RightAction /></Pressable>
      )}
      renderLeftActions={() => (
        <Pressable onPress={() => onDelete(item)} style={styles.swipePress}><LeftAction /></Pressable>
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      <Pressable
        style={({ pressed }) => [styles.itemRow, pressed && { opacity: 0.9 }]}
        onPress={() => navigation.navigate('ChatRoom', { chat: item })}
      >
        <Avatar avatar={item.avatar} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text weight={700} style={{ color: '#111827', fontSize: 18 }} numberOfLines={1}>{item.name}</Text>
          <Text style={{ color: '#6b7280', marginTop: 4, fontSize: 15 }} numberOfLines={1}>{item.message}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: '#9ca3af', fontSize: 13 }}>{item.time}</Text>
          {item.unread ? (
            <View style={styles.unreadPill}>
              <Text weight={700} style={{ fontSize: 12, color: '#fff' }}>{String(item.unread)}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Swipeable>
  );
};

const EmployerChatScreen = () => {
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState(mockChats);
  const data = useMemo(() => chats.filter(m => (m.name + m.message).toLowerCase().includes(query.toLowerCase())), [query, chats]);

  const handleDelete = (item) => {
    Alert.alert('ลบแชท', `ต้องการลบการสนทนากับ ${item.name} หรือไม่?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => setChats((prev) => prev.filter((c) => c.id !== item.id)) },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text weight={700} style={styles.headerTitle}>ข้อความ</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="create-outline" size={20} color="#374151" style={{ marginRight: 16 }} />
          <Ionicons name="ellipsis-vertical" size={18} color="#374151" />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหาข้อความหรือผู้สมัคร"
          placeholderTextColor="#9ca3af"
          style={{ flex: 1, marginLeft: 8, color: '#111827' }}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  headerTitle: { color: '#111827', fontSize: 26 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eef2f7',
  },
  avatar: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  unreadPill: { marginTop: 6, backgroundColor: '#FFA500', minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  swipeAction: { width: 64, height: '80%', backgroundColor: '#FFD28A', borderRadius: 12, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  swipePress: { justifyContent: 'center' },
});

export default EmployerChatScreen;
