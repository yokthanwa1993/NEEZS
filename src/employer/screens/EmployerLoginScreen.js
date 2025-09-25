import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as authApi from '../../shared/services/authApi';

WebBrowser.maybeCompleteAuthSession();
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../shared/components/Typography';
import LineLogo from '../../shared/components/LineLogo';

export default function EmployerLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // set portal first so Root navigator picks correct stack when auth state flips
      try { await AsyncStorage.setItem('NEEZS_PORTAL','employer'); } catch {}
      const result = await authApi.loginWithEmail({ email, password, role: 'employer' });
      if (!result?.access_token) {
        Alert.alert('ข้อผิดพลาด', result?.error || 'เข้าสู่ระบบไม่สำเร็จ');
      } else {
        // AppNavigator will flip automatically after context updates
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      try { await AsyncStorage.setItem('NEEZS_PORTAL','employer'); } catch {}
      const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const path = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback';
      const appRedirect = Linking.createURL(path);
      const url = `${base}/auth/google/start?role=employer&app_redirect=${encodeURIComponent(appRedirect)}`;
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

  const handleRegister = () => {};

  const handleLineLogin = async () => {
    setLoading(true);
    try {
      try { await AsyncStorage.setItem('NEEZS_PORTAL','employer'); } catch {}
      const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const path = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback';
      const appRedirect = Linking.createURL(path);
      const url = `${base}/EmployerAuth/line/start?app_redirect=${encodeURIComponent(appRedirect)}`;
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
          <Text weight={800} style={styles.title}>Register or Log In</Text>

          {/* No email/password form for this minimal design */}
            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500',
                color: '#374151',
                marginBottom: 8 
              }}>
                อีเมล
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderWidth: 1,
                borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color="#9ca3af" 
                  style={{ marginRight: 12 }} 
                />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="business@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {errors.email && (
                <Text style={{ 
                  fontSize: 12, 
                  color: '#ef4444',
                  marginTop: 4,
                  marginLeft: 4 
                }}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500',
                color: '#374151',
                marginBottom: 8 
              }}>
                รหัสผ่าน
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderWidth: 1,
                borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color="#9ca3af" 
                  style={{ marginRight: 12 }} 
                />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="กรอกรหัสผ่าน"
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {errors.password && (
                <Text style={{ 
                  fontSize: 12, 
                  color: '#ef4444',
                  marginTop: 4,
                  marginLeft: 4 
                }}>
                  {errors.password}
                </Text>
              )}
            </View>

          {/* Continue with Email (disabled placeholder) */}
          <TouchableOpacity disabled onPress={handleEmailContinue} style={[styles.bigBtn, styles.btnDisabled, { marginTop: 12 }]}>
            <Text weight={800} style={styles.bigBtnText}>ดำเนินการต่อด้วยอีเมล</Text>
          </TouchableOpacity>

          {/* Provider buttons */}

            {/* Divider */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginVertical: 12 
            }}>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: '#e5e7eb' 
              }} />
              <Text style={{ 
                marginHorizontal: 16, 
                color: '#6b7280',
                fontSize: 14 
              }}>
                หรือ
              </Text>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: '#e5e7eb' 
              }} />
            </View>

          <TouchableOpacity onPress={handleGoogleLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#4285F4' }]}>
            <Ionicons name="logo-google" size={20} color="#ffffff" style={{ marginRight: 10 }} />
            <Text weight={800} style={styles.bigBtnText}>เข้าสู่ระบบด้วย Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLineLogin} disabled={loading} style={[styles.bigBtn, { backgroundColor: '#06C755', marginTop: 12 }]}>
            <LineLogo size={22} />
            <Text weight={800} style={[styles.bigBtnText, { marginLeft: 12 }]}>เข้าสู่ระบบด้วย LINE</Text>
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
  bigBtnText: { color: '#ffffff', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 },
  btnDisabled: { backgroundColor: '#d1d5db' },
});
