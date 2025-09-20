import React from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Typography';

// Enhanced Button Component
export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false, 
  icon,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#f5c518',
          shadowColor: '#f5c518',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'secondary':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 2,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'google':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dadce0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#111827';
      case 'secondary':
      case 'google':
        return '#374151';
      default:
        return '#111827';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 12,
          opacity: disabled ? 0.6 : 1,
        },
        getButtonStyle(),
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={getTextColor()} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text 
            style={[
              { 
                fontSize: 16, 
                fontWeight: '600',
                color: getTextColor()
              }, 
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Enhanced TextInput Component
export const Input = ({ 
  label, 
  error, 
  icon,
  style,
  ...props 
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <Text style={{ 
          fontSize: 14, 
          fontWeight: '500',
          color: '#374151',
          marginBottom: 8 
        }}>
          {label}
        </Text>
      )}
      <View style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          borderWidth: 1,
          borderColor: error ? '#ef4444' : '#e5e7eb',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
        },
        style
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color="#9ca3af" 
            style={{ marginRight: 12 }} 
          />
        )}
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            color: '#111827',
          }}
          {...props}
        />
      </View>
      {error && (
        <Text style={{ 
          fontSize: 12, 
          color: '#ef4444',
          marginTop: 4,
          marginLeft: 4 
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

// Card Container
export const Card = ({ children, style }) => {
  return (
    <View style={[
      {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      },
      style
    ]}>
      {children}
    </View>
  );
};

export default { Button, Input, Card };
