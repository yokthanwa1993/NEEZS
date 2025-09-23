import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, TextInput, Platform } from 'react-native';
import Constants from 'expo-constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';

const DEFAULT_REGION = {
  latitude: 13.7563, // Bangkok
  longitude: 100.5018,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function EmployerMapPickerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const payload = route.params || {};

  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [address, setAddress] = useState('');
  const [query, setQuery] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const moveTimer = useRef(null);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const r = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
          setRegion(r);
          mapRef.current?.animateToRegion?.(r, 500);
          reverseGeocode(r.latitude, r.longitude);
        } else {
          reverseGeocode(region.latitude, region.longitude);
        }
      } catch (e) {
        // fallback silently
        reverseGeocode(region.latitude, region.longitude);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      setGeocoding(true);
      const res = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const first = res?.[0];
      if (first) {
        const line = [first.name, first.street, first.subregion, first.city, first.region, first.postalCode]
          .filter(Boolean)
          .join(' ');
        setAddress(line || '');
      }
    } catch (e) {
      // noop
    } finally {
      setGeocoding(false);
    }
  };

  const handleRegionChangeComplete = (rgn) => {
    setRegion(rgn);
    if (moveTimer.current) clearTimeout(moveTimer.current);
    moveTimer.current = setTimeout(() => {
      reverseGeocode(rgn.latitude, rgn.longitude);
    }, 350);
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    try {
      setGeocoding(true);
      const geos = await Location.geocodeAsync(q);
      const first = geos?.[0];
      if (first) {
        const r = { latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setRegion(r);
        mapRef.current?.animateToRegion?.(r, 600);
      }
    } catch (e) {
      // ignore
    } finally {
      setGeocoding(false);
    }
  };

  const confirm = () => {
    navigation.navigate('EmployerTabs', {
      screen: 'MyJobs',
      params: {
        selectedLocation: {
          latitude: region.latitude,
          longitude: region.longitude,
          address,
        },
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Top bar with search */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ค้นหาที่อยู่"
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            style={{ flex: 1, marginLeft: 8, paddingVertical: Platform.OS === 'ios' ? 10 : 6, color: '#111827' }}
          />
          <Pressable onPress={handleSearch} hitSlop={8}>
            <Ionicons name="arrow-forward" size={18} color="#6b7280" />
          </Pressable>
        </View>
      </View>

      {/* Map */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton={false}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : (!isExpoGo ? PROVIDER_GOOGLE : undefined)}
          />
        )}

        {/* Tip banner */}
        <View pointerEvents="none" style={styles.tipBanner}>
          <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
            <Text weight={700} style={{ color: '#ffffff' }}>เลื่อนแผนที่เพื่อวางหมุด</Text>
          </View>
        </View>

        {/* Center pin */}
        <View pointerEvents="none" style={styles.centerPinWrapper}>
          <Ionicons name="location" size={36} color="#FFA500" style={{ textShadowColor: '#00000055', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }} />
        </View>

        {/* My location button */}
        <Pressable
          onPress={async () => {
            try {
              const loc = await Location.getCurrentPositionAsync({});
              const r = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
              setRegion(r);
              mapRef.current?.animateToRegion?.(r, 600);
            } catch {}
          }}
          style={styles.myLocationBtn}
        >
          <Ionicons name="locate" size={22} color="#111827" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomCard}>
        <Text weight={700} style={{ fontSize: 18, color: '#111827' }}>เลือกตำแหน่ง</Text>
        <Text style={{ color: '#374151', marginTop: 8 }} numberOfLines={2}>{geocoding ? 'กำลังค้นหาที่อยู่…' : (address || 'ไม่พบที่อยู่')}</Text>
        <Pressable onPress={confirm} style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.9 }]}>
          <Text weight={800} style={{ color: '#ffffff', fontSize: 16 }}>ยืนยันตำแหน่งนี้</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tipBanner: { position: 'absolute', top: 90, left: 0, right: 0, alignItems: 'center' , zIndex: 10 },
  centerPinWrapper: { position: 'absolute', top: '50%', left: '50%', marginTop: -18, marginLeft: -18, zIndex: 10 },
  myLocationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  confirmBtn: { marginTop: 12, backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
});
