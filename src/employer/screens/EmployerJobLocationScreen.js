import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';

const BRAND = '#FFA500';

const OptionCard = ({ icon, title, desc, active, onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.card, active && styles.cardActive, pressed && { opacity: 0.9 }]}>
    <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
      <Ionicons name={icon} size={20} color="#111827" />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text weight={700} style={{ color: '#111827' }}>{title}</Text>
      <Text style={{ color: '#6b7280', marginTop: 4 }}>{desc}</Text>
    </View>
  </Pressable>
);

const EmployerJobLocationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const payload = route.params || {};
  const [choice, setChoice] = useState(null); // 'onsite' | 'online'

  const isReady = !!choice;
  const onNext = () => {
    if (!isReady) return;
    if (choice === 'onsite') {
      navigation.navigate('EmployerMapPicker', payload);
    } else {
      navigation.navigate('EmployerTabs', { screen: 'MyJobs' });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtnDark} accessibilityLabel="ย้อนกลับ">
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('EmployerTabs', { screen: 'MyJobs' })} hitSlop={10} style={styles.iconBtnDark} accessibilityLabel="ปิดหน้า">
          <Ionicons name="close" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingTop: 12, paddingBottom: 24 }}>
        <View style={styles.header}> 
          <View style={[styles.inlineIcon, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="location-outline" size={18} color="#111827" />
          </View>
          <Text weight={700} style={styles.headerTitle}>คุณต้องการให้ทำงานที่ไหน?</Text>
        </View>

        <OptionCard
          icon="home-outline"
          title="สถานที่จริง (ออนไซต์)"
          desc="ต้องปักหมุดตำแหน่งในแผนที่"
          active={choice === 'onsite'}
          onPress={() => setChoice('onsite')}
        />
        <OptionCard
          icon="globe-outline"
          title="ออนไลน์ / ฟรีแลนซ์"
          desc="ไม่ต้องระบุตำแหน่งสถานที่"
          active={choice === 'online'}
          onPress={() => setChoice('online')}
        />

        <View style={styles.divider} />
        <Pressable
          onPress={onNext}
          disabled={!isReady}
          style={({ pressed }) => [
            styles.nextBtn,
            isReady ? styles.nextEnabled : styles.nextDisabled,
            pressed && isReady && { opacity: 0.95 },
          ]}
        >
          <Text weight={800} style={isReady ? styles.nextTextEnabled : styles.nextTextDisabled}>ถัดไป</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 16 },
  topBar: { position: 'absolute', left: 16, right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtnDark: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  header: { marginTop: 54, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  inlineIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: '#111827', fontSize: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', padding: 14, marginTop: 10 },
  cardActive: { borderColor: '#FFD28A', backgroundColor: '#FFF4DB' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginTop: 18, marginBottom: 12 },
  nextBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  nextEnabled: { backgroundColor: BRAND },
  nextDisabled: { backgroundColor: '#FFD28A' },
  nextTextEnabled: { color: '#ffffff', fontSize: 18 },
  nextTextDisabled: { color: '#4b5563', fontSize: 18 },
});

export default EmployerJobLocationScreen;
