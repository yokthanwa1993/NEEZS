import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import * as authApi from '../../shared/services/authApi';
import { useEmployerAuth } from '../contexts/EmployerAuthContext';

const Row = ({ icon, label, value, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.row}> 
    <View style={styles.rowIconBox}>
      <Ionicons name={icon} size={18} color="#111827" />
    </View>
    <Text weight={700} style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
  </TouchableOpacity>
);

const EmployerProfileScreen = ({ navigation }) => {
  const { user } = useEmployerAuth();
  const name = user?.displayName || 'ธุรกิจของฉัน';
  const email = user?.email || 'ไม่ระบุ';
  const photo = user?.photoURL || 'https://i.pravatar.cc/120?img=4';

  const onLogout = () => {
    Alert.alert('ออกจากระบบ', 'ต้องการออกจากระบบหรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: async () => { await authApi.logout(); },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text weight={700} style={styles.headerTitle}>โปรไฟล์ธุรกิจ</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('EmployerCompanyInfo') }>
          <Ionicons name="pencil" size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Company card */}
      <View style={styles.card}> 
        <Image source={{ uri: photo }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text weight={700} style={styles.name}>{name}</Text>
          <Text style={styles.sub}>{email}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}> 
        <Row icon="business-outline" label="ข้อมูลบริษัท" value="ดู/แก้ไข" onPress={() => navigation.navigate('EmployerCompanyInfo')} />
        <Row icon="document-text-outline" label="นโยบาย/ใบกำกับ" value="ตั้งค่า" onPress={() => navigation.navigate('EmployerPolicyInvoice')} />
        <Row icon="card-outline" label="การชำระเงิน" value="ตั้งค่า" onPress={() => navigation.navigate('EmployerPaymentSettings')} />
      </View>

      <View style={styles.section}> 
        <Row icon="lock-closed-outline" label="เปลี่ยนรหัสผ่าน" value="" onPress={() => navigation.navigate('EmployerChangePassword')} />
        <Row icon="notifications-outline" label="การแจ้งเตือน" value="จัดการ" onPress={() => navigation.navigate('EmployerNotificationSettings')} />
      </View>

      {/* Danger zone */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="exit-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text weight={700} style={{ color: '#fff' }}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 22, color: '#111827' },
  iconBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, padding: 14, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb' },
  name: { fontSize: 20, color: '#111827' },
  sub: { color: '#6b7280', marginTop: 2, fontSize: 15 },
  section: { backgroundColor: '#fff', marginTop: 14, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  rowIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { color: '#111827', flex: 1, fontSize: 17 },
  rowValue: { color: '#6b7280', marginRight: 8, fontSize: 15 },
  logoutBtn: { marginTop: 20, marginHorizontal: 20, backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
});

export default EmployerProfileScreen;
