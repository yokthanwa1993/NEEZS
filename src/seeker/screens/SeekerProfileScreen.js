import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Share, Linking } from 'react-native';
import * as authService from '../../shared/services/authService';

const fmtBaht = (n = 0) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n);

const SeekerProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const [bio, setBio] = useState('นักศึกษาจบใหม่ มีความสนใจในงานบริการและงานขาย มีความกระตือรือร้นและพร้อมเรียนรู้งาน');
  const displayName = user?.displayName || 'โปรไฟล์';
  const email = user?.email || 'ไม่ระบุ';
  const phone = user?.phoneNumber || 'ไม่ระบุ';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: user?.photoURL || 'https://i.pravatar.cc/120' }}
          style={styles.avatar}
        />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text weight={700} style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>สมัครงาน</Text>
          </View>
          <View style={styles.statItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text weight={700} style={styles.statValue}>4.8</Text>
              <Ionicons name="star" size={18} color="#111827" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statLabel}>คะแนน</Text>
          </View>
          <View style={styles.statItem}>
            <Text weight={700} style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>บันทึก</Text>
          </View>
        </View>
      </View>

      {/* Name & Bio */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Text weight={700} style={styles.name}>{displayName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.bio}>{bio}</Text>
          <Pressable onPress={() => navigation.navigate('ProfileEdit', { bio, onUpdated: ({ bio: newBio }) => newBio && setBio(newBio) })}>
            <Ionicons name="pencil-outline" size={18} color="#94a3b8" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionButton, styles.actionPrimary]} onPress={() => navigation.navigate('ProfileEdit', { bio, onUpdated: ({ bio: newBio }) => newBio && setBio(newBio) })}> 
          <Text weight={700} style={styles.actionTextPrimary}>แก้ไขโปรไฟล์</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.actionSecondary]} onPress={async () => {
          const link = `https://neezs.app/u/${user?.uid || 'me'}`;
          try { await Share.share({ message: `โปรไฟล์ของฉัน ${displayName}\n${link}` }); } catch {}
        }}> 
          <Text weight={700} style={styles.actionTextSecondary}>แชร์โปรไฟล์</Text>
        </Pressable>
      </View>

      {/* Wallet Card */}
      <Pressable style={styles.card} onPress={() => navigation.navigate('Wallet')}> 
        <View style={styles.walletIconBox}>
          <Ionicons name="wallet-outline" size={26} color="#111827" />
        </View>
        <View style={{ flex: 1 }}>
          <Text weight={700} style={{ fontSize: 16, color: '#111827' }}>กระเป๋าเงิน</Text>
          <Text style={{ color: '#6b7280', marginTop: 2 }}>ดูยอดเงินและธุรกรรม</Text>
        </View>
        <Text weight={700} style={{ fontSize: 18, color: '#111827', marginRight: 8 }}>{fmtBaht(7450)}</Text>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </Pressable>

      {/* Tabs row (favorites / gallery / jobs / profile) */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tabItem, activeTab==='fav' && styles.tabItemActive]} onPress={() => setActiveTab('fav')}>
          <Ionicons name="star-outline" size={24} color={activeTab==='fav'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='gallery' && styles.tabItemActive]} onPress={() => setActiveTab('gallery')}>
          <Ionicons name="image-outline" size={24} color={activeTab==='gallery'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='jobs' && styles.tabItemActive]} onPress={() => setActiveTab('jobs')}>
          <Ionicons name="briefcase-outline" size={24} color={activeTab==='jobs'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='profile' && styles.tabItemActive]} onPress={() => setActiveTab('profile')}>
          <Ionicons name="person" size={24} color={activeTab==='profile'? '#111827':'#6b7280'} />
        </Pressable>
      </View>

      {/* Content for tabs (ตัวอย่างอย่างง่าย) */}
      {activeTab !== 'profile' ? (
        <View style={{ paddingHorizontal: 20 }}>
          {activeTab === 'fav' && <Text style={{ color: '#6b7280' }}>ยังไม่มีรายการโปรด</Text>}
          {activeTab === 'gallery' && <Text style={{ color: '#6b7280' }}>ยังไม่มีรูปภาพ</Text>}
          {activeTab === 'jobs' && <Text style={{ color: '#6b7280' }}>ยังไม่มีประวัติงานของคุณ</Text>}
        </View>
      ) : null}

      {/* Contact */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text weight={700} style={{ fontSize: 18, color: '#111827' }}>ข้อมูลการติดต่อ</Text>

        <View style={styles.infoCard}>
          <Pressable style={styles.infoRow} onPress={() => email !== 'ไม่ระบุ' && Linking.openURL(`mailto:${email}`)}>
            <Ionicons name="mail-outline" size={18} color="#6b7280" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.infoLabel}>อีเมล</Text>
              <Text weight={700} style={styles.infoValue}>{email}</Text>
            </View>
          </Pressable>
          <Pressable style={[styles.infoRow, { marginTop: 18 }]} onPress={() => phone !== 'ไม่ระบุ' && Linking.openURL(`tel:${phone.replace(/\s/g,'')}`)}>
            <Ionicons name="call-outline" size={18} color="#6b7280" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.infoLabel}>เบอร์โทรศัพท์</Text>
              <Text weight={700} style={styles.infoValue}>{phone}</Text>
            </View>
          </Pressable>
        </View>

        <Text weight={700} style={{ fontSize: 18, color: '#111827', marginTop: 20 }}>บัญชีที่เชื่อมต่อ</Text>

        {/* ตัวอย่างรายการบัญชีที่เชื่อมต่อ */}
        <View style={styles.linkedBox}>
          <View style={styles.linkedRow}>
            <View style={[styles.linkedIcon, { backgroundColor: '#22c55e' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#ffffff" />
            </View>
            <Text weight={700} style={{ color: '#111827', flex: 1 }}>LINE</Text>
            <Text weight={700} style={{ color: '#16a34a' }}>เชื่อมต่อแล้ว</Text>
          </View>
          <View style={[styles.linkedRow, { marginTop: 14 }]}> 
            <View style={[styles.linkedIcon, { backgroundColor: '#e5e7eb' }]}>
              <Ionicons name="logo-google" size={18} color="#111827" />
            </View>
            <Text weight={700} style={{ color: '#111827', flex: 1 }}>Google</Text>
            <Text weight={700} style={{ color: '#f5c518' }}>เชื่อมต่อ</Text>
          </View>
        </View>

        {/* ปุ่ม Logout แบบเต็มกว้าง */}
        <Pressable
          onPress={() =>
            Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
              { text: 'ยกเลิก', style: 'cancel' },
              {
                text: 'ออกจากระบบ',
                style: 'destructive',
                onPress: async () => {
                  await authService.signOutUser();
                },
              },
            ])
          }
          style={styles.logoutWide}
        >
          <Ionicons name="exit-outline" size={22} color="#ffffff" style={{ marginRight: 10 }} />
          <Text weight={700} style={{ color: '#ffffff', fontSize: 18 }}>Logout</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 24 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, alignItems: 'center' },
  avatar: { width: 88, height: 88, borderRadius: 44, marginRight: 16 },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  statValue: { fontSize: 24, color: '#111827' },
  statLabel: { color: '#6b7280', marginTop: 2 },
  name: { fontSize: 24, color: '#111827', marginTop: 6 },
  bio: { color: '#475569', marginTop: 8, flex: 1, lineHeight: 20 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 14 },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionPrimary: { backgroundColor: '#f5c518', marginRight: 10 },
  actionSecondary: { backgroundColor: '#f3f4f6', marginLeft: 10 },
  actionTextPrimary: { color: '#111827' },
  actionTextSecondary: { color: '#111827' },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  tabItem: { paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#111827' },
  infoCard: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { color: '#6b7280' },
  infoValue: { color: '#111827', marginTop: 2 },
  linkedBox: { marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 16, padding: 16 },
  linkedRow: { flexDirection: 'row', alignItems: 'center' },
  linkedIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoutWide: { marginTop: 16, backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
});

export default SeekerProfileScreen;
