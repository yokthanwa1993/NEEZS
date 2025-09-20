import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation } from '@react-navigation/native';

const fmtBaht = (n = 0) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n);

const transactions = [
  { id: 't1', type: 'in', title: 'งานพิเศษ Bean & Brew', amount: 1450, time: 'วันนี้ 14:22' },
  { id: 't2', type: 'out', title: 'โอนออก', amount: -500, time: 'เมื่อวาน 12:10' },
  { id: 't3', type: 'in', title: 'งานพาร์ทไทม์ Im-Suk', amount: 3000, time: '2 วันก่อน' },
];

const WalletScreen = () => {
  const navigation = useNavigation();
  const balance = 7450;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={700} style={{ fontSize: 18, color: '#111827' }}>กระเป๋าเงิน</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={{ color: '#6b7280' }}>ยอดคงเหลือ</Text>
        <Text weight={700} style={{ fontSize: 28, color: '#111827', marginTop: 6 }}>{fmtBaht(balance)}</Text>
      </View>

      <Text weight={700} style={{ fontSize: 16, color: '#111827', paddingHorizontal: 16, marginTop: 10 }}>รายการล่าสุด</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.txnRow}>
            <View style={[styles.iconCircle, { backgroundColor: item.type === 'in' ? '#dcfce7' : '#fee2e2' }]}> 
              <Ionicons name={item.type === 'in' ? 'arrow-down' : 'arrow-up'} size={18} color={item.type === 'in' ? '#16a34a' : '#ef4444'} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text weight={700} style={{ color: '#111827' }}>{item.title}</Text>
              <Text style={{ color: '#6b7280', marginTop: 2 }}>{item.time}</Text>
            </View>
            <Text weight={700} style={{ color: item.type === 'in' ? '#16a34a' : '#ef4444' }}>{fmtBaht(item.amount)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  balanceCard: { margin: 16, backgroundColor: '#f8fafc', borderRadius: 16, padding: 16 },
  txnRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});

export default WalletScreen;

