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
import { Search, Eye, X } from "lucide-react-native";
import { sampleClients } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/case_styles";

const ViewClients = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState(sampleClients || []);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", contactPersonName: "", contactPersonNum: "", relation_role: "", });

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
        setFormData({ name: "", email: "", phone: "", contactPersonName: "", contactPersonNum: "", relation_role: "", });
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
                        <View
                            key={client.id}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 12,
                                marginTop: 12,
                                borderWidth: 1,
                                borderColor: "#ddd",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#0B3D91" }}>
                                    {client.name}
                                </Text>
                                <Text style={{ color: "#666" }}>📧 {client.email}</Text>
                                <Text style={{ color: "#666" }}>📱 {client.phone}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginLeft: 8 }}>
                                <TouchableOpacity
                                    onPress={() => openViewModal(client)}
                                    style={{
                                        padding: 6,
                                        borderRadius: 8,
                                        backgroundColor: "#0B3D91",
                                        marginRight: 6,
                                    }}
                                >
                                    <Eye size={18} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => openEditModal(client)}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        backgroundColor: "#f0ad4e",
                                        marginRight: 6,
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => deleteClient(client.id)}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        backgroundColor: "#d9534f",
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
                        No clients found.
                    </Text>
                )}
            </ScrollView>

            {/* View Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeViewModal}>
                <View style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flex: 1,
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
                            onPress={closeViewModal}
                            style={{ position: "absolute", top: 10, right: 10, padding: 4 }}
                        >
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0B3D91", marginBottom: 10 }}>
                            {selectedClient?.name}
                        </Text>
                        <Text>📧 Email: {selectedClient?.email}</Text>
                        <Text>📱 Phone: {selectedClient?.phone}</Text>
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

                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor= '#121313ff'
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                                textcolor: "#0B3D91",
                            }}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor= '#121313ff'
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor= '#121313ff'
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />

                        <TextInput
                            placeholder="Contact Person Name"
                            placeholderTextColor= '#121313ff'
                            value={formData.contactPersonName}
                            onChangeText={(text) => setFormData({ ...formData, contactPersonName: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />

                        <TextInput
                            placeholder="Contact Person Number"
                            placeholderTextColor= '#121313ff'
                            value={formData.contactPersonNum}
                            onChangeText={(text) => setFormData({ ...formData, contactPersonNum: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />

                        <TextInput
                            placeholder="Relation/Role"
                            placeholderTextColor= '#121313ff'
                            value={formData.relation_role}
                            onChangeText={(text) => setFormData({ ...formData, relation_role: text })}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />


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
