import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Settings } from "lucide-react-native"; // or use another icon library

const Notifications = () => {
    const navigation = useNavigation();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "Case #2024-098 has been moved to the archive folder.",
            dateCreated: "2025-08-07 13:45",
            createdBy: "System",
            createdEarlier: "2 hours ago",
            isRead: false,
        },
        {
            id: 2,
            message: "New evidence file ‘CCTV Footage.zip’ has been shared with you under Case #2025-016.",
            dateCreated: "2025-08-06 17:30",
            createdBy: "Atty. John Cruz",
            createdEarlier: "1 day ago",
            isRead: false,
        },
        {
            id: 3,
            message: "Emma Thompson updated their profile.",
            dateCreated: "2025-08-06 09:12",
            createdBy: "Emma Thompson",
            createdEarlier: "1 day ago",
            isRead: true,
        },
        {
            id: 4,
            message: "Your document has already been approved.",
            dateCreated: "2025-08-05 14:20",
            createdBy: "Admin",
            createdEarlier: "2 days ago",
            isRead: true,
        },
        {
            id: 5,
            message: "Your document upload has been received and logged by the system.",
            dateCreated: "2025-08-05 08:00",
            createdBy: "System",
            createdEarlier: "2 days ago",
            isRead: false,
        },
        {
            id: 6,
            message: "Reminder: Court hearing for Case #2025-019 is tomorrow.",
            dateCreated: "2025-08-04 11:00",
            createdBy: "Paralegal Support",
            createdEarlier: "3 days ago",
            isRead: false,
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const paginatedData = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [notifications]);

    const handleMarkAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
        );
    };

    const handleClearAll = () => {
        Alert.alert("Clear All", "Are you sure you want to clear all notifications?", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear", onPress: () => setNotifications([]), style: "destructive" },
        ]);
    };

    const toggleRead = (id) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
            )
        );
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationBox,
                item.isRead ? styles.read : styles.unread,
            ]}
            onPress={() => toggleRead(item.id)}
        >
            <View style={styles.messageRow}>
                <Text style={styles.messageText}>{item.message}</Text>
                {!item.isRead && <View style={styles.dot} />}
            </View>
            <Text style={styles.meta}>
                By {item.createdBy} · {item.dateCreated} · {item.createdEarlier}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Notifications</Text>
                    <Text style={styles.subtitle}>Manage how you receive updates</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("NotificationSettings")}>
                    <Settings size={22} color="#2563eb" />
                </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllAsRead}>
                    <Text style={styles.actionText}>Mark all as read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
                    <Text style={styles.actionText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            {/* Notification List */}
            {paginatedData.length === 0 ? (
                <Text style={styles.empty}>No notifications found.</Text>
            ) : (
                <FlatList
                    data={paginatedData}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ marginBottom: 12 }}
                />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <View style={styles.pagination}>
                    <TouchableOpacity
                        onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}
                    >
                        <Text style={styles.pageText}>&lt;</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageLabel}>
                        Page {currentPage} of {totalPages}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={[
                            styles.pageBtn,
                            currentPage === totalPages && styles.disabledBtn,
                        ]}
                    >
                        <Text style={styles.pageText}>&gt;</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9fafb",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginBottom: 16,
    },
    actionButton: {
        backgroundColor: "#e5e7eb",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    actionText: {
        fontSize: 12,
        color: "#111827",
    },
    notificationBox: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
    },
    read: {
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
    },
    unread: {
        backgroundColor: "#dbeafe",
        borderColor: "#bfdbfe",
    },
    messageRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    messageText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1f2937",
        flex: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#2563eb",
        marginLeft: 8,
        marginTop: 4,
    },
    meta: {
        fontSize: 11,
        color: "#6b7280",
        marginTop: 4,
    },
    empty: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: 32,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        marginTop: 16,
    },
    pageBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 6,
    },
    disabledBtn: {
        backgroundColor: "#e5e7eb",
        borderColor: "#d1d5db",
    },
    pageText: {
        color: "#1f2937",
        fontSize: 14,
    },
    pageLabel: {
        fontSize: 13,
        color: "#374151",
    },
});

export default Notifications;
