import React, { useState } from 'react';
import { View, StyleSheet, Switch, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import * as userApi from '../../shared/services/userApi';

export default function EmployerNotificationSettingsScreen({ navigation }) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);

  const onSave = async () => {
    try {
      await userApi.upsertUser({ notif: { push, email, sms } });
      Alert.alert('บันทึกแล้ว', 'ตั้งค่าการแจ้งเตือนเรียบร้อย');
      navigation.goBack();
    } catch (e) { Alert.alert('ผิดพลาด', e?.message || 'บันทึกไม่สำเร็จ'); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}><Ionicons name="chevron-back" size={20} color="#111827" /></Pressable>
        <Text weight={700} style={styles.title}>การแจ้งเตือน</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={{ padding: 16 }}>
        <View style={styles.row}><Text weight={700} style={styles.label}>Push</Text><Switch value={push} onValueChange={setPush} /></View>
        <View style={styles.row}><Text weight={700} style={styles.label}>อีเมล</Text><Switch value={email} onValueChange={setEmail} /></View>
        <View style={styles.row}><Text weight={700} style={styles.label}>SMS</Text><Switch value={sms} onValueChange={setSms} /></View>

        <Pressable onPress={onSave} style={styles.saveBtn}><Text weight={700} style={{ color: '#fff' }}>บันทึก</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  title: { color: '#111827', fontSize: 18 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  label: { color: '#111827' },
  saveBtn: { marginTop: 16, backgroundColor: '#FFA500', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
});

