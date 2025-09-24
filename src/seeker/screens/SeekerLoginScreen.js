import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as authApi from '../../shared/services/authApi';

WebBrowser.maybeCompleteAuthSession();
import { Ionicons } from '@expo/vector-icons';
import { Text, H1 } from '../../shared/components/Typography';
import { Button, Card } from '../../shared/components/EnhancedUI';

export default function SeekerLoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
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
      // ตั้งค่า portal ก่อน เพื่อให้ Root navigator เลือก stack ที่ถูกต้องเมื่อ auth เปลี่ยนสถานะ
      try { await AsyncStorage.setItem('NEEZS_PORTAL', 'seeker'); } catch {}
      const result = await authApi.loginWithEmail({ email, password, role: 'seeker' });
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
      try { await AsyncStorage.setItem('NEEZS_PORTAL', 'seeker'); } catch {}
      const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const path = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback';
      const appRedirect = Linking.createURL(path);
      const url = `${base}/auth/google/start?role=seeker&app_redirect=${encodeURIComponent(appRedirect)}`;
      const result = await WebBrowser.openAuthSessionAsync(url, appRedirect);
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
      const url = `${base}/auth/line/start?role=seeker&app_redirect=${encodeURIComponent(appRedirect)}`;
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

  return (
    <LinearGradient colors={["#FFD699", "#FFA500"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View
            style={{
              minHeight: Math.max(640, height - insets.top - insets.bottom),
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 12,
              justifyContent: 'center',
            }}
          >
            {/* Header with Icon */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#FFA500',
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  shadowColor: '#FFA500',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="person" size={36} color="#ffffff" />
              </View>
              <H1
                style={{
                  textAlign: 'center',
                  color: '#1f2937',
                  fontSize: 28,
                  marginBottom: 8,
                }}
              >
                เข้าสู่ระบบ
              </H1>
              <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
                สำหรับผู้หางาน
              </Text>
            </View>

            <Card style={{ marginBottom: 12 }}>
              {/* Email Input */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}
                >
                  อีเมล
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderWidth: 1,
                    borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                >
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#111827' }}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.email && (
                  <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4, marginLeft: 4 }}>
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 18 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}
                >
                  รหัสผ่าน
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderWidth: 1,
                    borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#111827' }}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="กรอกรหัสผ่าน"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.password && (
                  <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4, marginLeft: 4 }}>
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* Login Button - Yellow theme for seeker */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFA500',
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  marginBottom: 12,
                  shadowColor: '#FFA500',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#111827" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    เข้าสู่ระบบ
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                <Text style={{ marginHorizontal: 16, color: '#6b7280', fontSize: 14 }}>หรือ</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={loading}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  borderWidth: 1,
                  borderColor: '#dadce0',
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Ionicons name="logo-google" size={20} color="#4285f4" style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#374151' }}>
                  เข้าสู่ระบบด้วย Google
                </Text>
              </TouchableOpacity>

              {/* LINE Login Button */}
              <TouchableOpacity
                onPress={handleLineLogin}
                disabled={loading}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#06C755',
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  marginBottom: 12,
                  shadowColor: '#06C755',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#ffffff" style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
                  เข้าสู่ระบบด้วย LINE
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <Button title="สมัครสมาชิก" onPress={handleRegister} variant="secondary" />
            </Card>

            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                การเข้าสู่ระบบถือว่าคุณยอมรับ{'\n'}
                <Text style={{ color: '#FFA500', fontWeight: '500' }}>ข้อกำหนดการใช้งาน</Text>
                {' และ '}
                <Text style={{ color: '#FFA500', fontWeight: '500' }}>นโยบายความเป็นส่วนตัว</Text>
              </Text>
            </View>

            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', marginTop: 8, padding: 8 }}>
              <Text style={{ color: '#6b7280', fontSize: 15, fontWeight: '500' }}>กลับไปหน้าเลือก</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
