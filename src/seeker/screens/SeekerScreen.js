import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, H1, H2, MediumText } from '../../shared/components/Typography';
import FilterPill from '../components/FilterPill';
import JobCard from '../components/JobCard';
import SectionHeader from '../../shared/components/SectionHeader';
import { jobCategories, seekerJobs } from '../../shared/data/mockData';
import * as authApi from '../../shared/services/authApi';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';

const SeekerScreen = ({ navigation }) => {
  const { user } = useSeekerAuth();
  const { width } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const banners = [
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  ];
  const [bannerIdx, setBannerIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = useMemo(() => ['All', ...jobCategories], []);

  const handleSignOut = async () => {
    Alert.alert(
      'ออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: async () => {
            await authApi.logout();
          },
        },
      ]
    );
  };

  const filteredJobs = useMemo(() => {
    if (selectedCategory === 'All') {
      return seekerJobs;
    }
    return seekerJobs.filter((job) => job.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.safeArea}>
      {/* Status bar overlays on top of the orange header */}
      <StatusBar hidden={false} translucent backgroundColor="transparent" style="light" />
      <FlatList
        contentInsetAdjustmentBehavior="never"
        style={styles.container}
        data={filteredJobs}
          keyExtractor={(job) => job.id}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={() => (
            <View>
              {/* Header gradient style ตามตัวอย่าง */}
              <View style={styles.headerWrap}>
                <LinearGradient
                  colors={["#ff6a00", "#ff8c39"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  // push content below the notch while letting the orange color
                  // extend to the very top behind the status bar
                  style={[
                    styles.headerGradient,
                    { paddingTop: insets.top + 12 },
                  ]}
                >
                  {/* Welcome row */}
                  <View style={styles.welcomeRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Image
                        source={{ uri: user?.photoURL || 'https://i.pravatar.cc/100?img=12' }}
                        style={styles.avatar}
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.welcomeSmall}>Welcome Back!</Text>
                        <Text weight={800} style={styles.welcomeName}>{user?.displayName || 'Jassica maria'} 👋</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.bellBtn} onPress={() => Alert.alert('แจ้งเตือน', 'เปิดการแจ้งเตือน')}>
                      <Ionicons name="notifications-outline" size={18} color="#111827" />
                    </TouchableOpacity>
                  </View>

                  {/* Search field */}
                  <View style={[styles.searchField, { borderColor: 'transparent' }]}> 
                    <Ionicons name="search" size={18} color="#9ca3af" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 8, color: '#111827' }}
                      placeholder="Opportunity Title, Creator, Aggregator"
                      placeholderTextColor="#9ca3af"
                      returnKeyType="search"
                    />
                  </View>
                  {/* quick actions removed per request */}
                </LinearGradient>
              </View>

              {/* Promo solid brand card */}
              <View style={[styles.promoCard, { marginTop: 12, backgroundColor: '#FFA500' }]}>
                <View style={{ flex: 1 }}>
                  <Text weight={800} style={{ color: '#ffffff', fontSize: 20 }}>หางานให้เจอเร็วขึ้น!</Text>
                  <Text style={{ color: '#ffffff', opacity: 0.95, marginTop: 6 }}>ดูเคล็ดลับสมัครงานและจัด{`\n`}โปรไฟล์ให้โดน</Text>
                  <TouchableOpacity style={styles.promoBtn}>
                    <Text weight={700} style={{ color: '#111827' }}>อ่านเพิ่ม</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop' }}
                  style={styles.promoImage}
                />
              </View>

              {/* Recommendation */}
              <SectionHeader title="งานแนะนำ" actionLabel="ดูทั้งหมด" onActionPress={() => setSelectedCategory('All')} />
              {seekerJobs[0] && <JobCard job={seekerJobs[0]} />}

              {/* Recent Jobs */}
              <SectionHeader title="งานล่าสุด" actionLabel="ดูทั้งหมด" onActionPress={() => setSelectedCategory('All')} />
              {false && (
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillRow}
                  renderItem={({ item }) => (
                    <FilterPill
                      label={item === 'All' ? 'ทั้งหมด' : item}
                      active={item === selectedCategory}
                      onPress={() => setSelectedCategory(item)}
                    />
                  )}
                />
              )}
            </View>
          )}
          renderItem={({ item }) => <JobCard job={item} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>ยังไม่มีงาน</Text>
              <Text style={styles.emptySubtitle}>ลองเปลี่ยนหมวดหมู่หรือกลับมาดูใหม่อีกครั้ง</Text>
            </View>
          )}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Kept the original background for the list content
  },
  contentContainer: {
    padding: 20,
    // ลด padding ด้านล่างเพื่อไม่ให้เกิดช่องว่างเหนือแท็บบาร์
    paddingBottom: 16,
  },
  // ทำให้ส่วนหัวเต็มจอแบบไร้ขอบซ้าย/ขวา ด้วยการลบ padding ของ container ออกชั่วคราว
  headerWrap: { marginHorizontal: -20, marginTop: -20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', marginBottom: 12 },
  headerGradient: { paddingVertical: 12, paddingHorizontal: 16 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ffffff88' },
  welcomeSmall: { color: '#ffffff', opacity: 0.9 },
  welcomeName: { color: '#ffffff', fontSize: 18 },
  bellBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#fff' },
  searchField: { flex: 1, flexDirection: 'row', alignItems:'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginHorizontal: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  iconBtnClear: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  quickBar: { marginTop: 12, backgroundColor: '#FFA500', borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-around' },
  quickItem: { alignItems: 'center' },
  quickText: { color: '#fff', marginTop: 6 },
  bannerCard: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 14, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  bannerImage: { width: '100%', height: '100%' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4, marginBottom: 6 },
  dot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e5e7eb', marginHorizontal: 3 },
  dot2Active: { backgroundColor: '#FFA500' },
  promoCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 16 },
  promoBtn: { backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginTop: 12, alignSelf: 'flex-start' },
  promoImage: { width: 110, height: 110, borderRadius: 12, marginLeft: 12 },
  pillRow: {
    paddingVertical: 8,
    marginBottom: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#1f2937',
  },
  emptySubtitle: {
    marginTop: 8,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default SeekerScreen;
