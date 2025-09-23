import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const BRAND = '#f5c518';

const Dot = ({ active }) => (
  <View style={[styles.dot, active && styles.dotActive]} />
);

export default function PortfolioDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const item = route.params?.item || {};
  const images = useMemo(() => item.images || [], [item]);
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text weight={700} style={styles.headerTitle}>{item.title || 'รายละเอียดผลงาน'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Image slider */}
        {images.length ? (
          <View>
            <FlatList
              data={images}
              keyExtractor={(u, i) => String(i)}
              horizontal
              pagingEnabled
              snapToInterval={width}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setIndex(idx);
              }}
              renderItem={({ item: src }) => (
                <Image source={{ uri: src }} style={styles.hero} />
              )}
            />
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <Dot key={i} active={i === index} />
              ))}
            </View>
          </View>
        ) : null}

        {/* Content */}
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text weight={700} style={{ color: '#111827', fontSize: 18 }}>{item.title || '-'}</Text>
            {item.isPublic ? (
              <View style={styles.publicBadge}>
                <Ionicons name="globe-outline" size={14} color="#111827" />
                <Text weight={700} style={{ marginLeft: 6, color: '#111827', fontSize: 12 }}>สาธารณะ</Text>
              </View>
            ) : null}
          </View>

          {(item.role || item.org) ? (
            <Text style={{ color: '#6b7280', marginTop: 4 }}>{[item.role, item.org].filter(Boolean).join(' • ')}</Text>
          ) : null}

          {(item.period || item.location) ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
              <Text style={{ color: '#9ca3af', marginLeft: 6, fontSize: 12 }}>{[item.period, item.location].filter(Boolean).join(' • ')}</Text>
            </View>
          ) : null}

          {item.description ? (
            <Text style={{ color: '#374151', marginTop: 10 }}>{item.description}</Text>
          ) : null}

          {/* Skills */}
          {Array.isArray(item.skills) && item.skills.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {item.skills.map((s) => (
                <View key={s} style={styles.pill}><Text weight={700} style={{ color: '#111827', fontSize: 12 }}>{s}</Text></View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text weight={700} style={{ color: '#111827' }}>กลับ</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={() => {}}>
          <Text weight={700} style={{ color: '#111827' }}>แชร์ผลงาน</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  headerTitle: { color: '#111827', fontSize: 16, marginLeft: 6 },
  hero: { width, height: width * 0.6 },
  dotsRow: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)', marginHorizontal: 3 },
  dotActive: { backgroundColor: BRAND },
  contentBox: { padding: 16 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fde68a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pill: { backgroundColor: '#f3f4f6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginTop: 6 },
  bottomBar: { flexDirection: 'row', justifyContent: 'flex-end', padding: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e5e7eb' },
  primaryBtn: { backgroundColor: '#fde68a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginLeft: 8 },
  secondaryBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
});

