import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { employerJobs as seedJobs } from '../../shared/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

const BRAND = '#FFA500';

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
        <Text weight={900} style={{ color: '#0f172a', fontSize: 20 }}>{value}</Text>
        <Text style={{ color: '#334155' }}>{label}</Text>
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
  <LinearGradient colors={["#ffffff", "#f7fafc"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}> 
    {/* Header row: logo/title + bookmark + status */}
    <View style={styles.cardHeader}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={styles.logoCircle}> 
          <Ionicons name="business-outline" size={16} color="#111827" />
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text weight={900} style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.subMeta}>{job.status}</Text>
        </View>
      </View>
      <Pressable onPress={() => onEdit(job)} hitSlop={8}>
        <Ionicons name="bookmark-outline" size={20} color={BRAND} />
      </Pressable>
    </View>

    {/* Meta */}
    <Text weight={800} style={styles.salaryText}>{job.applicants || 0}<Text style={{ fontWeight: '400' }}> ผู้สมัคร</Text></Text>

    {/* Chips */}
    <View style={styles.shiftRow}>
      {job.shifts?.map((s) => <Chip key={s} label={s} />)}
    </View>

    {/* Notes */}
    {job.notes ? <Text style={styles.notes}>{job.notes}</Text> : null}

    {/* Actions */}
    <View style={styles.actionRow}> 
      <Pressable onPress={() => onViewApplicants(job)} style={[styles.ctaBtn, { backgroundColor: '#ffe7c7' }]}> 
        <Text weight={800} style={{ color: '#111827' }}>ดูผู้สมัคร</Text>
      </Pressable>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => onToggleStatus(job)} style={styles.iconBtn}> 
          <Ionicons name={job.status === 'ปิดรับ' ? 'play' : 'pause'} size={16} color="#111827" />
        </Pressable>
        <Pressable onPress={() => onEdit(job)} style={styles.iconBtn}> 
          <Ionicons name="create-outline" size={16} color="#111827" />
        </Pressable>
      </View>
    </View>
  </LinearGradient>
);

const MyJobsScreen = () => {
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

  const onViewApplicants = (job) => {
    Alert.alert('ดูผู้สมัคร', `งาน: ${job.title}`, [
      { text: 'ปิด', style: 'cancel' },
      { text: 'ตกลง' },
    ]);
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

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text weight={700} style={styles.headerTitle}>งานของฉัน</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="search" size={20} color="#6b7280" style={{ marginRight: 14 }} />
          <Ionicons name="settings-outline" size={20} color="#6b7280" />
        </View>
      </View>

  {/* Stats */}
  <View style={styles.statsRow}>
    <StatCard icon="briefcase-outline" label="ประกาศทั้งหมด" value={stats.total} color="#0ea5e9" />
    <StatCard icon="checkmark-circle-outline" label="เปิดรับ" value={stats.open} color="#22c55e" />
    <StatCard icon="chatbubbles-outline" label="สัมภาษณ์" value={stats.interviewing} color="#FFA500" />
    <StatCard icon="people-outline" label="ผู้สมัครทั้งหมด" value={stats.applicants} color="#6366f1" />
  </View>

  {/* Filters */}
  <View style={styles.segment}> 
    {['ทั้งหมด', 'เปิดรับ', 'สัมภาษณ์', 'ปิดรับ'].map((t) => (
      <Pressable key={t} onPress={() => setTab(t)} style={[styles.segItem, tab === t && styles.segItemActive]}>
        <Text weight={800} style={[styles.segText, tab === t && styles.segTextActive]}>{t}</Text>
      </Pressable>
    ))}
  </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหางานตามชื่อประกาศ"
          placeholderTextColor="#9ca3af"
          style={{ flex: 1, marginLeft: 8, color: '#111827' }}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  headerTitle: { color: '#111827', fontSize: 22 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, width: '48%', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  statIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', marginTop: 6, marginBottom: 10 },
  filterTab: { marginRight: 18 },
  filterLabel: { color: '#374151' },
  filterLabelActive: { color: '#111827' },
  tabUnderline: { height: 3, backgroundColor: BRAND, marginTop: 6, borderRadius: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7fafc', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
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
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  ctaBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#fecba1' },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginLeft: 8, backgroundColor: '#fff' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  // modern segmented control
  segment: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 14, padding: 4, marginTop: 10, marginBottom: 10 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  segItemActive: { backgroundColor: BRAND },
  segText: { color: '#334155' },
  segTextActive: { color: '#ffffff' },
  // end
});

export default MyJobsScreen;
