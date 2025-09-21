import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { getEndpoint } from '@/constants/api-config';

// Reusable notifications component. Designed to be placed inside a Modal.
// Props:
// - onClose?: () => void  -> when provided, shows a close button.
// - style?: object        -> optional style overrides for the container.
export default function Notifications({ onClose, style }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getEndpoint('/notifications'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.map((n, idx) => ({
              id: String(n.notification_id || n.id || idx),
              message: n.notification_message || n.message || n.title || 'Notification',
              read: Boolean(n.is_read ?? n.read ?? false),
              raw: n,
            }))
          : [];
        setNotifications(mapped);
      } catch (e) {
        setError(e.message || 'Unable to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const toggleRead = (id) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
    // TODO: Optionally call backend to persist read state if endpoint exists
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    // TODO: Persist if backend supports it
  };

  const clearAll = () => {
    setNotifications([]);
    // TODO: Persist if backend supports delete/clear
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationRow, item.read && styles.readNotification]}
      onPress={() => toggleRead(item.id)}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: item.read ? '#A0AEC0' : '#0B3D91' },
        ]}
      />
      <Text style={[styles.notificationText, !item.read && styles.unreadText]}>
        {item.message}
      </Text>
      <Text style={styles.statusLabel}>{item.read ? 'Read' : 'Unread'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, style]}> 
      {/* Header with optional close */}
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0B3D91', flex: 1 }}>Notifications</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close notifications">
            <X size={22} color="#0B3D91" />
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.button} onPress={markAllRead}>
          <Text style={styles.buttonText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearAll}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#0B3D91" />
        </View>
      ) : error ? (
        <View style={{ padding: 12 }}>
          <Text style={{ color: '#b00020' }}>{error}</Text>
        </View>
      ) : (
        <FlatList data={notifications} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FC',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E3E7EB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 13,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  readNotification: {
    opacity: 0.6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  unreadText: {
    fontWeight: '600',
    color: '#000',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});
