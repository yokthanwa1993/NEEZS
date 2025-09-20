import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation } from '@react-navigation/native';

const mockChats = [
  {
    id: '1',
    name: 'Dribbble Inc',
    message: 'Our review will end...',
    time: '17:02',
    unread: 2,
    avatar: { type: 'icon', name: 'basketball-outline', bg: '#f472b6', color: '#fff' },
  },
  {
    id: '2',
    name: 'Whatsapp Inc',
    message: 'Such a trash job',
    time: '17:01',
    unread: 0,
    avatar: { type: 'icon', name: 'logo-whatsapp', bg: '#22c55e', color: '#fff' },
  },
  {
    id: '3',
    name: 'Amazon',
    message: 'Contract will be sent...',
    time: '17:00',
    unread: 2,
    avatar: { type: 'letter', text: 'A', bg: '#fde68a', color: '#111827' },
  },
  { id: '4', name: 'Doni Vitton', message: 'Good job, we continue tomorrow...', time: '16:44', unread: 0, avatar: { type: 'letter', text: 'D', bg: '#93c5fd', color: '#111827' } },
  { id: '5', name: 'Uncle Sais', message: 'Have another job for you...', time: '16:30', unread: 0, avatar: { type: 'letter', text: 'U', bg: '#bfdbfe', color: '#111827' } },
  { id: '6', name: 'Google Inc', message: 'It was a pleasure...', time: '16:18', unread: 0, avatar: { type: 'icon', name: 'logo-google', bg: '#fff', color: '#111827' } },
  { id: '7', name: 'Joseph Marvin.', message: 'Will definitely work again...', time: '15:40', unread: 0, avatar: { type: 'letter', text: 'J', bg: '#c7d2fe', color: '#111827' } },
  { id: '8', name: 'Melissa Ford', message: 'Plumbing big milestones...', time: '14:22', unread: 0, avatar: { type: 'letter', text: 'M', bg: '#d1d5db', color: '#111827' } },
];

const TabButton = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={styles.tabBtn}>
    <Text weight={700} style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    {active ? <View style={styles.tabUnderline} /> : null}
  </Pressable>
);

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

const ChatItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={({ pressed }) => [styles.itemRow, pressed && { opacity: 0.9 }]}
      onPress={() => navigation.navigate('ChatRoom', { chat: item })}
    >
      <Avatar avatar={item.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text weight={700} style={{ color: '#111827', fontSize: 15 }} numberOfLines={1}>{item.name}</Text>
        <Text style={{ color: '#374151', marginTop: 2 }} numberOfLines={1}>{item.message}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.time}</Text>
        {item.unread ? (
          <View style={styles.unreadDot}>
            <Text weight={700} style={{ fontSize: 12, color: '#fff' }}>{String(item.unread)}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const SeekerChatScreen = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const data = useMemo(() => (activeTab === 'chats' ? mockChats : []), [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text weight={700} style={styles.headerTitle}>Messages</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="search" size={22} color="#374151" style={{ marginRight: 16 }} />
          <Ionicons name="ellipsis-horizontal" size={22} color="#374151" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton label="Chats" active={activeTab === 'chats'} onPress={() => setActiveTab('chats')} />
        <TabButton label="Calls" active={activeTab === 'calls'} onPress={() => setActiveTab('calls')} />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  headerTitle: { color: '#111827', fontSize: 18 },
  tabsRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 6, paddingBottom: 8 },
  tabBtn: { marginRight: 20, paddingVertical: 6 },
  tabLabel: { color: '#374151' },
  tabLabelActive: { color: '#111827' },
  tabUnderline: { height: 3, backgroundColor: '#f5c518', marginTop: 6, borderRadius: 2 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { marginTop: 6, backgroundColor: '#2563eb', minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});

export default SeekerChatScreen;
