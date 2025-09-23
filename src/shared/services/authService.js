import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import sessionUrlProvider from 'expo-auth-session/build/SessionUrlProvider';
import { Platform } from 'react-native';

// สำหรับ Expo AuthSession
WebBrowser.maybeCompleteAuthSession();

// Email/Password Sign In (role handled separately)
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Email/Password Sign Up (role handled separately)
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Ensure user document exists and record that this account can use the expectedRole as well.
// Supports multi-role accounts via { roles: { seeker: true, employer: true }, lastRole }
const ensureUserRole = async (user, expectedRole) => {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDocFromServer(ref).catch(() => null);
  if (!snap) {
    // Network failed; keep going with expectedRole and write when possible
    try {
      await setDoc(
        ref,
        {
          roles: { [expectedRole]: true },
          lastRole: expectedRole,
          createdAt: serverTimestamp(),
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        },
        { merge: true }
      );
    } catch {}
    try { await AsyncStorage.setItem('NEEZS_ROLE', expectedRole); } catch {}
    return { success: true, role: expectedRole };
  }
  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        roles: { [expectedRole]: true },
        lastRole: expectedRole,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    try { await AsyncStorage.setItem('NEEZS_ROLE', expectedRole); } catch {}
    return { success: true, role: expectedRole };
  }
  const data = snap.data() || {};
  const roles = { ...(data.roles || {}) };
  // migrate legacy single-role field if exists
  if (data.role && !roles[data.role]) roles[data.role] = true;
  roles[expectedRole] = true;
  await setDoc(ref, { roles, lastRole: expectedRole }, { merge: true });
  try { await AsyncStorage.setItem('NEEZS_ROLE', expectedRole); } catch {}
  return { success: true, role: expectedRole };
};

// Google Sign In — ใช้ Code Flow ผ่าน Expo Proxy (รองรับ Expo Go)
export const signInWithGoogle = async () => {
  try {
    // ค่าที่ต้องมี (Web client สำหรับ OAuth)
    const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '901801924600-68t18168o31rqt5344alnmvvoflddc1n.apps.googleusercontent.com';
    const WEB_CLIENT_SECRET = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;

    // 1) returnUrl = exp://... เพื่อกลับเข้าแอป
    const returnUrl = AuthSession.makeRedirectUri();
    // 2) redirectUri (สำหรับ Google) = https://auth.expo.io/@user/slug ที่คุณเพิ่มไว้ใน Google Console
    const projectFullName = '@yokthanwa1993/neezs-job-app';
    const redirectUri = sessionUrlProvider.getRedirectUrl({ projectNameForProxy: projectFullName });

    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');

    // ขอ code (ปิด PKCE เพราะ Google Web client ไม่รับ)
    const request = new AuthSession.AuthRequest({
      clientId: WEB_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri, // <- https://auth.expo.io/@user/slug
      responseType: AuthSession.ResponseType.Code,
      usePKCE: false,
    });

    const authUrl = await request.makeAuthUrlAsync(discovery);
    const startUrl = sessionUrlProvider.getStartUrl(authUrl, returnUrl, projectFullName);

    // เปิดเบราว์เซอร์ผ่าน proxy
    const res = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl);
    if (res.type !== 'success') {
      return { success: false, error: 'ยกเลิกหรือปิดหน้าล็อกอิน' };
    }

    // แปลง URL ที่กลับมาเป็นผลลัพธ์ OAuth
    const parsed = request.parseReturnUrl(res.url);
    if (parsed.type !== 'success') {
      return { success: false, error: 'ไม่สามารถรับ authorization code' };
    }

    const code = parsed.params.code;
    if (!code) return { success: false, error: 'ไม่ได้รับ authorization code' };

    if (!WEB_CLIENT_SECRET) {
      return { success: false, error: 'ยังไม่ได้ตั้งค่า EXPO_PUBLIC_GOOGLE_CLIENT_SECRET' };
    }

    // แลก code เป็น token (ต้องใช้ clientSecret กับ Web client)
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: WEB_CLIENT_ID,
        clientSecret: WEB_CLIENT_SECRET,
        redirectUri,
        code,
      },
      discovery
    );

    const { accessToken, idToken } = tokenResponse;
    if (!accessToken && !idToken) {
      return { success: false, error: 'ไม่ได้รับโทเคนจาก Google' };
    }

    const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken ?? undefined);
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google' };
  }
};

// Create user profile document if it doesn't exist
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const { role, ...restData } = additionalData;
  const collectionName = role === 'seeker' ? 'SeekerUser' : 'EmployerUser';

  // Create role document in 'users' collection
  const userRoleRef = doc(db, `users/${userAuth.uid}`);
  const userRoleSnap = await getDoc(userRoleRef);
  if (!userRoleSnap.exists()) {
    await setDoc(userRoleRef, { role });
  }

  // Create profile document in the specific collection
  const userProfileRef = doc(db, `${collectionName}/${userAuth.uid}`);
  const userProfileSnap = await getDoc(userProfileRef);

  if (!userProfileSnap.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = serverTimestamp();
    try {
      await setDoc(userProfileRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...restData,
      });
    } catch (error) {
      console.log(`error creating ${collectionName}`, error.message);
    }
  }

  return userProfileRef;
};

// Convenience wrappers to enforce role for each portal
export const signInSeekerWithEmail = async (email, password) => {
  const res = await signInWithEmail(email, password);
  if (!res.success) return res;
  const roleCheck = await ensureUserRole(res.user, 'seeker');
  if (!roleCheck.success) return { success: false, error: roleCheck.message || 'บัญชีไม่ตรงประเภท (seeker)' };
  try { await AsyncStorage.setItem('NEEZS_ROLE', 'seeker'); } catch {}
  return res;
};

export const signInEmployerWithEmail = async (email, password) => {
  const res = await signInWithEmail(email, password);
  if (!res.success) return res;
  const roleCheck = await ensureUserRole(res.user, 'employer');
  if (!roleCheck.success) return { success: false, error: roleCheck.message || 'บัญชีไม่ตรงประเภท (employer)' };
  try { await AsyncStorage.setItem('NEEZS_ROLE', 'employer'); } catch {}
  return res;
};

export const signInSeekerWithGoogle = async () => {
  const res = await signInWithGoogle();
  if (!res.success) return res;
  const roleCheck = await ensureUserRole(res.user, 'seeker');
  if (!roleCheck.success) return { success: false, error: roleCheck.message || 'บัญชีไม่ตรงประเภท (seeker)' };
  try { await AsyncStorage.setItem('NEEZS_ROLE', 'seeker'); } catch {}
  return res;
};

export const signInEmployerWithGoogle = async () => {
  const res = await signInWithGoogle();
  if (!res.success) return res;
  const roleCheck = await ensureUserRole(res.user, 'employer');
  if (!roleCheck.success) return { success: false, error: roleCheck.message || 'บัญชีไม่ตรงประเภท (employer)' };
  try { await AsyncStorage.setItem('NEEZS_ROLE', 'employer'); } catch {}
  return res;
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('NEEZS_ROLE');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth State Listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInSeekerWithEmail,
  signInEmployerWithEmail,
  signInSeekerWithGoogle,
  signInEmployerWithGoogle,
  signOutUser,
  onAuthStateChange,
};
