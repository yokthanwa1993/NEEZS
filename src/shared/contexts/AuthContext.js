import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fast path: cached role
        try {
          const cached = await AsyncStorage.getItem('NEEZS_ROLE');
          if (cached) setRole(cached);
        } catch {}
        setLoading(false);

        // Background verify from Firestore (do not override cached role unless server provides explicit lastRole)
        getDocFromServer(doc(db, 'users', u.uid))
          .then(async (snap) => {
            if (!snap.exists()) return;
            const data = snap.data() || {};
            const serverRole = data.lastRole || null;
            if (serverRole && serverRole !== role) {
              setRole(serverRole);
              try { await AsyncStorage.setItem('NEEZS_ROLE', serverRole); } catch {}
            }
          })
          .catch(() => {});
      } else {
        setRole(null);
        try { await AsyncStorage.removeItem('NEEZS_ROLE'); } catch {}
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [role]);

  const value = {
    user,
    loading,
    role,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
