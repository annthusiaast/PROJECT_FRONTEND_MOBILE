import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import {
  Pencil,
  Trash2,
  Eye,
  RefreshCcw,
} from "lucide-react-native";
import { styles } from "../constants/styles/view-clients"; 

//api
import { getEndpoint } from "../constants/api-config";

const ViewClients = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState(null);

  const [viewClient, setViewClient] = useState(null);
  const [editClient, setEditClient] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // fetch all
  const fetchAll = useCallback(async () => {
    if (!user) return;

    try {
      const clients_endpoint =
        user.user_role === "Admin"
          ? showAllClients
            ? getEndpoint("/all-clients")
            : getEndpoint("/clients")
          : getEndpoint(`/clients/${user.user_id}`);

      console.log("Fetching from:", clients_endpoint);

      const [cRes, uRes, ctRes] = await Promise.all([
        fetch(clients_endpoint),
        fetch(getEndpoint("/users")),
        fetch(getEndpoint("/client-contacts")),
      ]);

      if (!cRes.ok || !uRes.ok || !ctRes.ok)
        throw new Error("Fetch failed");

      const [cData, uData, ctData] = await Promise.all([
        cRes.json(),
        uRes.json(),
        ctRes.json(),
      ]);

      setClients(cData);
      setUsers(uData);
      setContacts(ctData);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  }, [user, showAllClients]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [fetchAll, user]);

  const getUserFullName = (createdBy) => {
    const u = users.find((x) => x.user_id === createdBy);
    return u
      ? `${u.user_fname || ""} ${u.user_mname ? u.user_mname[0] + "." : ""} ${
          u.user_lname || ""
        }`.trim()
      : "Unknown";
  };

  const filtered = clients.filter(
    (c) =>
      c.client_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // handle remove
  const confirmRemove = (client) => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove ${client.client_fullname}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => handleRemoveClient(client),
        },
      ]
    );
  };

  const handleRemoveClient = async (client) => {
    try {
      await fetch(getEndpoint(`/clients/${client.client_id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, client_status: "Removed" }),
      });
      fetchAll();
    } catch (e) {
      console.error("Remove error:", e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.clientRow}>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.client_fullname}</Text>
        <Text style={styles.clientEmail}>{item.client_email}</Text>
        <Text style={styles.clientCreatedBy}>
          {getUserFullName(item.created_by)}
        </Text>
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity onPress={() => setViewClient(item)}>
          <Eye size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditClient(item)}>
          <Pencil size={20} color="orange" />
        </TouchableOpacity>
        {item.client_status !== "Removed" ? (
          <TouchableOpacity onPress={() => confirmRemove(item)}>
            <Trash2 size={20} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => {}}>
            <RefreshCcw size={20} color="green" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={paginated}
        keyExtractor={(item) => item.client_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No clients found.</Text>
        }
        scrollEnabled={true}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <Text style={styles.pageButton}>&lt;</Text>
          </TouchableOpacity>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
          >
            <Text style={styles.pageButton}>&gt;</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* View Client Modal */}
      <Modal visible={!!viewClient} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Client Info</Text>
            {viewClient && (
              <>
                <Text>Name: {viewClient.client_fullname}</Text>
                <Text>Email: {viewClient.client_email}</Text>
                <Text>Status: {viewClient.client_status}</Text>
              </>
            )}
            <Pressable
              onPress={() => setViewClient(null)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewClients;
