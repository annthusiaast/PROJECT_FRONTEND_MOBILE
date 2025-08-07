import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Clock } from "lucide-react-native";
import { styles } from "@/constants/styles/(tabs)/profile_styles";

// Dummy logs
const sampleLogs = [
    { id: 1, action: "Logged in", time: "2025-08-07 09:12 AM" },
    { id: 2, action: "Edited profile", time: "2025-08-06 04:25 PM" },
    { id: 3, action: "Changed password", time: "2025-08-05 11:14 AM" },
    { id: 4, action: "Viewed case C54321", time: "2025-08-05 10:05 AM" },
];

export default function ActivityLogs() {
    const [logs, setLogs] = useState(sampleLogs);

    useEffect(() => {
        // Later: fetch logs from backend
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar style="dark" />
            <View style={[styles.headerWrapper, { paddingHorizontal: 16 }]}>
                <TouchableOpacity onPress={() => history.back()}>
                    <ArrowLeft size={24} color="#0B3D91" />
                </TouchableOpacity>
                <Text style={[styles.headerContainer, { flex: 1, textAlign: "center" }]}>
                    Activity Logs
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.infoCard}>
                    {logs.map((log) => (
                        <View key={log.id} style={[styles.infoRow, { justifyContent: "space-between" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Clock size={18} color="#0B3D91" style={{ marginRight: 8 }} />
                                <Text style={styles.infoValue}>{log.action}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: "#888" }}>{log.time}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
