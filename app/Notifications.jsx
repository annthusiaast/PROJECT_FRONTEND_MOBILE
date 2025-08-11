import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const notificationsData = [
  { id: '1', message: 'Case #2024-098 has been moved to the archive folder.', read: false },
  { id: '2', message: "New evidence file 'CCTV Footage.zip' has been shared with you under Case #2025-016.", read: false },
  { id: '3', message: 'Emma Thompson updated their profile.', read: true },
  { id: '4', message: 'Your document has already been approved.', read: true },
  { id: '5', message: 'Your document upload has been received and logged by the system.', read: false },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  const toggleRead = (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleBack = () => {
    try {
      router.back(); // Go to previous page
    } catch (e) {
      router.push('/dashboard'); // Fallback if no history
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationRow, item.read && styles.readNotification]}
      onPress={() => toggleRead(item.id)}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: item.read ? '#A0AEC0' : '#0B3D91' }
        ]}
      />
      <Text
        style={[
          styles.notificationText,
          !item.read && styles.unreadText
        ]}
      >
        {item.message}
      </Text>
      <Text style={styles.statusLabel}>
        {item.read ? 'Read' : 'Unread'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.button} onPress={markAllRead}>
          <Text style={styles.buttonText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearAll}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FC',
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#E3E7EB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8
  },
  buttonText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 13
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
    opacity: 0.6
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  unreadText: {
    fontWeight: '600',
    color: '#000'
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8
  }
});
