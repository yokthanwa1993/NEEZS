import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// A shared screen wrapper to normalize page layout.
// Defaults to vertical centering; can be disabled per-screen via `center={false}`.
// If `scroll` is true, wraps children in a ScrollView and applies
// `contentContainerStyle` with flexGrow + optional centering.
export default function ScreenContainer({
  children,
  center = true,
  scroll = false,
  edges = ['top'],
  style,
  contentStyle,
  paddingHorizontal = 16,
  ...props
}) {
  const containerStyle = [
    { flex: 1, backgroundColor: '#ffffff', paddingHorizontal },
    style,
  ];

  const innerStyle = [
    { flexGrow: 1 },
    center && { justifyContent: 'center' },
    contentStyle,
  ];

  return (
    <SafeAreaView edges={edges} style={containerStyle}>
      {scroll ? (
        <ScrollView contentContainerStyle={innerStyle} keyboardShouldPersistTaps="handled" {...props}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, center && { justifyContent: 'center' }, contentStyle]} {...props}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

