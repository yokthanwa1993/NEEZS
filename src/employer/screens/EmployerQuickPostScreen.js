import React, { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput as AppTextInput } from '../../shared/components/Typography';
import { useNavigation } from '@react-navigation/native';

const BRAND = '#f5c518';

const EmployerQuickPostScreen = () => {
  const [prompt, setPrompt] = useState('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const isReady = (prompt || '').trim().length > 0;
  const onNext = () => {
    if (!isReady) return;
    navigation.navigate('EmployerPostDetails', { prompt });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Top bar with back and close */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MyJobs'))}
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}
          accessibilityLabel="ย้อนกลับ"
        >
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('MyJobs')}
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}
          accessibilityLabel="ปิดหน้า"
        >
          <Ionicons name="close" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <View style={styles.centerContent}>
        {/* Header area */}
        <View style={styles.headerBox}>
          <View style={styles.heroIconBox}>
            <Ionicons name="hardware-chip-outline" size={24} color="#ffffff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text weight={700} style={styles.title}>วันนี้คุณต้องการทำงานอะไร?</Text>
            <Text style={styles.subtitle}>พิมพ์สิ่งที่ต้องการ เดี๋ยว AI ช่วยจัดการต่อให้</Text>
          </View>
        </View>

        {/* Card */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <AppTextInput
                value={prompt}
                onChangeText={setPrompt}
                multiline
                placeholder="เช่น ต้องการบาริสต้าพาร์ทไทม์ วันเสาร์-อาทิตย์ ที่สุขุมวิท"
                placeholderTextColor="#9ca3af"
                weight={400}
                style={styles.input}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.divider} />

            <Pressable
              onPress={onNext}
              disabled={!isReady}
              style={({ pressed }) => [
                styles.ctaBtn,
                isReady ? styles.ctaEnabled : styles.ctaDisabled,
                pressed && isReady && { opacity: 0.9 },
              ]}
            >
              <Text weight={800} style={isReady ? styles.ctaTextEnabled : styles.ctaTextDisabled}>ถัดไป</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 16 },
  centerContent: { flex: 1, justifyContent: 'center' },
  headerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  title: { color: '#0f172a', fontSize: 22 },
  subtitle: { color: '#64748b', marginTop: 6 },
  card: { backgroundColor: '#ffffff', borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  inputWrapper: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#e2e8f0', borderRadius: 14, padding: 8 },
  input: { minHeight: 200, color: '#111827', fontSize: 16, lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginTop: 12, marginBottom: 12 },
  ctaBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  ctaEnabled: { backgroundColor: BRAND },
  ctaDisabled: { backgroundColor: '#fde68a' },
  ctaTextEnabled: { color: '#111827', fontSize: 18 },
  ctaTextDisabled: { color: '#4b5563', fontSize: 18 },
  topBar: { position: 'absolute', top: 8, left: 16, right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
});

export default EmployerQuickPostScreen;
