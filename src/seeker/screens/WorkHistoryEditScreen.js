import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';

const BRAND = '#f5c518';

export default function WorkHistoryEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item || {};
  const onSave = route.params?.onSave;

  const [role, setRole] = useState(item.role || '');
  const [company, setCompany] = useState(item.company || '');
  const [period, setPeriod] = useState(item.period || '');
  const [location, setLocation] = useState(item.location || '');
  const [description, setDescription] = useState(item.description || '');
  const [skills, setSkills] = useState(Array.isArray(item.highlights) ? item.highlights.join(', ') : '');
  const [images, setImages] = useState(Array.isArray(item.images) ? item.images : []);
  const [imageUrl, setImageUrl] = useState('');

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    const payload = {
      ...item,
      role: role.trim(),
      company: company.trim(),
      period: period.trim(),
      location: location.trim(),
      description: description.trim(),
      highlights: skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      images,
    };
    try {
      if (typeof onSave === 'function') onSave(payload);
    } catch {}
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="close" size={24} color="#111827" />
        </Pressable>
        <Text weight={700} style={styles.headerTitle}>แก้ไขประวัติการทำงาน</Text>
        <Pressable onPress={save} hitSlop={10} style={styles.saveBtn}>
          <Ionicons name="checkmark" size={18} color="#111827" />
          <Text weight={700} style={{ marginLeft: 6, color: '#111827' }}>บันทึก</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.formRow}>
          <Text style={styles.label}>ชื่อตำแหน่ง</Text>
          <TextInput value={role} onChangeText={setRole} placeholder="เช่น บาริสต้า" style={styles.input} />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>บริษัท</Text>
          <TextInput value={company} onChangeText={setCompany} placeholder="ชื่อบริษัท" style={styles.input} />
        </View>
        <View style={styles.doubleRow}>
          <View style={[styles.formRow, { flex: 1, marginRight: 8 }]}> 
            <Text style={styles.label}>ช่วงเวลา</Text>
            <TextInput value={period} onChangeText={setPeriod} placeholder="ม.ค. 2025 – ปัจจุบัน" style={styles.input} />
          </View>
          <View style={[styles.formRow, { flex: 1, marginLeft: 8 }]}> 
            <Text style={styles.label}>สถานที่</Text>
            <TextInput value={location} onChangeText={setLocation} placeholder="สยาม กรุงเทพฯ" style={styles.input} />
          </View>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>รายละเอียดงาน</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="สรุปหน้าที่/ผลงานสำคัญ"
            style={[styles.input, { height: 96 }]}
            multiline
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>ทักษะ/ไฮไลต์ (คั่นด้วย , )</Text>
          <TextInput value={skills} onChangeText={setSkills} placeholder="เช่น ชงกาแฟ, บริการลูกค้า" style={styles.input} />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>รูปภาพ</Text>
          <View style={styles.imagesWrap}>
            {images.map((src, i) => (
              <View key={i} style={{ position: 'relative', marginRight: 8, marginBottom: 8 }}>
                <Image source={{ uri: src }} style={styles.image} />
                <Pressable onPress={() => removeImage(i)} style={styles.removeBtn}>
                  <Ionicons name="close" size={14} color="#fff" />
                </Pressable>
              </View>
            ))}
            <View style={[styles.image, styles.addTile]}> 
              <Ionicons name="image-outline" size={18} color="#9ca3af" />
            </View>
          </View>
          <View style={styles.addRow}> 
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="วางลิงก์รูปภาพ (URL)"
              style={[styles.input, { flex: 1 }]}
            />
            <Pressable style={styles.primaryBtn} onPress={addImage}>
              <Text weight={700} style={{ color: '#111827' }}>เพิ่มรูป</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fde68a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  headerTitle: { color: '#111827', fontSize: 16 },
  formRow: { marginTop: 14 },
  doubleRow: { flexDirection: 'row' },
  label: { color: '#374151', marginBottom: 6 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#111827', backgroundColor: '#fff' },
  imagesWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  image: { width: 92, height: 92, borderRadius: 12, backgroundColor: '#f3f4f6' },
  addTile: { alignItems: 'center', justifyContent: 'center' },
  removeBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { backgroundColor: '#fde68a', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginLeft: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
});

