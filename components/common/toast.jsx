import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

// Simple reusable toast component
// Props:
// - visible: boolean
// - message: string
// - type: 'success' | 'error' | 'info'
// - onHide: () => void
// - duration: number (ms)
// - position: 'bottom' | 'top' (default bottom)
export default function Toast({ visible, message, type = 'info', onHide, duration = 2200, position = 'bottom' }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      onHide && onHide();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onHide]);

  if (!visible) return null;

  const bg = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#374151';
  const posStyle = position === 'top'
    ? { top: 40, left: 20, right: 20 }
    : { bottom: 40, left: 20, right: 20 };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', ...posStyle }}
    >
      <Pressable
        onPress={onHide}
        style={{ backgroundColor: bg, padding: 14, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>{message}</Text>
      </Pressable>
    </View>
  );
}
