import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';

export default function DevDiagnostics() {
  if (process.env.EXPO_PUBLIC_DIAGNOSTICS !== '1') return null;
  const [state, setState] = useState({ online: null, firestoreReachable: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const net = await Network.getNetworkStateAsync();
        const online = !!net.isConnected && !!net.isInternetReachable;
        let firestoreReachable = null;
        try {
          const res = await fetch('https://firestore.googleapis.com/', { method: 'HEAD' });
          firestoreReachable = res.ok || res.status >= 200; // any response implies reachable
        } catch {
          firestoreReachable = false;
        }
        if (mounted) setState({ online, firestoreReachable });
      } catch {
        if (mounted) setState({ online: null, firestoreReachable: null });
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.item}>Net: {state.online === null ? '—' : state.online ? 'online' : 'offline'}</Text>
      <Text style={styles.item}>Firestore: {state.firestoreReachable === null ? '—' : state.firestoreReachable ? 'reachable' : 'blocked'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  item: { color: '#fff', fontSize: 12 },
});
