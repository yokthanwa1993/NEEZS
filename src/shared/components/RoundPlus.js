import React from 'react';
import { View } from 'react-native';

const RoundPlus = ({ size = 22, color = '#111827', thickness = 4 }) => {
  const radius = thickness / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: thickness, backgroundColor: color, borderRadius: radius }} />
      <View style={{ position: 'absolute', width: thickness, height: size, backgroundColor: color, borderRadius: radius }} />
    </View>
  );
};

export default RoundPlus;

