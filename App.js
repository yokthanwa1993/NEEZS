import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import RoundPlus from './src/shared/components/RoundPlus';
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
import EmployerQuickPostScreen from './src/employer/screens/EmployerQuickPostScreen';
import EmployerPostDetailsScreen from './src/employer/screens/EmployerPostDetailsScreen';
import EmployerJobLocationScreen from './src/employer/screens/EmployerJobLocationScreen';
import EmployerMapPickerScreen from './src/employer/screens/EmployerMapPickerScreen';
import * as authApi from './src/shared/services/authApi';
import { useSeekerAuth } from './src/seeker/contexts/SeekerAuthContext';
import { useEmployerAuth } from './src/employer/contexts/EmployerAuthContext';
import { authEvents } from './src/shared/services/authEvents';

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
    primary: '#FFA500',
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
    tabBar={(props) => <BottomTabBar {...props} />}
    initialRouteName="PostJob"
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
      component={EmployerQuickPostScreen}
      options={{
        tabBarLabel: '',
        tabBarIcon: () => (
          <View style={{
            marginTop: -22,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: '#FFA500',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RoundPlus size={22} thickness={4} color="#111827" />
              </View>
            </View>
          </View>
        ),
      }}
    />
    <Tab.Screen name="EmployerNotifications" component={EmployerNotificationsScreen} options={{ tabBarLabel: 'แจ้งเตือน' }} />
    <Tab.Screen name="EmployerProfile" component={EmployerProfileScreen} options={{ tabBarLabel: 'โปรไฟล์' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [portal, setPortal] = React.useState(null); // 'seeker' | 'employer' | null
  const seeker = useSeekerAuth();
  const employer = useEmployerAuth();
  const user = seeker?.user || employer?.user || null;
  const booting = (seeker?.loading ?? true) || (employer?.loading ?? true);

  React.useEffect(() => {
    (async () => {
      try { const p = await AsyncStorage.getItem('NEEZS_PORTAL'); setPortal(p); } catch {}
    })();
  }, []);

  // keep portal in sync when auth/session changes
  React.useEffect(() => {
    const syncPortal = async () => {
      try { const p = await AsyncStorage.getItem('NEEZS_PORTAL'); setPortal(p); } catch {}
    };
    authEvents.on('changed', syncPortal);
    return () => authEvents.off('changed', syncPortal);
  }, []);

  // Handle OAuth callback deep links: neezs-job-app://auth-callback?access_token=...&refresh_token=...
  React.useEffect(() => {
    const parseAndStore = async (url) => {
      try {
        const { queryParams } = Linking.parse(url || '');
        const at = queryParams?.access_token;
        const rt = queryParams?.refresh_token;
        if (at || rt) {
          await authApi.setTokens({ access_token: at, refresh_token: rt });
        }
      } catch {}
    };
    const sub = Linking.addEventListener('url', ({ url }) => parseAndStore(url));
    // also handle a possible cold start
    Linking.getInitialURL().then((u) => u && parseAndStore(u));
    return () => sub.remove();
  }, []);

  if (booting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SeekerLogin" component={SeekerLoginScreen} />
            <Stack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
          </>
        ) : portal === 'employer' ? (
          <>
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="EmployerPostDetails" component={EmployerPostDetailsScreen} />
            <Stack.Screen name="EmployerJobLocation" component={EmployerJobLocationScreen} />
            <Stack.Screen name="EmployerMapPicker" component={EmployerMapPickerScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="PortfolioDetail" component={PortfolioDetailScreen} />
            <Stack.Screen name="WorkHistoryEdit" component={WorkHistoryEditScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SeekerAuthProvider>
        <EmployerAuthProvider>
          <AppNavigator />
        </EmployerAuthProvider>
      </SeekerAuthProvider>
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
