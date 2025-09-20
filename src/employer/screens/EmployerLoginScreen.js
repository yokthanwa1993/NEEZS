import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text, H1 } from '../../shared/components/Typography';
import { Button, Input, Card } from '../../shared/components/EnhancedUI';
import * as authService from '../../shared/services/authService';

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
      const result = await authService.signInWithEmail(email, password);
      if (!result.success) {
        Alert.alert('ข้อผิดพลาด', result.error);
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
      const result = await authService.signInWithGoogle();
      if (!result.success) {
        Alert.alert('ข้อผิดพลาด', result.error);
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // TODO: ไปหน้าสมัครสมาชิก
    Alert.alert('ข้อมูล', 'ฟีเจอร์สมัครสมาชิกยังไม่พร้อมใช้งาน');
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#dbeafe']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            padding: 24, 
            justifyContent: 'center' 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Icon */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{
              width: 80,
              height: 80,
              backgroundColor: '#3b82f6',
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#3b82f6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Ionicons name="business" size={36} color="#ffffff" />
            </View>
            <H1 style={{ 
              textAlign: 'center', 
              color: '#1f2937',
              fontSize: 28,
              marginBottom: 8 
            }}>
              เข้าสู่ระบบ
            </H1>
            <Text style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: 16 
            }}>
              สำหรับผู้ประกอบการ
            </Text>
          </View>
          
          <Card style={{ marginBottom: 24 }}>
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
            <View style={{ marginBottom: 24 }}>
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
                paddingVertical: 14,
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

            {/* Login Button - Blue theme for employer */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3b82f6',
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginBottom: 16,
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  เข้าสู่ระบบ
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginVertical: 20 
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
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons 
                name="logo-google" 
                size={20} 
                color="#4285f4" 
                style={{ marginRight: 12 }} 
              />
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#374151'
              }}>
                เข้าสู่ระบบด้วย Google
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <Button
              title="สมัครสมาชิก"
              onPress={handleRegister}
              variant="secondary"
            />
          </Card>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ 
              color: '#6b7280', 
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 20 
            }}>
              การเข้าสู่ระบบถือว่าคุณยอมรับ{'\n'}
              <Text style={{ color: '#3b82f6', fontWeight: '500' }}>
                ข้อกำหนดการใช้งาน
              </Text>
              {' และ '}
              <Text style={{ color: '#3b82f6', fontWeight: '500' }}>
                นโยบายความเป็นส่วนตัว
              </Text>
            </Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{
              alignItems: 'center',
              marginTop: 24,
              padding: 12,
            }}
          >
            <Text style={{
              color: '#6b7280',
              fontSize: 16,
              fontWeight: '500'
            }}>
              กลับไปหน้าเลือก
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
