import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Unauthorized = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <MaterialIcons
                    name="lock-outline"
                    size={48}
                    color="#ef4444"
                    style={styles.icon}
                />
                <Text style={styles.title}>Unauthorized Access</Text>
                <Text style={styles.message}>
                    You don’t have permission to view this page. Please contact your
                    administrator or go back.
                </Text>

                {/* Go Back Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#3b82f6", marginTop: 12 }]}
                    onPress={() => router.push("/auth/verification")}
                >
                    <Text style={styles.buttonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        maxWidth: 350,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    icon: {
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 15,
        color: "#6b7280",
        marginBottom: 18,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#ef4444",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 32,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Unauthorized;
