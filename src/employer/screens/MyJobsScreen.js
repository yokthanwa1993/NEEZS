import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { employerJobs as seedJobs } from '../../shared/data/mockData';

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

const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.statCard}> 
    <View style={[styles.statIconBox, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View style={{ marginLeft: 10 }}>
      <Text weight={700} style={{ color: '#111827', fontSize: 18 }}>{value}</Text>
      <Text style={{ color: '#6b7280' }}>{label}</Text>
    </View>
  </View>
);

const FilterTab = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={styles.filterTab}>
    <Text weight={700} style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
    {active ? <View style={styles.tabUnderline} /> : null}
  </Pressable>
);

const JobCard = ({ job, onViewApplicants, onToggleStatus, onEdit }) => (
  <View style={styles.card}> 
    <View style={styles.cardHeader}> 
      <Text weight={700} style={styles.jobTitle}>{job.title}</Text>
      <StatusPill status={job.status} />
    </View>
    <Text style={styles.jobMeta}>{job.applicants} ผู้สมัคร</Text>
    <View style={styles.shiftRow}>
      {job.shifts?.map((s) => <Chip key={s} label={s} />)}
    </View>
    {job.notes ? <Text style={styles.notes}>{job.notes}</Text> : null}
    <View style={styles.actionRow}> 
      <Pressable onPress={() => onViewApplicants(job)} style={styles.actionBtn}>
        <Ionicons name="people-outline" size={18} color="#111827" />
        <Text weight={700} style={styles.actionText}>ดูผู้สมัคร</Text>
      </Pressable>
      <Pressable onPress={() => onEdit(job)} style={styles.actionBtn}>
        <Ionicons name="create-outline" size={18} color="#111827" />
        <Text weight={700} style={styles.actionText}>แก้ไข</Text>
      </Pressable>
      <Pressable onPress={() => onToggleStatus(job)} style={styles.actionBtn}>
        <Ionicons name={job.status === 'ปิดรับ' ? 'play-circle-outline' : 'close-circle-outline'} size={18} color="#111827" />
        <Text weight={700} style={styles.actionText}>{job.status === 'ปิดรับ' ? 'เปิดรับ' : 'ปิดประกาศ'}</Text>
      </Pressable>
    </View>
  </View>
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
      <View style={styles.tabsRow}> 
        {['ทั้งหมด', 'เปิดรับ', 'สัมภาษณ์', 'ปิดรับ'].map((t) => (
          <FilterTab key={t} label={t} active={tab === t} onPress={() => setTab(t)} />
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
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', marginBottom: 10, width: '48%' },
  statIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', marginTop: 6, marginBottom: 10 },
  filterTab: { marginRight: 18 },
  filterLabel: { color: '#374151' },
  filterLabelActive: { color: '#111827' },
  tabUnderline: { height: 3, backgroundColor: BRAND, marginTop: 6, borderRadius: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  jobTitle: { color: '#111827', fontSize: 16 },
  jobMeta: { marginTop: 8, color: '#6b7280' },
  shiftRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: { backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#bae6fd' },
  notes: { marginTop: 10, color: '#374151', lineHeight: 20 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  actionText: { color: '#111827', marginLeft: 6 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
});

export default MyJobsScreen;
