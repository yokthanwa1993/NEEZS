import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../shared/components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as userApi from '../../shared/services/userApi';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState(route.params?.displayName || '');
  const [bio, setBio] = useState(route.params?.bio || '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      await userApi.upsertUser({ displayName: name, bio });
      // ส่ง bio กลับไปที่หน้าโปรไฟล์เพื่ออัปเดต UI
      navigation.navigate('MainTabs');
      navigation.emit({ type: 'setParams', target: navigation.getState()?.routes?.find(r => r.name === 'MainTabs')?.key, data: {} });
      navigation.goBack();
      route.params?.onUpdated?.({ bio });
      Alert.alert('บันทึกแล้ว', 'อัปเดตโปรไฟล์เรียบร้อย');
    } catch (e) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกได้');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={700} style={{ fontSize: 18, color: '#111827' }}>แก้ไขโปรไฟล์</Text>
        <Pressable onPress={onSave} hitSlop={10}>
          <Ionicons name="checkmark" size={24} color={saving ? '#9ca3af' : '#111827'} />
        </Pressable>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.label}>ชื่อที่แสดง</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="ชื่อของคุณ"
          placeholderTextColor="#9ca3af"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>แนะนำตัว (Bio)</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="เล่าเกี่ยวกับตัวคุณ"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  label: { color: '#6b7280', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#111827', backgroundColor: '#fff' },
});

export default ProfileEditScreen;
