import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    // ====== Container ======
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16
    },

    // ====== Header ======
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
        alignItems: "center"
    },
    dateText: {
        fontSize: 12,
        color: "#555"
    },

    // ======Profile title ======
    profileContainer: {
        color: '#1d1d66ff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Sans-serif',
        padding: 5,
        marginLeft: -5,
    },

    // ====== Profile Card ======
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        alignItems: "center",
        padding: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#ccc",
        marginBottom: 10
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0B3D91"
    },
    role: {
        fontSize: 14,
        color: "#777",
        marginBottom: 8
    },

    // ====== Edit & Save Buttons ======
    editBtn: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#0B3D91",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
    },
    editBtnText: {
        color: "#0B3D91",
        fontSize: 12,
        marginLeft: 5
    },
    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10
    },
    saveBtn: {
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
    },
    saveText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold"
    },

    // ====== Info Card ======
    infoCard: {
        marginTop: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14
    },
    infoLabel: {
        fontSize: 12,
        color: "#777",
        marginLeft: 10
    },
    infoValue: {
        fontSize: 14,
        color: "#0B3D91",
        marginLeft: 10
    },

    // ====== Input Fields ======
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        width: "80%",
        textAlign: "center",
        marginVertical: 5,
        fontSize: 14,
        padding: 4,
        color: "#0B3D91",
    },
    inputInline: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 2,
        fontSize: 14,
        color: "#0B3D91",
        marginLeft: 10,
        minWidth: 180,
    },

    // ====== Settings Card ======
    settingsCard: {
        marginTop: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    settingsItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    settingsText: {
        marginLeft: 10,
        color: "#0B3D91",
        fontSize: 14
    },

    // ====== Sign Out Button ======
    signOutBtn: {
        backgroundColor: "#0B3D91",
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 20,
        alignItems: "center",
    },
    signOutText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14
    },
});
