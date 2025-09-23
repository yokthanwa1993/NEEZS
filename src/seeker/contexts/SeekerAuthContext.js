import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../../shared/services/authApi';
import * as userApi from '../../shared/services/userApi';

const Ctx = createContext({ user: null, loading: true });

export const useSeekerAuth = () => useContext(Ctx);

export function SeekerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await authApi.getToken();
        if (token) {
          const me = await userApi.getMe().catch(() => null);
          if (mounted) setUser(me ? { uid: me.id, ...(me.data || {}) } : null);
        } else {
          if (mounted) setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}

export default SeekerAuthProvider;
