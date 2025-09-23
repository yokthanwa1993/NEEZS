import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from './Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { useSeekerAuth } from '../../seeker/contexts/SeekerAuthContext';
import { useEmployerAuth } from '../../employer/contexts/EmployerAuthContext';
import tailwindConfig from '../../../tailwind.config.js';

const ACTIVE_COLOR = tailwindConfig.theme.extend.colors.accent; // '#f5c518'
// Use black for inactive icons and labels
const INACTIVE_ICON_COLOR = '#111827';
const INACTIVE_LABEL_COLOR = '#111827';

const BottomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const seekerAuth = useSeekerAuth?.() || {};
  const employerAuth = useEmployerAuth?.() || {};
  const user = seekerAuth.user || employerAuth.user || null;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let icon = null;
          // แท็บโปรไฟล์: แสดงรูปโปรไฟล์ถ้ามี หากไม่มีให้ใช้ placeholder
          if (route.name === 'SeekerProfile') {
            const uri = user?.photoURL || `https://i.pravatar.cc/100?u=${user?.uid || 'anon'}`;
            icon = (
              <Image
                source={{ uri }}
                style={{ width: 28, height: 28, borderRadius: 14, borderWidth: isFocused ? 2 : 0, borderColor: ACTIVE_COLOR }}
              />
            );
          } else if (typeof options.tabBarIcon === 'function') {
            icon = options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? ACTIVE_COLOR : INACTIVE_ICON_COLOR,
              size: 30,
            });
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={styles.item}
            >
              <View style={[styles.iconWrapper]}>
                {icon}
              </View>
              <Text weight={900} style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
  },
  labelActive: {
    color: ACTIVE_COLOR,
  },
  labelInactive: {
    color: INACTIVE_LABEL_COLOR,
  },
});

export default BottomTabBar;
