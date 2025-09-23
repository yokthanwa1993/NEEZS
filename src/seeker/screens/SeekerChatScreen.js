import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image, TextInput, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation } from '@react-navigation/native';

const mockChats = [
  {
    id: '0',
    name: 'NEEZS Team',
    message: 'มีคนทักคุณมาใหม่ ลองเปิดดูเลย',
    time: 'เมื่อสักครู่',
    unread: 1,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=5' },
  },
  {
    id: '1',
    name: 'Andy Robertson',
    message: 'ได้ครับ รบกวนส่งเรซูเม่มาให้อีกครั้ง...',
    time: '5 นาทีที่แล้ว',
    unread: 2,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=11' },
  },
  {
    id: '2',
    name: 'Giorgio Chiellini',
    message: 'สวัสดีครับ, ตอนเช้าดีมากเลย',
    time: '30 นาทีที่แล้ว',
    unread: 0,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=12' },
  },
  {
    id: '3',
    name: 'Alex Morgan',
    message: 'เห็นประกาศตำแหน่ง UI/UX ของคุณ...',
    time: '09:30 น.',
    unread: 0,
    showTrash: true,
    avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=13' },
  },
  { id: '4', name: 'Megan Rapinoe', message: 'ฉันสนใจงานตำแหน่งนี้ค่ะ', time: '13:00 น.', unread: 0, avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=14' } },
  { id: '5', name: 'Alessandro Bastoni', message: 'พร้อมสัมภาษณ์เมื่อไหร่ดีครับ', time: '18:00 น.', unread: 0, avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=15' } },
  { id: '6', name: 'Ilkay Gundogan', message: 'เมื่อวานผมเห็นโพสต์งานของคุณ', time: 'เมื่อวาน', unread: 0, avatar: { type: 'image', src: 'https://i.pravatar.cc/100?img=16' } },
];

// no tabs in this design

const Avatar = ({ avatar }) => {
  if (avatar?.type === 'icon') {
    return (
      <View style={[styles.avatar, { backgroundColor: avatar.bg }]}> 
        <Ionicons name={avatar.name} size={20} color={avatar.color} />
      </View>
    );
  }
  if (avatar?.type === 'image') {
    return <Image source={{ uri: avatar.src }} style={[styles.avatar, { backgroundColor: 'transparent' }]} />;
  }
  return (
    <View style={[styles.avatar, { backgroundColor: avatar?.bg || '#e5e7eb' }]}> 
      <Text weight={700} style={{ color: avatar?.color || '#111827' }}>{avatar?.text || '?'}</Text>
    </View>
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
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text weight={700} style={{ color: '#111827', fontSize: 16 }} numberOfLines={1}>{item.name}</Text>
          <Text style={{ color: '#6b7280', marginTop: 2 }} numberOfLines={1}>{item.message}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>{item.time}</Text>
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

const SeekerChatScreen = () => {
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState(mockChats);
  const data = useMemo(() => chats.filter(m => (m.name+m.message).toLowerCase().includes(query.toLowerCase())), [query, chats]);
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
          placeholder="ค้นหาข้อความ"
          placeholderTextColor="#9ca3af"
          style={{ flex: 1, marginLeft: 8, color: '#111827' }}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 0 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  headerTitle: { color: '#111827', fontSize: 22 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eef2f7',
  },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  unreadPill: { marginTop: 6, backgroundColor: '#f5c518', minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  trashBox: { marginLeft: 10, backgroundColor: '#FEF9C3', borderRadius: 16, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#fde68a' },
  swipeAction: { width: 64, height: '80%', backgroundColor: '#fde68a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  swipePress: { justifyContent: 'center' },
});

export default SeekerChatScreen;
