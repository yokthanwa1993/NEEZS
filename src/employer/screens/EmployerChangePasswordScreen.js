import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { apiFetch } from '../../shared/services/apiClient';
import { useEmployerAuth } from '../contexts/EmployerAuthContext';

export default function EmployerChangePasswordScreen({ navigation }) {
  const { user } = useEmployerAuth();
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const provider = user?.provider || '';
  const disabled = provider !== 'password';

  const onSave = async () => {
    if (newPassword.length < 6) return Alert.alert('รหัสสั้นเกินไป', 'ต้องมีอย่างน้อย 6 ตัวอักษร');
    setSaving(true);
    try {
      await apiFetch('/auth/change-password', { method: 'POST', body: { new_password: newPassword } });
      Alert.alert('สำเร็จ', 'เปลี่ยนรหัสผ่านเรียบร้อย');
      navigation.goBack();
    } catch (e) { Alert.alert('ผิดพลาด', e?.message || 'ทำรายการไม่สำเร็จ'); } finally { setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </Pressable>
        <Text weight={700} style={styles.title}>เปลี่ยนรหัสผ่าน</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {disabled ? (
          <Text style={{ color: '#ef4444' }}>บัญชีนี้ล็อกอินผ่าน {provider || 'OAuth'} ไม่สามารถตั้งรหัสผ่านได้</Text>
        ) : (
          <>
            <Text style={styles.label}>รหัสผ่านใหม่</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="อย่างน้อย 6 ตัวอักษร" secureTextEntry placeholderTextColor="#94a3b8" />
            <Pressable onPress={onSave} disabled={saving} style={[styles.saveBtn, saving && { opacity: 0.6 }]}>
              <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text weight={700} style={{ color: '#fff' }}>บันทึก</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  title: { color: '#111827', fontSize: 18 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  label: { color: '#64748b', marginTop: 12 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#111827', marginTop: 6 },
  saveBtn: { marginTop: 16, backgroundColor: '#FFA500', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
});

