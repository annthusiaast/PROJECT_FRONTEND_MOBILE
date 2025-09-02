import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Pencil, Trash2 } from "lucide-react-native"; // works with lucide-react-native
import { useAuth } from "@/context/auth-context"; // keep same context

const ClientContact = () => {
  const { user } = useAuth();

  const [tableData, setTableData] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [removeContactModalOpen, setRemoveContactModalOpen] = useState(false);
  const [contactToBeRemoved, setContactToBeRemoved] = useState(null);

  // Fetch contacts + clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const client_contacts_endpoint =
          user?.user_role === "Admin"
            ? "http://localhost:3000/api/client-contacts"
            : `http://localhost:3000/api/a-lawyer-client-contacts/${user.user_id}`;

        const clients_endpoint =
          user?.user_role === "Admin"
            ? "http://localhost:3000/api/clients"
            : `http://localhost:3000/api/clients/${user.user_id}`;

        const [contactsRes, clientsRes] = await Promise.all([
          fetch(client_contacts_endpoint, { credentials: "include" }),
          fetch(clients_endpoint, { credentials: "include" }),
        ]);

        if (!contactsRes.ok || !clientsRes.ok) {
          throw new Error("Failed to fetch contacts or clients.");
        }

        setTableData(await contactsRes.json());
        setClients(await clientsRes.json());
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  const getClientNameById = (id) => {
    const client = clients.find((c) => c.client_id === id);
    return client ? client.client_fullname : "Unknown";
  };

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedContacts = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleContactRemoval = async (contact) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/client-contacts/${contact.contact_id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to remove contact.");

      setTableData((prev) =>
        prev.filter((item) => item.contact_id !== contact.contact_id)
      );
      setRemoveContactModalOpen(false);
      setContactToBeRemoved(null);
    } catch (err) {
      Alert.alert("Error", "Error removing contact.");
    }
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactCard}>
      <Text style={styles.contactName}>{item.contact_fullname}</Text>
      <Text style={styles.contactText}>{item.contact_email}</Text>
      <Text style={styles.contactText}>{item.contact_phone}</Text>
      <Text style={styles.contactText}>{item.contact_role}</Text>
      <Text style={styles.contactText}>{getClientNameById(item.client_id)}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => setEditContact(item)}>
          <Pencil color="orange" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setContactToBeRemoved(item);
            setRemoveContactModalOpen(true);
          }}
        >
          <Trash2 color="red" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>{error.message}</Text>}

      <View style={styles.header}>
        <Text style={styles.title}>Clients &gt; Contacts</Text>
        <Text style={styles.subtitle}>
          Manage all client contacts information here...
        </Text>
      </View>

      {/* Search + Add Contact */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search client contacts..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <FlatList
        data={paginatedContacts}
        keyExtractor={(item) => item.contact_id.toString()}
        renderItem={renderContactItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No client contacts found.</Text>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageButton}>{">"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Remove Confirmation Modal */}
      <Modal
        visible={removeContactModalOpen}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Contact Removal</Text>
            <Text>
              Remove{" "}
              <Text style={{ fontWeight: "bold" }}>
                {contactToBeRemoved?.contact_fullname}
              </Text>
              ?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setRemoveContactModalOpen(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleContactRemoval(contactToBeRemoved)}
              >
                <Text style={{ color: "white" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ClientContact;

