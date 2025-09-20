import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useRoute, useNavigation } from '@react-navigation/native';

const initialMessages = [
  { id: 'm1', text: 'Hello! How are you?', time: '16:00', me: false },
  { id: 'm2', text: 'I am good, thank you! How about you?', time: '16:01', me: true },
  { id: 'm3', text: 'I am doing well, just working on a project.', time: '16:02', me: false },
  { id: 'm4', text: 'That sounds interesting. What is the project about?', time: '16:03', me: true },
  { id: 'm5', text: 'It is a chat app. I am working on the messaging feature.', time: '16:04', me: false },
];

const Bubble = ({ msg }) => {
  const isMe = msg.me;
  return (
    <View style={[styles.bubbleRow, { justifyContent: isMe ? 'flex-end' : 'flex-start' }]}> 
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}> 
        <Text style={[styles.bubbleText, isMe && { color: '#ffffff' }]}>{msg.text}</Text>
        <View style={styles.timeRow}> 
          <Text style={styles.timeText}>{msg.time}</Text>
          {isMe ? <Ionicons name="checkmark-done" size={14} color="#cbd5f5" style={{ marginLeft: 4 }} /> : null}
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

  const title = useMemo(() => chat?.name || 'Message', [chat?.name]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={700} style={styles.headerTitle}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="call-outline" size={20} color="#6b7280" style={{ marginRight: 16 }} />
          <Ionicons name="duplicate-outline" size={20} color="#6b7280" />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Bubble msg={item} />}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 14 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Composer */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <View style={styles.composer}> 
          <Ionicons name="mic-outline" size={22} color="#6b7280" style={{ marginHorizontal: 8 }} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type here"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            multiline
          />
          <Ionicons name="camera-outline" size={22} color="#6b7280" style={{ marginHorizontal: 8 }} />
          <Pressable onPress={onSend} hitSlop={10}>
            <Ionicons name="send" size={22} color="#111827" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  headerTitle: { color: '#111827', fontSize: 18 },
  bubbleRow: { paddingVertical: 6, flexDirection: 'row' },
  bubble: { maxWidth: '82%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  bubbleOther: { backgroundColor: '#f1f5f9', marginRight: '18%' },
  bubbleMe: { backgroundColor: '#2563eb', marginLeft: '18%' },
  bubbleText: { color: '#111827' },
  timeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
  timeText: { color: '#6b7280', fontSize: 12 },
  composer: { backgroundColor: '#f3f4f6', marginHorizontal: 10, marginBottom: 10, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  input: { flex: 1, color: '#111827', paddingVertical: 6 },
});

export default ChatRoomScreen;
