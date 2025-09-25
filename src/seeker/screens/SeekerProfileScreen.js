import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { useNavigation } from '@react-navigation/native';
import { Share, Linking } from 'react-native';
import * as authApi from '../../shared/services/authApi';

const fmtBaht = (n = 0) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n);

// helper: เติมรูป placeholder เมื่อยังไม่มีรูปครบ
const fillThumbs = (arr = []) => {
  const placeholders = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
  ];
  const out = [...(arr || [])];
  while (out.length < 3) out.push(placeholders[out.length % placeholders.length]);
  return out;
};

const favoritesMock = [
  { id: 'f1', title: 'พนักงานร้านกาแฟ (Part-time)', place: 'Bean & Brew', pay: '฿60/ชม.' },
  { id: 'f2', title: 'แคชเชียร์', place: 'MiniMart', pay: '฿15,000/เดือน' },
  { id: 'f3', title: 'เสิร์ฟอาหาร', place: 'Happy Bistro', pay: '฿65/ชม.' },
];

const galleryMock = [
  'https://images.unsplash.com/photo-1520975954732-35dd222996f9?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975954732-35dd222996f9?q=80&w=600&auto=format&fit=crop',
];

// Work history (ประวัติการทำงานทั้งหมด – mock)
const workHistory = [
  {
    id: 'w1',
    company: 'Bean & Brew',
    role: 'บาริสต้า (Part-time)',
    period: 'ม.ค. 2025 – ปัจจุบัน',
    location: 'สยาม กรุงเทพฯ',
    description:
      'ชงกาแฟ/เครื่องดื่ม ดูแลลูกค้า หน้าบาร์ และช่วยคิดเมนูพิเศษประจำเดือน พร้อมถ่ายรูปโปรโมตลงเพจร้าน',
    highlights: ['ชงกาแฟ', 'บริการลูกค้า', 'คิดสูตร', 'ถ่ายภาพ'],
    images: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'w2',
    company: 'Happy Bistro',
    role: 'พนักงานเสิร์ฟ (ชั่วคราว)',
    period: 'มี.ค. 2024 – ธ.ค. 2024',
    location: 'ลาดพร้าว กรุงเทพฯ',
    description:
      'รับออเดอร์ จัดเสิร์ฟ ดูแลความสะอาดโต๊ะ และช่วยงานหน้าร้านช่วงเทศกาล คนเยอะ',
    highlights: ['บริการลูกค้า', 'ทำงานเป็นทีม', 'จัดการเวลา'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop',
    ],
  },
];

