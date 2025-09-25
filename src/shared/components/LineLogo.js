import React from 'react';
import { View } from 'react-native';
import { Text } from './Typography';

// A tiny LINE style speech bubble logo built with views (no external assets)
// Props: size (number)
export default function LineLogo({ size = 22 }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
        <Text weight={800} style={{ color: '#06C755', fontSize: s * 0.45, lineHeight: s * 0.8 }}>LINE</Text>
      </View>
      {/* small tail */}
      <View style={{ position: 'absolute', bottom: -s * 0.08, left: s * 0.42, width: s * 0.16, height: s * 0.16, backgroundColor: '#ffffff', transform: [{ rotate: '45deg' }], borderRadius: 2 }} />
    </View>
  );
}

