import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Alert,
} from "react-native";
import {
    Mail,
    Phone,
    X,
    Pencil,
    Trash2,
} from "lucide-react-native";
import { sampleClients } from "@/constants/sample_data";

const ViewClients = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState(sampleClients || []);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", contactPersonName: "",
        contactPersonNum: "", relation_role: "",
    });

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openViewModal = (client) => {
        setSelectedClient(client);
        setModalVisible(true);
    };

    const closeViewModal = () => {
        setSelectedClient(null);
        setModalVisible(false);
    };

    const openAddModal = () => {
        setFormData({
            name: "", email: "", phone: "", contactPersonName: "",
            contactPersonNum: "", relation_role: "",
        });
        setEditModalVisible(true);
    };

    const openEditModal = (client) => {
        setFormData(client);
        setEditModalVisible(true);
    };

    const saveClient = () => {
        if (!formData.name.trim()) {
            Alert.alert("Error", "Name is required");
            return;
        }
        if (formData.id) {
            setClients(clients.map((c) => (c.id === formData.id ? formData : c)));
        } else {
            setClients([...clients, { ...formData, id: Date.now() }]);
        }
        setEditModalVisible(false);
    };

    const deleteClient = (clientId) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this client?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => setClients(clients.filter((c) => c.id !== clientId)),
            },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Sticky Header */}
            <View
                style={{
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    zIndex: 10,
                }}
            >
                {/* Buttons Row */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            borderWidth: 1.5,
                            borderColor: "#0B3D91",
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                            backgroundColor: "#0B3D91",
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>All Clients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openAddModal}
                        style={{
                            flex: 1,
                            borderWidth: 1.5,
                            borderColor: "#0B3D91",
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#0B3D91", fontWeight: "bold" }}>+ Add Client</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Clients List */}
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                        <TouchableOpacity
                            key={client.id}
                            onPress={() => openViewModal(client)}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 12,
                                marginTop: 12,
                                borderWidth: 1,
                                borderColor: "#ddd",
                            }}
                        >
                            <View style={{ flex: 1 }}>

                                {/* Name row */}
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#0B3D91" }}>
                                        {client.name}
                                    </Text>
                                </View>

                                {/* Email row */}
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                    <Mail color="#0B3D91" size={16} style={{ marginRight: 10 }} />
                                    <Text style={{ color: "#666" }}>{client.email}</Text>
                                </View>

                                {/* Phone row */}
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Phone color="#0B3D91" size={16} style={{ marginRight: 10 }} />
                                    <Text style={{ color: "#666" }}>{client.phone}</Text>
                                </View>
                            </View>

                            {/* Edit & Delete Buttons */}
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        openEditModal(client);
                                    }}
                                    style={{
                                        padding: 5,
                                        borderRadius: 7,
                                        backgroundColor: "#f0ad4e",
                                        marginRight: 6,
                                    }}
                                >
                                    <Pencil color="#fff" size={16} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        deleteClient(client.id);
                                    }}
                                    style={{
                                        padding: 5,
                                        borderRadius: 7,
                                        backgroundColor: "#d9534f",
                                    }}
                                >
                                    <Trash2 color="#fff" size={16} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
                        No clients found.
                    </Text>
                )}
            </ScrollView>

            {/* View Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeViewModal}>
                <View
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            padding: 20,
                            width: "100%",
                            maxWidth: 400,
                            maxHeight: "90%",
                        }}
                    >
                        <TouchableOpacity
                            onPress={closeViewModal}
                            style={{ position: "absolute", top: 10, right: 10, padding: 4 }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#0B3D91",
                            marginBottom: 16,
                        }}>
                            {selectedClient?.name}
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                                {[
                                    { label: "Email:", value: selectedClient?.email },
                                    { label: "Phone:", value: selectedClient?.phone },
                                    { label: "Contact Person:", value: selectedClient?.contactPersonName },
                                    { label: "Contact Number:", value: selectedClient?.contactPersonNum },
                                    { label: "Relation/Role:", value: selectedClient?.relation_role },
                                    { label: "Date Created:", value: selectedClient?.dateCreated },
                                    { label: "Created By:", value: selectedClient?.createdBy },
                                ].map((item, index) => (
                                    <View key={index} style={{ width: "48%" }}>
                                        <Text style={{ fontWeight: "600", fontSize: 12, color: "#555" }}>
                                            {item.label}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: "#000", marginTop: 4 }}>
                                            {item.value || "—"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Add/Edit Modal */}
            <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        padding: 20,
                        width: "100%",
                        maxWidth: 400,
                    }}>
                        <TouchableOpacity
                            onPress={() => setEditModalVisible(false)}
                            style={{ position: "absolute", top: 10, right: 10, padding: 4 }}
                        >
                            <X size={24} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                            {formData.id ? "Edit Client" : "Add Client"}
                        </Text>

                        {[
                            { placeholder: "Full Name", key: "name" },
                            { placeholder: "Email", key: "email" },
                            { placeholder: "Phone Number", key: "phone" },
                            { placeholder: "Contact Person Name", key: "contactPersonName" },
                            { placeholder: "Contact Person Number", key: "contactPersonNum" },
                            { placeholder: "Relation/Role", key: "relation_role" },
                        ].map((input) => (
                            <TextInput
                                key={input.key}
                                placeholder={input.placeholder}
                                placeholderTextColor="#121313ff"
                                value={formData[input.key]}
                                onChangeText={(text) => setFormData({ ...formData, [input.key]: text })}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ddd",
                                    borderRadius: 6,
                                    padding: 8,
                                    marginBottom: 8,
                                }}
                            />
                        ))}

                        <TouchableOpacity
                            onPress={saveClient}
                            style={{
                                backgroundColor: "#0B3D91",
                                padding: 10,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ViewClients;
