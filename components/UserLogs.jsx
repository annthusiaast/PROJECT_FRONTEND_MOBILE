import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    StyleSheet,
} from 'react-native';

const dummyLogs = [
    {
        id: '1',
        user: 'Joshua Garcia',
        avatar: 'https://i.pravatar.cc/100?img=1',
        action: 'Logged in',
        timestamp: '2025-08-07 09:21 AM',
    },
    {
        id: '2',
        user: 'Lara Cruz',
        avatar: 'https://i.pravatar.cc/100?img=2',
        action: 'Viewed Case #C10234',
        timestamp: '2025-08-07 08:45 AM',
    },
    {
        id: '3',
        user: 'Mico Reyes',
        avatar: 'https://i.pravatar.cc/100?img=3',
        action: 'Edited user profile',
        timestamp: '2025-08-06 05:12 PM',
    },
    {
        id: '4',
        user: 'Alyssa Tan',
        avatar: 'https://i.pravatar.cc/100?img=4',
        action: 'Deleted Document "Contract_Draft.pdf"',
        timestamp: '2025-08-06 04:03 PM',
    },
    {
        id: '5',
        user: 'Kevin Santos',
        avatar: 'https://i.pravatar.cc/100?img=5',
        action: 'Logged out',
        timestamp: '2025-08-06 03:30 PM',
    },
];

const UserLogs = () => {
    const [search, setSearch] = useState('');

    const filteredLogs = dummyLogs.filter(
        (log) =>
            log.user.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <View style={styles.logItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.logDetails}>
                <Text style={styles.userName}>{item.user}</Text>
                <Text style={styles.action}>{item.action}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search user or action..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredLogs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No matching logs found.</Text>
                }
            />
        </View>
    );
};

export default UserLogs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchInput: {
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 16,
        color: '#111827',
    },
    logItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    logDetails: {
        flex: 1,
    },
    userName: {
        fontWeight: '600',
        fontSize: 16,
        color: '#111827',
    },
    action: {
        fontSize: 14,
        color: '#374151',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 40,
    },
});