// Portfolio sample items (mock)
const portfolioItems = [
  {
    id: 'p1',
    title: 'ออกแบบเมนูคาเฟ่ + ถ่ายภาพ',
    role: 'นักออกแบบ/ช่างภาพ',
    org: 'Bean & Brew',
    period: 'ก.พ. 2025',
    description: 'ออกแบบเมนูใหม่ให้คาเฟ่ พร้อมถ่ายภาพเมนูจริงสำหรับใช้งานบนสื่อออนไลน์และโปสเตอร์ที่ร้าน',
    isPublic: true,
    images: [
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop',
    ],
    skills: ['ถ่ายภาพ', 'ตกแต่งภาพ', 'ออกแบบเมนู'],
  },
  {
    id: 'p2',
    title: 'บาริสต้า – เซ็ตเครื่องดื่มเมนูพิเศษ',
    role: 'บาริสต้า',
    org: 'Happy Bistro',
    period: 'ม.ค. 2025',
    description: 'คิดสูตรและจัดวางเครื่องดื่มเมนูพิเศษประจำเดือน พร้อมถ่ายรูปโปรโมต',
    isPublic: true,
    images: [
      'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    ],
    skills: ['ชงกาแฟ', 'คิดสูตร', 'บริการลูกค้า'],
  },
];

const reviewsMock = [
  {
    id: 'r1',
    author: 'ร้าน Bean & Brew',
    rating: 5,
    text: 'ขยัน ตั้งใจ เรียนรู้งานเร็ว สื่อสารดีมาก',
    time: '2 วันที่แล้ว',
    avatar: 'https://i.pravatar.cc/100?img=12',
    photos: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'r2',
    author: 'Happy Bistro',
    rating: 4,
    text: 'บริการดี พึ่งพาได้ ตรงเวลา',
    time: 'สัปดาห์ก่อน',
    avatar: 'https://i.pravatar.cc/100?img=32',
    photos: [
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop',
    ],
  },
];

const SeekerProfileScreen = () => {
  const { user } = useSeekerAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const [history, setHistory] = useState(workHistory);
  const [bio, setBio] = useState('นักศึกษาจบใหม่ มีความสนใจในงานบริการและงานขาย มีความกระตือรือร้นและพร้อมเรียนรู้งาน');
  const displayName = user?.displayName || 'โปรไฟล์';
  const email = user?.email || 'ไม่ระบุ';
  const phone = user?.phoneNumber || 'ไม่ระบุ';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: user?.photoURL || `https://i.pravatar.cc/120?u=${user?.uid || 'anon'}` }}
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
          <Pressable onPress={() => navigation.navigate('ProfileEdit', { bio, displayName, onUpdated: ({ bio: newBio }) => newBio && setBio(newBio) })}>
            <Ionicons name="pencil-outline" size={18} color="#94a3b8" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionButton, styles.actionPrimary]} onPress={() => navigation.navigate('ProfileEdit', { bio, displayName, onUpdated: ({ bio: newBio }) => newBio && setBio(newBio) })}> 
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

      {/* Tabs row (reviews / favorites / gallery / profile) */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tabItem, activeTab==='reviews' && styles.tabItemActive]} onPress={() => setActiveTab('reviews')}>
          <Ionicons name="star-outline" size={24} color={activeTab==='reviews'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='fav' && styles.tabItemActive]} onPress={() => setActiveTab('fav')}>
          <Ionicons name="albums-outline" size={24} color={activeTab==='fav'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='gallery' && styles.tabItemActive]} onPress={() => setActiveTab('gallery')}>
          <Ionicons name="image-outline" size={24} color={activeTab==='gallery'? '#111827':'#6b7280'} />
        </Pressable>
        <Pressable style={[styles.tabItem, activeTab==='profile' && styles.tabItemActive]} onPress={() => setActiveTab('profile')}>
          <Ionicons name="person" size={24} color={activeTab==='profile'? '#111827':'#6b7280'} />
        </Pressable>
      </View>

      {/* Tab contents */}
      {activeTab === 'profile' && (
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
              <Text weight={700} style={{ color: '#FFA500' }}>เชื่อมต่อ</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'fav' && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text weight={700} style={{ color: '#111827' }}>ผลงาน</Text>
            <Pressable style={styles.addBtn} onPress={() => Alert.alert('เพิ่มผลงาน', 'เชื่อมต่ออัปโหลดในขั้นต่อไป')}>
              <Ionicons name="add" size={18} color="#111827" />
              <Text weight={700} style={{ marginLeft: 6, color: '#111827' }}>เพิ่ม</Text>
            </Pressable>
          </View>

          {portfolioItems.map((p) => (
            <View key={p.id} style={styles.portCard}>
              {p.images?.[0] ? (
                <Image source={{ uri: p.images[0] }} style={styles.portCover} />
              ) : null}
              <View style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text weight={700} style={{ color: '#111827', fontSize: 16 }}>{p.title}</Text>
                  {p.isPublic ? (
                    <View style={styles.publicBadge}>
                      <Ionicons name="globe-outline" size={14} color="#111827" />
                      <Text weight={700} style={{ marginLeft: 6, color: '#111827', fontSize: 12 }}>สาธารณะ</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={{ color: '#6b7280', marginTop: 2 }}>{p.role} • {p.org}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                  <Text style={{ color: '#9ca3af', marginLeft: 6, fontSize: 12 }}>{p.period}</Text>
                </View>
                <Text style={{ color: '#374151', marginTop: 8 }} numberOfLines={3}>{p.description}</Text>

                {/* skills */}
                <View style={styles.pillsRow}>
                  {p.skills?.map((s) => (
                    <View key={s} style={styles.pill}><Text weight={700} style={{ color: '#111827', fontSize: 12 }}>{s}</Text></View>
                  ))}
                </View>

                {/* extra images */}
                {p.images?.length > 1 ? (
                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    {p.images.slice(1,4).map((src, i) => (
                      <Image key={i} source={{ uri: src }} style={styles.portThumb} />
                    ))}
                  </View>
                ) : null}

                {/* actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <Pressable style={styles.secondaryBtn} onPress={() => Alert.alert('แก้ไข', 'coming soon')}>
                    <Text weight={700} style={{ color: '#111827' }}>แก้ไข</Text>
                  </Pressable>
                  <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('PortfolioDetail', { item: p })}>
                    <Text weight={700} style={{ color: '#111827' }}>ดูรายละเอียด</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'gallery' && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <Text weight={700} style={{ color: '#111827', marginBottom: 8 }}>ประวัติการทำงาน</Text>
          {history.map((w) => (
            <View key={w.id} style={styles.whCard}>
              <View style={styles.whHeader}>
                <View style={styles.whIcon}><Ionicons name="briefcase-outline" size={18} color="#111827" /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text weight={700} style={{ color: '#111827', fontSize: 16 }}>{w.role}</Text>
                  <Text style={{ color: '#6b7280' }}>{w.company}</Text>
                </View>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{w.period}</Text>
              </View>
              <View style={styles.whMetaRow}>
                <Ionicons name="location-outline" size={14} color="#9ca3af" />
                <Text style={{ color: '#9ca3af', marginLeft: 6, fontSize: 12 }}>{w.location}</Text>
              </View>
              <Text style={{ color: '#374151', marginTop: 6 }}>{w.description}</Text>
              {/* images */}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {fillThumbs(w.images).slice(0,3).map((src, i) => (
                  <Image key={i} source={{ uri: src }} style={styles.whImage} />
                ))}
              </View>
              {/* highlights */}
              <View style={styles.pillsRow}>
                {w.highlights.map((h) => (
                  <View key={h} style={styles.pill}><Text weight={700} style={{ color: '#111827', fontSize: 12 }}>{h}</Text></View>
                ))}
              </View>
              {/* actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('WorkHistoryEdit', {
                      item: w,
                      onSave: (updated) => {
                        try {
                          setHistory((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
                        } catch {}
                      },
                    })}
                  >
                  <Text weight={700} style={{ color: '#111827' }}>แก้ไขประวัติ</Text>
                </Pressable>
                <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('PortfolioDetail', { item: w })}>
                  <Text weight={700} style={{ color: '#111827' }}>ดูรายละเอียด</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'reviews' && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          {reviewsMock.map((rv) => (
            <View key={rv.id} style={[styles.infoCard, { marginTop: 12 }]}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: rv.avatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text weight={700} style={{ color: '#111827' }}>{rv.author}</Text>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>{rv.time}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                {[1,2,3,4,5].map((i) => (
                  <Ionicons key={i} name={i <= rv.rating ? 'star' : 'star-outline'} size={16} color="#FFA500" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text style={{ color: '#374151', marginTop: 8 }}>{rv.text}</Text>
              {rv.photos?.length ? (
                <View style={styles.reviewImagesRow}>
                  {rv.photos.map((src, i) => (
                    <Image key={i} source={{ uri: src }} style={styles.reviewImage} />
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* Logout button at the end of content */}
      <Pressable
        onPress={() =>
          Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
            { text: 'ยกเลิก', style: 'cancel' },
            {
              text: 'ออกจากระบบ',
              style: 'destructive',
              onPress: async () => {
                await authApi.logout();
              },
            },
          ])
        }
        style={[styles.logoutWide, { marginHorizontal: 16 }]}
      >
        <Ionicons name="exit-outline" size={22} color="#ffffff" style={{ marginRight: 10 }} />
        <Text weight={700} style={{ color: '#ffffff', fontSize: 18 }}>Logout</Text>
      </Pressable>

      {/* Spacer to breathe above tab bar */}
      <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  // เว้นระยะเล็กน้อยท้ายหน้าสำหรับปุ่ม
  scrollContent: { paddingBottom: 8 },
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
  actionPrimary: { backgroundColor: '#FFA500', marginRight: 10 },
  actionSecondary: { backgroundColor: '#f3f4f6', marginLeft: 10 },
  actionTextPrimary: { color: '#ffffff' },
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
    backgroundColor: '#FFD28A',
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
    marginBottom: 8,
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
  logoutWide: { marginTop: 16, backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 0 },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  addTile: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD28A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewImagesRow: { flexDirection: 'row', marginTop: 10 },
  reviewImage: { width: 88, height: 88, borderRadius: 12, marginRight: 8 },
  // portfolio styles
  portCard: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', marginBottom: 14, overflow: 'hidden' },
  portCover: { width: '100%', height: 160 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD28A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  pill: { backgroundColor: '#f3f4f6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 6 },
  portThumb: { width: 72, height: 72, borderRadius: 10, marginRight: 8 },
  primaryBtn: { backgroundColor: '#FFD28A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  secondaryBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  // work history styles
  whCard: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', marginBottom: 14, padding: 12 },
  whHeader: { flexDirection: 'row', alignItems: 'center' },
  whIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  whMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  whImage: { width: 92, height: 92, borderRadius: 12, marginRight: 8 },
});

export default SeekerProfileScreen;
