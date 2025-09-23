import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../../shared/config/firebase';
import * as userApi from '../../shared/services/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import sessionUrlProvider from 'expo-auth-session/build/SessionUrlProvider';

WebBrowser.maybeCompleteAuthSession();

async function ensureEmployerRole(user) {
  try {
    await userApi.ensureRole('employer');
  } catch (e) {
    // Fallback to client-side write when backend not running
    const ref = doc(db, 'users', user.uid);
    try {
      const snap = await getDocFromServer(ref);
      if (!snap.exists()) {
        await setDoc(
          ref,
          {
            roles: { employer: true },
            lastRole: 'employer',
            email: user.email || null,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        await setDoc(ref, { roles: { employer: true }, lastRole: 'employer' }, { merge: true });
      }
    } catch {}
  }
  try { await AsyncStorage.multiSet([['NEEZS_ROLE','employer'], ['NEEZS_PORTAL','employer']]); } catch {}
}

export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureEmployerRole(cred.user);
  return { success: true, user: cred.user };
}

export async function signInWithGoogle() {
  const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const WEB_CLIENT_SECRET = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;
  const returnUrl = AuthSession.makeRedirectUri();
  const projectFullName = '@yokthanwa1993/neezs-job-app';
  const redirectUri = sessionUrlProvider.getRedirectUrl({ projectNameForProxy: projectFullName });
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const request = new AuthSession.AuthRequest({ clientId: WEB_CLIENT_ID, scopes: ['openid','profile','email'], redirectUri, responseType: AuthSession.ResponseType.Code, usePKCE: false });
  const authUrl = await request.makeAuthUrlAsync(discovery);
  const startUrl = sessionUrlProvider.getStartUrl(authUrl, returnUrl, projectFullName);
  const res = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl);
  if (res.type !== 'success') return { success:false, error:'ยกเลิกหรือปิดหน้าล็อกอิน' };
  const parsed = request.parseReturnUrl(res.url);
  if (parsed.type !== 'success') return { success:false, error:'ไม่สามารถรับ authorization code' };
  if (!WEB_CLIENT_SECRET) return { success:false, error:'ยังไม่ได้ตั้งค่า EXPO_PUBLIC_GOOGLE_CLIENT_SECRET' };
  const tokenResponse = await AuthSession.exchangeCodeAsync({ clientId: WEB_CLIENT_ID, clientSecret: WEB_CLIENT_SECRET, redirectUri, code: parsed.params.code }, discovery);
  const { accessToken, idToken } = tokenResponse;
  const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken ?? undefined);
  const userCred = await signInWithCredential(auth, credential);
  await ensureEmployerRole(userCred.user);
  return { success:true, user: userCred.user };
}

export async function signOutUser() {
  await signOut(auth);
  try { await AsyncStorage.multiRemove(['NEEZS_ROLE','NEEZS_PORTAL']); } catch {}
  return { success: true };
}

export default { signInWithEmail, signInWithGoogle, signOutUser };
