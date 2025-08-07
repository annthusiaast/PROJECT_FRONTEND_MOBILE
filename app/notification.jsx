import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

const notificationsData = [
  { id: '1', message: 'Case #2024-098 has been moved to the archive folder.', read: false },
  { id: '2', message: "New evidence file 'CCTV Footage.zip' has been shared with you under Case #2025-016.", read: false },
  { id: '3', message: 'Emma Thompson updated their profile.', read: false },
  { id: '4', message: 'Your document has already been approved.', read: false },
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

  const renderItem = ({ item }) => (
    <View style={[styles.notificationBox, item.read && styles.readNotification]}>
      <Checkbox
        value={item.read}
        onValueChange={() => toggleRead(item.id)}
        color={item.read ? '#0B3D91' : undefined}
      />
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Manage how you receive notifications and updates</Text>

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

      {/* Pagination (Dummy) */}
      <View style={styles.pagination}>
        <TouchableOpacity style={[styles.pageBtn, styles.activePage]}><Text>1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.pageBtn}><Text>2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.pageBtn}><Text>3</Text></TouchableOpacity>
      </View>

      <Text style={styles.footer}>Showing {notifications.length} of 42 notifications</Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9FC', padding: 50 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  button: { backgroundColor: '#E3E7EB', padding: 8, borderRadius: 6, marginLeft: 8 },
  buttonText: { fontWeight: '600', color: '#333' },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  readNotification: { opacity: 0.6 },
  notificationText: { marginLeft: 10, fontSize: 14, flex: 1 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  pageBtn: {
    padding: 8,
    margin: 4,
    backgroundColor: '#E9ECF2',
    borderRadius: 5,
  },
  activePage: { backgroundColor: '#BFD4FF' },
  footer: { textAlign: 'center', marginTop: 5, color: '#666' },
});
