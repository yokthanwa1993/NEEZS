import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { employerJobs as seedJobs } from '../../shared/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

const BRAND = '#FFA500';

function getAvatarUris(seed, n = 4) {
  const base = String(seed || '')
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const size = Math.min(Math.max(n, 0), 4);
  return Array.from({ length: size }, (_, i) => `https://i.pravatar.cc/100?img=${((base + i) % 70) + 1}`);
}

const AvatarStack = ({ avatars = [], total = 0 }) => (
  <View style={styles.avatarStack}>
    {avatars.slice(0, 4).map((uri, idx) => (
      <Image key={idx} source={{ uri }} style={[styles.avatarBubble, { marginLeft: idx === 0 ? 0 : -12 }]} />
    ))}
    {total > avatars.length ? (
      <View style={[styles.avatarBubble, styles.moreBubble, { marginLeft: avatars.length ? -12 : 0 }]}>
        <Text weight={800} style={{ color: '#fff', fontSize: 12 }}>+{Math.max(total - avatars.length, 0)}</Text>
      </View>
    ) : null}
  </View>
);

const StatusPill = ({ status }) => {
  const map = {
    'เปิดรับ': { bg: '#22d3ee', color: '#0f172a' },
    'สัมภาษณ์': { bg: '#facc15', color: '#111827' },
    'ปิดรับ': { bg: '#cbd5e1', color: '#0f172a' },
  };
  const c = map[status] || { bg: '#94a3b8', color: '#0f172a' };
  return (
    <Text weight={700} style={[styles.statusPill, { backgroundColor: c.bg, color: c.color }]}>{status}</Text>
  );
};

const Chip = ({ label }) => (
  <View style={styles.chip}><Text weight={500} style={{ color: '#1e293b' }}>{label}</Text></View>
);

const gradients = {
  blue: ['#e0f2fe', '#c7e3ff'],
  green: ['#dcfce7', '#bbf7d0'],
  amber: ['#ffedd5', '#fed7aa'],
  indigo: ['#ede9fe', '#dbeafe'],
};

// Helpers: provide numeric time/date strings for display
function getWorkHoursText(job) {
  if (job?.workHours && /\d/.test(String(job.workHours))) return String(job.workHours);
  const guess = (job?.shifts || []).find((s) => /\d/.test(String(s || '')));
  if (guess) return String(guess);
  return '09:00-18:00';
}

function getEndAtText(job) {
  if (job?.endAt && /\d/.test(String(job.endAt))) return String(job.endAt);
  const now = new Date();
  const d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
}

const StatCard = ({ icon, label, value, color }) => {
  // pick gradient palette by color hue
  const pal =
    color === '#0ea5e9' ? gradients.blue :
    color === '#22c55e' ? gradients.green :
    color === '#FFA500' ? gradients.amber :
    gradients.indigo;
  return (
    <LinearGradient colors={pal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}> 
      <View style={[styles.statIconBox, { backgroundColor: '#ffffffaa' }]}> 
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text weight={900} style={{ color: '#0f172a', fontSize: 22 }}>{value}</Text>
        <Text style={{ color: '#334155', fontSize: 14 }}>{label}</Text>
      </View>
    </LinearGradient>
  );
};

const FilterTab = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={styles.filterTab}>
    <Text weight={700} style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
    {active ? <View style={styles.tabUnderline} /> : null}
  </Pressable>
);

const JobCard = ({ job, onViewApplicants, onToggleStatus, onEdit }) => (
  <View style={styles.newCard}>
    {/* Top row: avatar + title + bookmark */}
    <View style={styles.newHeaderRow}>
      <View style={{ flex: 1 }}>
        <Text weight={900} style={styles.newJobTitle}>{job.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.newSubMeta}>{' '}เวลางาน {getWorkHoursText(job)}</Text>
          <View style={{ width: 12 }} />
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text style={styles.newSubMeta}>{' '}สิ้นสุด {getEndAtText(job)}</Text>
          <View style={{ width: 12 }} />
          <Ionicons name="people-outline" size={14} color="#6b7280" />
          <Text style={styles.newSubMeta}> {job.applicants || 0} ผู้สมัคร</Text>
        </View>
      </View>
      <Pressable onPress={() => onEdit(job)} hitSlop={8}>
        <Ionicons name="bookmark-outline" size={20} color="#0f172a" />
      </Pressable>
    </View>

    {/* Tag pills */}
    <View style={styles.newTagsRow}>
      {job.shifts?.slice(0, 3).map((s) => (
        <View key={s} style={styles.tagPill}><Text style={styles.tagText}>{s}</Text></View>
      ))}
      <View style={[styles.tagPill, styles.statusTag]}>
        <Text style={[styles.tagText, { color: '#065F46' }]}>{job.status}</Text>
      </View>
    </View>

    {/* Notes */}
    {job.notes ? <Text style={styles.newNotes}>{job.notes}</Text> : null}

    {/* Footer */}
    <View style={styles.newFooterRow}>
      <Pressable onPress={() => onViewApplicants(job)} style={styles.viewBtn}>
        <Text weight={800} style={{ color: '#111827' }}>ดูผู้สมัคร</Text>
      </Pressable>
      <View style={styles.footerCenter}>
        <AvatarStack avatars={getAvatarUris(job.id, 4)} total={job.applicants || 0} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => onToggleStatus(job)} style={styles.ghostBtn}>
          <Ionicons name={job.status === 'ปิดรับ' ? 'play' : 'pause'} size={16} color="#111827" />
        </Pressable>
        <Pressable onPress={() => onEdit(job)} style={styles.ghostBtn}>
          <Ionicons name="create-outline" size={16} color="#111827" />
        </Pressable>
      </View>
    </View>
  </View>
);

const MyJobsScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('ทั้งหมด'); // ทั้งหมด | เปิดรับ | สัมภาษณ์ | ปิดรับ
  const [jobs, setJobs] = useState(seedJobs);

  const stats = useMemo(() => {
    const total = jobs.length;
    const open = jobs.filter(j => j.status === 'เปิดรับ').length;
    const interviewing = jobs.filter(j => j.status === 'สัมภาษณ์').length;
    const applicants = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);
    return { total, open, interviewing, applicants };
  }, [jobs]);

  const data = useMemo(() => {
    const filteredByTab = jobs.filter(j => tab === 'ทั้งหมด' ? true : j.status === tab);
    return filteredByTab.filter(j => j.title.toLowerCase().includes(query.toLowerCase()));
  }, [jobs, tab, query]);

  // helpers moved to module scope for access in JobCard

  const onViewApplicants = (job) => {
    navigation.navigate('EmployerApplicants', { title: 'ผู้สมัครทั้งหมด' });
  };

  const onEdit = (job) => {
    Alert.alert('แก้ไขประกาศ', `งาน: ${job.title}`, [
      { text: 'ปิด', style: 'cancel' },
      { text: 'ตกลง' },
    ]);
  };

  const onToggleStatus = (job) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: j.status === 'ปิดรับ' ? 'เปิดรับ' : 'ปิดรับ' } : j));
  };

  const Header = () => (
    <View>
      {/* Header top row */}
      <View style={styles.header}>
        <Text weight={700} style={styles.headerTitle}>งานของฉัน</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="search" size={20} color="#6b7280" style={{ marginRight: 14 }} />
          <Ionicons name="settings-outline" size={20} color="#6b7280" />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.segment}>
        {['ทั้งหมด', 'เปิดรับ', 'สัมภาษณ์', 'ปิดรับ'].map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.segItem, tab === t && styles.segItemActive]}>
            <Text weight={800} style={[styles.segText, tab === t && styles.segTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon="briefcase-outline" label="ประกาศทั้งหมด" value={stats.total} color="#0ea5e9" />
        <StatCard icon="checkmark-circle-outline" label="เปิดรับ" value={stats.open} color="#22c55e" />
        <StatCard icon="chatbubbles-outline" label="สัมภาษณ์" value={stats.interviewing} color="#FFA500" />
        <StatCard icon="people-outline" label="ผู้สมัครทั้งหมด" value={stats.applicants} color="#6366f1" />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหางานตามชื่อประกาศ"
          placeholderTextColor="#9ca3af"
          style={{ flex: 1, marginLeft: 8, color: '#111827', fontSize: 16 }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={Header}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onViewApplicants={onViewApplicants}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
          />
        )}
      />

      {false && (
        <Pressable onPress={() => Alert.alert('สร้างประกาศงาน', 'coming soon') } style={styles.fab}>
          <Ionicons name="add" size={26} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  headerTitle: { color: '#111827', fontSize: 24 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, width: '48%', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  statIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', marginTop: 6, marginBottom: 10 },
  filterTab: { marginRight: 18 },
  filterLabel: { color: '#374151' },
  filterLabelActive: { color: '#111827' },
  tabUnderline: { height: 3, backgroundColor: BRAND, marginTop: 6, borderRadius: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7fafc', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 0, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  jobTitle: { color: '#0f172a', fontSize: 16 },
  jobMeta: { marginTop: 8, color: '#6b7280' },
  subMeta: { color: '#64748b', fontSize: 12, marginTop: 2 },
  logoCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  salaryText: { marginTop: 10, color: '#0f172a', fontSize: 18 },
  shiftRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e0e7ff' },
  notes: { marginTop: 10, color: '#374151', lineHeight: 20 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  ctaBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#fecba1' },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginLeft: 8, backgroundColor: '#fff' },
  // New modern list card styles
  newCard: { backgroundColor: '#f3f4f6', borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  newHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  newAvatarBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  newAvatarImg: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#e5e7eb' },
  newJobTitle: { color: '#0f172a', fontSize: 18 },
  newSubMeta: { color: '#6b7280', fontSize: 13 },
  avatarStack: { flexDirection: 'row', marginTop: 8 },
  avatarBubble: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#f3f4f6', backgroundColor: '#111827' },
  moreBubble: { backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  newTagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tagPill: { backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginRight: 8, marginBottom: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  tagText: { color: '#111827', fontSize: 13 },
  statusTag: { backgroundColor: '#d1fae5', borderColor: '#bbf7d0' },
  newNotes: { marginTop: 8, color: '#374151', lineHeight: 20 },
  newFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  footerCenter: { flex: 1, alignItems: 'center' },
  viewBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  ghostBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginLeft: 8 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  // modern segmented control
  segment: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 14, padding: 4, marginTop: 10, marginBottom: 10 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  segItemActive: { backgroundColor: BRAND },
  segText: { color: '#334155', fontSize: 14 },
  segTextActive: { color: '#ffffff' },
  // end
});

export default MyJobsScreen;
