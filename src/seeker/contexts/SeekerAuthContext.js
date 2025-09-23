import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../../shared/services/authApi';
import * as userApi from '../../shared/services/userApi';
import { authEvents } from '../../shared/services/authEvents';

const Ctx = createContext({ user: null, loading: true });

export const useSeekerAuth = () => useContext(Ctx);

export function SeekerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const token = await authApi.getToken();
        if (token) {
          try {
            const me = await userApi.getMe();
            if (mounted) setUser({ uid: me.id, ...(me.data || {}) });
          } catch {
            await authApi.logout();
            if (mounted) setUser(null);
          }
        } else {
          if (mounted) setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMe();
    const onChanged = () => fetchMe();
    authEvents.on('changed', onChanged);
    return () => { mounted = false; authEvents.off('changed', onChanged); };
  }, []);

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}

export default SeekerAuthProvider;
