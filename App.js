import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
// Ensure icon font is preloaded on web
// Vendor path provided by @expo/vector-icons for web bundling
import IoniconsFont from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf';
import { ActivityIndicator, StyleSheet, View, LogBox } from 'react-native';
import './global.css';
import setupGlobalFonts from './src/shared/utils/globalFonts';
import initLogger from './src/shared/utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Firebase SDK kept for some legacy screens (e.g., profile edit),
// but navigation session bootstrap now relies on app session token only.
import BottomTabBar from './src/shared/components/BottomTabBar';
import { SeekerAuthProvider } from './src/seeker/contexts/SeekerAuthContext';
import { EmployerAuthProvider } from './src/employer/contexts/EmployerAuthContext';
import SeekerScreen from './src/seeker/screens/SeekerScreen';
import SeekerChatScreen from './src/seeker/screens/SeekerChatScreen';
import SeekerNotificationsScreen from './src/seeker/screens/SeekerNotificationsScreen';
import ChatRoomScreen from './src/seeker/screens/ChatRoomScreen';
import PortfolioDetailScreen from './src/seeker/screens/PortfolioDetailScreen';
import WorkHistoryEditScreen from './src/seeker/screens/WorkHistoryEditScreen';
import ProfileEditScreen from './src/seeker/screens/ProfileEditScreen';
import WalletScreen from './src/seeker/screens/WalletScreen';
import SeekerProfileScreen from './src/seeker/screens/SeekerProfileScreen';
import EmployerScreen from './src/employer/screens/EmployerScreen';
import WelcomeScreen from './src/shared/screens/WelcomeScreen';
import SeekerLoginScreen from './src/seeker/screens/SeekerLoginScreen';
import EmployerLoginScreen from './src/employer/screens/EmployerLoginScreen';

// Import Employer screens
import MyJobsScreen from './src/employer/screens/MyJobsScreen';
import EmployerChatScreen from './src/employer/screens/EmployerChatScreen';
import EmployerNotificationsScreen from './src/employer/screens/EmployerNotificationsScreen';
import EmployerProfileScreen from './src/employer/screens/EmployerProfileScreen';
import * as authApi from './src/shared/services/authApi';
import * as userApi from './src/shared/services/userApi';

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

const EmployerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => {
        let name;
        if (route.name === 'MyJobs') {
          name = focused ? 'briefcase' : 'briefcase-outline';
        } else if (route.name === 'EmployerChat') {
          name = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'EmployerNotifications') {
          name = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'EmployerProfile') {
          name = focused ? 'person-circle' : 'person-circle-outline';
        }
        return <Ionicons name={name} size={28} color={color} />;
      },
    })}
  >
    <Tab.Screen name="MyJobs" component={MyJobsScreen} options={{ tabBarLabel: 'My Jobs' }} />
    <Tab.Screen name="EmployerChat" component={EmployerChatScreen} options={{ tabBarLabel: 'แชท' }} />
    <Tab.Screen
      name="PostJob"
      component={() => null} // Placeholder for the '+' button action
      options={{
        tabBarLabel: '',
        tabBarIcon: () => (
          <View style={{
            backgroundColor: '#f5c518',
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -20,
          }}>
            <Ionicons name="add" size={32} color="#fff" />
          </View>
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          // Navigate to the actual screen for posting a job
          // navigation.navigate('PostJobScreen'); 
          alert('Navigate to Post Job Screen');
        },
      })}
    />
    <Tab.Screen name="EmployerNotifications" component={EmployerNotificationsScreen} options={{ tabBarLabel: 'แจ้งเตือน' }} />
    <Tab.Screen name="EmployerProfile" component={EmployerProfileScreen} options={{ tabBarLabel: 'โปรไฟล์' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = React.useState(null);
  const [portal, setPortal] = React.useState(null); // 'seeker' | 'employer' | null
  const [booting, setBooting] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await authApi.getToken();
        if (token) {
          try {
            const me = await userApi.getMe();
            if (mounted) setUser({ uid: me.id, ...(me.data || {}) });
          } catch {
            if (mounted) setUser(null);
          }
        } else {
          if (mounted) setUser(null);
        }
        try { const p = await AsyncStorage.getItem('NEEZS_PORTAL'); if (mounted) setPortal(p); } catch {}
      } finally {
        if (mounted) setBooting(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (booting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  return (
    <SeekerAuthProvider>
      <EmployerAuthProvider>
        <NavigationContainer theme={navigationTheme} ref={navigationRef}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={!user ? 'Welcome' : (portal === 'employer' ? 'EmployerTabs' : 'MainTabs')}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SeekerLogin" component={SeekerLoginScreen} />
            <Stack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="PortfolioDetail" component={PortfolioDetailScreen} />
            <Stack.Screen name="WorkHistoryEdit" component={WorkHistoryEditScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </EmployerAuthProvider>
    </SeekerAuthProvider>
  );
};

const App = () => {
  // เปิดการโหลดฟอนต์ Sukhumvit Set จริง
  const [fontsLoaded] = useFonts({
    // Icon font (web needs this explicitly when CSS resets are present)
    Ionicons: IoniconsFont,
    'SukhumvitSet-Light': require('./assets/fonts/SukhumvitSet-Light.ttf'),
    'SukhumvitSet-Medium': require('./assets/fonts/SukhumvitSet-Medium.ttf'),
    'SukhumvitSet-SemiBold': require('./assets/fonts/SukhumvitSet-SemiBold.ttf'),
    'SukhumvitSet-Bold': require('./assets/fonts/SukhumvitSet-Bold.ttf'),
  });

  useEffect(() => {
    // init persistent logging early
    initLogger({ enable: true });
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
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
