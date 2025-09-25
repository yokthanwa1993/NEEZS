import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import * as userApi from '../../shared/services/userApi';

export default function EmployerPolicyInvoiceScreen({ navigation }) {
  const [taxId, setTaxId] = useState('');
  const [invoiceName, setInvoiceName] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [policy, setPolicy] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await userApi.upsertUser({ taxId, invoiceName, invoiceAddress, policy });
      Alert.alert('บันทึกแล้ว', 'อัปเดตนโยบาย/ใบกำกับเรียบร้อย');
      navigation.goBack();
    } catch (e) { Alert.alert('ผิดพลาด', e?.message || 'บันทึกไม่สำเร็จ'); } finally { setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </Pressable>
        <Text weight={700} style={styles.title}>นโยบาย/ใบกำกับ</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>เลขผู้เสียภาษี</Text>
        <TextInput style={styles.input} value={taxId} onChangeText={setTaxId} keyboardType="numbers-and-punctuation" placeholder="xxx-xxxx-xxxxx" placeholderTextColor="#94a3b8" />
        <Text style={styles.label}>ชื่อออกใบกำกับ</Text>
        <TextInput style={styles.input} value={invoiceName} onChangeText={setInvoiceName} placeholder="ชื่อบริษัท/บุคคล" placeholderTextColor="#94a3b8" />
        <Text style={styles.label}>ที่อยู่ออกใบกำกับ</Text>
        <TextInput style={[styles.input, { height: 92 }]} multiline value={invoiceAddress} onChangeText={setInvoiceAddress} placeholder="ที่อยู่ตามเอกสาร" placeholderTextColor="#94a3b8" />
        <Text style={styles.label}>นโยบาย</Text>
        <TextInput style={[styles.input, { height: 120 }]} multiline value={policy} onChangeText={setPolicy} placeholder="นโยบายการคืนเงิน/การจ้างงาน ฯลฯ" placeholderTextColor="#94a3b8" />

        <Pressable onPress={onSave} disabled={saving} style={[styles.saveBtn, saving && { opacity: 0.6 }]}>
          <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text weight={700} style={{ color: '#fff' }}>บันทึก</Text>
        </Pressable>
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

