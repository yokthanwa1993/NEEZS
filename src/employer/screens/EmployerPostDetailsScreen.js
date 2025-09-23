import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';

const BRAND = '#f5c518';

const AddTile = ({ onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.addTile, pressed && { opacity: 0.9 }]}>
    <Ionicons name="image" size={22} color="#111827" />
    <Text style={{ color: '#111827', marginTop: 6 }}>เพิ่มรูป</Text>
  </Pressable>
);

const ImageTile = ({ uri, onRemove }) => (
  <View style={styles.imageTile}>
    <Image source={{ uri }} style={styles.image} />
    <Pressable onPress={onRemove} style={styles.removeBtn}>
      <Ionicons name="close" size={16} color="#ffffff" />
    </Pressable>
  </View>
);

const EmployerPostDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const initialPrompt = route.params?.prompt || '';

  const [images, setImages] = useState([]);
  // This screen now focuses on image upload only

  const addImages = async () => {
    try {
      const ImagePicker = (await import('expo-image-picker')).default || (await import('expo-image-picker'));
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ต้องการสิทธิ์รูปภาพ', 'โปรดอนุญาตให้เข้าถึงคลังภาพเพื่อแนบรูป');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (res.canceled) return;
      const uris = (res.assets || []).map(a => a.uri).filter(Boolean);
      setImages(prev => [...prev, ...uris]);
    } catch (e) {
      Alert.alert('แนบรูปไม่สำเร็จ', 'โปรดติดตั้งแพ็กเกจ: expo install expo-image-picker');
    }
  };

  const onNext = () => {
    navigation.navigate('EmployerJobLocation', { prompt: initialPrompt, images });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Top bar */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtnDark} accessibilityLabel="ย้อนกลับ">
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('EmployerTabs', { screen: 'MyJobs' })} hitSlop={10} style={styles.iconBtnDark} accessibilityLabel="ปิดหน้า">
          <Ionicons name="close" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingTop: 12, paddingBottom: 24 }}>
        {/* Header */}
        <View style={styles.header}> 
          <Text weight={700} style={styles.headerTitle}>แนบรูปภาพ</Text>
          {initialPrompt ? <Text style={styles.promptPreview} numberOfLines={3}>{initialPrompt}</Text> : null}
        </View>

        {/* Images */}
        <View style={styles.section}> 
          <Text weight={700} style={styles.label}>รูปภาพประกอบ</Text>
          <View style={styles.imagesRow}>
            {images.map((uri) => (
              <ImageTile key={uri} uri={uri} onRemove={() => setImages(prev => prev.filter(u => u !== uri))} />
            ))}
            <AddTile onPress={addImages} />
          </View>
        </View>

        <Pressable onPress={onNext} style={({ pressed }) => [styles.publishBtn, pressed && { opacity: 0.95 }]}>
          <Text weight={800} style={{ color: '#ffffff', fontSize: 18 }}>ถัดไป</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 16 },
  topBar: { position: 'absolute', left: 16, right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtnDark: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  header: { marginTop: 54, marginBottom: 12 },
  headerTitle: { color: '#111827', fontSize: 20 },
  promptPreview: { color: '#6b7280', marginTop: 6 },
  section: { marginTop: 12 },
  label: { color: '#111827', marginBottom: 8 },
  imagesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  addTile: { width: 86, height: 86, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginRight: 10, marginBottom: 10 },
  imageTile: { width: 86, height: 86, borderRadius: 12, overflow: 'hidden', marginRight: 10, marginBottom: 10 },
  image: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#111827' },
  publishBtn: { backgroundColor: '#111827', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
});

export default EmployerPostDetailsScreen;
