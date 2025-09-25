import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as authApi from '../../shared/services/authApi';

WebBrowser.maybeCompleteAuthSession();
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import LineLogo from '../../shared/components/LineLogo';

export default function SeekerLoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');

  const handleLogin = async () => {};

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      try { await AsyncStorage.setItem('NEEZS_PORTAL', 'seeker'); } catch {}
      const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const path = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback';
      const appRedirect = Linking.createURL(path);
      const url = `${base}/auth/google/start?role=seeker&app_redirect=${encodeURIComponent(appRedirect)}`;
      const preferEphemeral = String(process.env.EXPO_PUBLIC_OAUTH_EPHEMERAL || '0') === '1';
      const result = await WebBrowser.openAuthSessionAsync(url, appRedirect, {
        // When false (default), Google remembers session (no password each time)
        preferEphemeralSession: preferEphemeral,
        showInRecents: true,
      });
      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const at = queryParams?.access_token;
        const rt = queryParams?.refresh_token;
        if (at || rt) {
          await authApi.setTokens({ access_token: at, refresh_token: rt });
          // AppNavigator will flip automatically after context updates
        }
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    Alert.alert('ข้อมูล', 'ฟีเจอร์สมัครสมาชิกยังไม่พร้อมใช้งาน');
  };

  const handleLineLogin = async () => {
    setLoading(true);
    try {
      try { await AsyncStorage.setItem('NEEZS_PORTAL', 'seeker'); } catch {}
      const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const path = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback';
      const appRedirect = Linking.createURL(path);
      const url = `${base}/SeekerAuth/line/start?app_redirect=${encodeURIComponent(appRedirect)}`;
      const result = await WebBrowser.openAuthSessionAsync(url, appRedirect);
      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const at = queryParams?.access_token;
        const rt = queryParams?.refresh_token;
        if (at || rt) {
          await authApi.setTokens({ access_token: at, refresh_token: rt });
        }
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    Alert.alert('เร็วๆ นี้', 'กำลังเตรียมเชื่อมต่อ Apple Sign‑In');
  };

  const handleFacebookLogin = async () => {
    Alert.alert('เร็วๆ นี้', 'กำลังเตรียมเชื่อมต่อ Facebook Login');
  };

  const handleEmailContinue = () => {
    Alert.alert('เร็วๆ นี้', 'Continue with Email จะเปิดใช้เป็น Magic Link');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text weight={800} style={styles.title}>สมัครหรือเข้าสู่ระบบ</Text>

          {/* Email only (no password) */}
          <View style={{ marginTop: 24 }}>
            <Text weight={700} style={styles.label}>อีเมล</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af" />
            </View>
            <TouchableOpacity disabled onPress={handleEmailContinue} style={[styles.bigBtn, styles.btnDisabled, { marginTop: 12 }]}>
              <Text weight={800} style={styles.bigBtnText}>ดำเนินการต่อด้วยอีเมล</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text weight={700} style={{ color: '#9ca3af' }}>หรือ</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={handleGoogleLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#4285F4' }]}>
            <Ionicons name="logo-google" size={20} color="#ffffff" style={{ marginRight: 10 }} />
            <Text weight={800} style={styles.bigBtnText}>เข้าสู่ระบบด้วย Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLineLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#06C755', marginTop: 12 }]}>
            <LineLogo size={22} />
            <Text weight={800} style={[styles.bigBtnText, { marginLeft: 12 }]}>เข้าสู่ระบบด้วย LINE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFacebookLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#1877F2', marginTop: 12 }]}>
            <Ionicons name="logo-facebook" size={20} color="#ffffff" style={{ marginRight: 10 }} />
            <Text weight={800} style={styles.bigBtnText}>เข้าสู่ระบบด้วย Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAppleLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#000000', marginTop: 12 }]}>
            <Ionicons name="logo-apple" size={20} color="#ffffff" style={{ marginRight: 10 }} />
            <Text weight={800} style={styles.bigBtnText}>เข้าสู่ระบบด้วย Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', marginTop: 22 }}>
            <Text weight={700} style={{ color: '#111827' }}>กลับ</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 32, color: '#111827' },
  label: { color: '#6b7280', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  input: { flex: 1, color: '#111827', fontSize: 16 },
  bigBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 18, paddingVertical: 16 },
  btnDisabled: { backgroundColor: '#d1d5db' },
  bigBtnText: { color: '#ffffff', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 },
});
