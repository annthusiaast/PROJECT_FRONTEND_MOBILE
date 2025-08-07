import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft } from "lucide-react-native";
import { styles } from "@/constants/styles/(tabs)/profile_styles"; // reuse styling

export default function Notifications() {
    const [prefs, setPrefs] = useState({
        push: true,
        email: false,
        sms: false,
    });

    // Load stored preferences
    useEffect(() => {
        const loadPrefs = async () => {
            const stored = await AsyncStorage.getItem("notificationPrefs");
            if (stored) setPrefs(JSON.parse(stored));
        };
        loadPrefs();
    }, []);

    // Save preferences
    const savePrefs = async (updatedPrefs) => {
        setPrefs(updatedPrefs);
        await AsyncStorage.setItem("notificationPrefs", JSON.stringify(updatedPrefs));
    };

    const togglePref = (key) => {
        const updated = { ...prefs, [key]: !prefs[key] };
        savePrefs(updated);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar style="dark" />
            <View style={[styles.headerWrapper, { paddingHorizontal: 16 }]}>
                <TouchableOpacity onPress={() => history.back()}>
                    <ArrowLeft size={24} color="#0B3D91" />
                </TouchableOpacity>
                <Text style={[styles.headerContainer, { flex: 1, textAlign: "center" }]}>
                    Notification Preferences
                </Text>
                <View style={{ width: 24 }} /> {/* Spacer */}
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.infoCard}>
                    {[
                        { key: "push", label: "Push Notifications" },
                        { key: "email", label: "Email Notifications" },
                        { key: "sms", label: "SMS Notifications" },
                    ].map((item) => (
                        <View key={item.key} style={styles.infoRow}>
                            <Text style={styles.infoValue}>{item.label}</Text>
                            <Switch
                                value={prefs[item.key]}
                                onValueChange={() => togglePref(item.key)}
                                trackColor={{ false: "#ccc", true: "#0B3D91" }}
                                thumbColor="#fff"
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
