import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useRoute, useNavigation } from '@react-navigation/native';

const initialMessages = [
  { id: 'm1', text: 'สวัสดีครับ สบายดีไหม?', time: '16:00', me: false },
  { id: 'm2', text: 'สบายดีครับ ขอบคุณ แล้วทางคุณล่ะ?', time: '16:01', me: true },
  { id: 'm3', text: 'สบายดีครับ กำลังทำโปรเจ็กต์อยู่พอดี', time: '16:02', me: false },
  { id: 'm4', text: 'น่าสนใจ โปรเจ็กต์เกี่ยวกับอะไรครับ?', time: '16:03', me: true },
  { id: 'm5', text: 'เป็นแอปแชท กำลังทำฟีเจอร์ข้อความอยู่ครับ', time: '16:04', me: false },
];

const BRAND = '#f5c518';
const LIGHT = '#FEF9C3';

const Bubble = ({ msg, avatar }) => {
  const isMe = msg.me;
  return (
    <View style={[styles.bubbleRow, { justifyContent: isMe ? 'flex-end' : 'flex-start' }]}> 
      {/* Avatar for other side */}
      {!isMe ? (
        avatar?.type === 'image' ? (
          <Image source={{ uri: avatar.src }} style={styles.msgAvatar} />
        ) : (
          <View style={[styles.msgAvatar, { backgroundColor: '#e5e7eb' }]} />
        )
      ) : null}

      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}> 
        <Text style={[styles.bubbleText, isMe && { color: '#ffffff' }]}>{msg.text}</Text>
        <View style={styles.timeRow}> 
          <Text style={[styles.timeText, isMe && { color: '#fef3c7' }]}>{msg.time}</Text>
          {isMe ? <Ionicons name="checkmark-done" size={14} color="#fde68a" style={{ marginLeft: 4 }} /> : null}
        </View>
      </View>
    </View>
  );
};

const ChatRoomScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const chat = route.params?.chat;
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const listRef = useRef(null);

  const onSend = () => {
    if (!text.trim()) return;
    const newMsg = { id: String(Date.now()), text: text.trim(), time: new Date().toTimeString().slice(0, 5), me: true };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 0);
  };

  const title = useMemo(() => chat?.name || 'แชท', [chat?.name]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.headerCenter}>
          {chat?.avatar?.type === 'image' ? (
            <Image source={{ uri: chat.avatar.src }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, { backgroundColor: '#e5e7eb' }]} />
          )}
          <View style={{ marginLeft: 8 }}>
            <Text weight={700} style={styles.headerTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.onlineDot} />
              <Text style={{ color: '#16a34a', fontSize: 12 }}>ออนไลน์</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="call-outline" size={20} color="#6b7280" style={{ marginRight: 16 }} />
          <Ionicons name="ellipsis-vertical" size={18} color="#6b7280" />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Bubble msg={item} avatar={chat?.avatar} />}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 14 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Composer */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <View style={styles.composerRow}> 
          <View style={styles.composerBox}>
            <Ionicons name="mic-outline" size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="พิมพ์ข้อความ"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              multiline
            />
            <Ionicons name="camera-outline" size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
          </View>
          <Pressable onPress={onSend} hitSlop={10} style={styles.sendFab}>
            <Ionicons name="send" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 8 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a', marginRight: 6 },
  headerTitle: { color: '#111827', fontSize: 16 },
  bubbleRow: { paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  bubbleOther: { backgroundColor: LIGHT, marginLeft: 6, marginRight: '18%' },
  bubbleMe: { backgroundColor: BRAND, marginLeft: '18%' },
  bubbleText: { color: '#111827' },
  timeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
  timeText: { color: '#6b7280', fontSize: 12 },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 6 },
  composerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10 },
  composerBox: { backgroundColor: '#ffffff', flex: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  input: { flex: 1, color: '#111827', paddingVertical: 6 },
  sendFab: { marginLeft: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
});

export default ChatRoomScreen;
