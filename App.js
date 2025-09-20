import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StyleSheet, View, LogBox } from 'react-native';
import './global.css';
import setupGlobalFonts from './src/shared/utils/globalFonts';
import { AuthProvider, useAuth } from './src/shared/contexts/AuthContext';
import BottomTabBar from './src/shared/components/BottomTabBar';
import SeekerScreen from './src/seeker/screens/SeekerScreen';
import SeekerChatScreen from './src/seeker/screens/SeekerChatScreen';
import SeekerNotificationsScreen from './src/seeker/screens/SeekerNotificationsScreen';
import ChatRoomScreen from './src/seeker/screens/ChatRoomScreen';
import ProfileEditScreen from './src/seeker/screens/ProfileEditScreen';
import WalletScreen from './src/seeker/screens/WalletScreen';
import SeekerProfileScreen from './src/seeker/screens/SeekerProfileScreen';
import EmployerScreen from './src/employer/screens/EmployerScreen';
import WelcomeScreen from './src/shared/screens/WelcomeScreen';
import SeekerLoginScreen from './src/seeker/screens/SeekerLoginScreen';
import EmployerLoginScreen from './src/employer/screens/EmployerLoginScreen';

// ปิด warnings ที่ไม่จำเป็น
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  'Setting a timer for a long period of time',
  'VirtualizedLists should never be nested',
  'Non-serializable values were found in the navigation state',
]);

const navigationRef = createNavigationContainerRef();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    primary: '#f5c518',
    border: '#e2e8f0',
    text: '#111827',
  },
};

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => {
        let name = 'home-outline';
        switch (route.name) {
          case 'SeekerHome':
            name = focused ? 'home' : 'home-outline';
            break;
          case 'SeekerChat':
            name = focused ? 'chatbubble' : 'chatbubble-outline';
            break;
          case 'SeekerNotifications':
            name = focused ? 'notifications' : 'notifications-outline';
            break;
          case 'SeekerProfile':
            name = focused ? 'person' : 'person-outline';
            break;
          default:
            break;
        }
        return <Ionicons name={name} size={28} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="SeekerHome"
      component={SeekerScreen}
      options={{ tabBarLabel: 'หน้าแรก' }}
    />
    <Tab.Screen
      name="SeekerChat"
      component={SeekerChatScreen}
      options={{ tabBarLabel: 'แชท' }}
    />
    <Tab.Screen
      name="SeekerNotifications"
      component={SeekerNotificationsScreen}
      options={{ tabBarLabel: 'แจ้งเตือน' }}
    />
    <Tab.Screen
      name="SeekerProfile"
      component={SeekerProfileScreen}
      options={{ tabBarLabel: 'โปรไฟล์' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SeekerLogin" component={SeekerLoginScreen} />
            <Stack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  // เปิดการโหลดฟอนต์ Sukhumvit Set จริง
  const [fontsLoaded] = useFonts({
    'SukhumvitSet-Light': require('./assets/fonts/SukhumvitSet-Light.ttf'),
    'SukhumvitSet-Medium': require('./assets/fonts/SukhumvitSet-Medium.ttf'),
    'SukhumvitSet-SemiBold': require('./assets/fonts/SukhumvitSet-SemiBold.ttf'),
    'SukhumvitSet-Bold': require('./assets/fonts/SukhumvitSet-Bold.ttf'),
    'SukhumvitSet-ExtraBold': require('./assets/fonts/SukhumvitSet-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // ใช้ตัว override เดียว เพื่อบังคับฟอนต์และ map น้ำหนักอัตโนมัติ
      setupGlobalFonts();
      console.log('Fonts loaded and applied globally');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
