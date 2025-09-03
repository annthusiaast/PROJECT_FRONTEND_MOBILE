import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Pencil, Trash2, Eye, RefreshCcw } from "lucide-react-native";
import { styles } from "../constants/styles/view-clients";

// api
import { getEndpoint } from "../constants/api-config";

// import your pages
import AddContact from "../components/add-contacts";

const ViewClients = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState(null);

  const [editClient, setEditClient] = useState(null);
  // client detail modal state
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // active tab state
  const [activeTab, setActiveTab] = useState("clients"); // "clients" | "contacts"
  const [showAddContact, setShowAddContact] = useState(false); // controls AddContact modal visibility

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

      if (!cRes.ok || !uRes.ok || !ctRes.ok) throw new Error("Fetch failed");

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

  // Add new contact handler (posts to backend then refreshes list)
  const handleAddContact = async (newContact) => {
    try {
      const res = await fetch(getEndpoint('/client-contacts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      });
      if (!res.ok) throw new Error('Failed to add contact');
      // Optimistic update: append returned contact or refetch
      try {
        const saved = await res.json();
        setContacts(prev => [saved, ...prev]);
      } catch (_) {
        fetchAll();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
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
        {/* Eye button can later navigate to a dedicated client detail page */}
        <TouchableOpacity
          onPress={() => {
            setSelectedClient(item);
            setShowDetail(true);
          }}
        >
          <Eye size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Edit client:", item)}>
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
      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "clients" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("clients")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "clients" && styles.activeTabText,
            ]}
          >
              Add Clients
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "contacts" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("contacts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "contacts" && styles.activeTabText,
            ]}
          >
            View Contacts
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      {activeTab === "clients" ? (
        <>
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
        </>
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {/* Add Contact Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#114d89',
              padding: 10,
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginBottom: 10
            }}
            onPress={() => setShowAddContact(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>+ Add Contact</Text>
          </TouchableOpacity>

          {/* Contacts List */}
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.contact_id?.toString() || `${item.contact_fullname}-${item.client_id}`}
            renderItem={({ item }) => (
              <View style={[styles.clientRow, { alignItems: 'flex-start' }]}>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{item.contact_fullname}</Text>
                  <Text style={styles.clientEmail}>{item.contact_email}</Text>
                  <Text style={styles.clientCreatedBy}>{item.contact_phone}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No contacts found.</Text>}
          />

          {/* Add Contact Modal */}
          <AddContact
            visible={showAddContact}
            onClose={() => setShowAddContact(false)}
            onAdd={handleAddContact}
            clients={clients}
          />
        </>
      )}
      {/* Client Detail Overlay */}
      {showDetail && selectedClient && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            zIndex: 50,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 18,
              borderRadius: 12,
              width: '92%',
              maxHeight: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>
              {selectedClient.client_fullname}
            </Text>
            <Text style={{ marginBottom: 2 }}>Email: {selectedClient.client_email}</Text>
            <Text style={{ marginBottom: 2 }}>Created By: {getUserFullName(selectedClient.created_by)}</Text>
            <Text style={{ marginBottom: 8 }}>Status: {selectedClient.client_status}</Text>
            <View style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>Contacts:</Text>
              {contacts.filter(c => c.client_id === selectedClient.client_id).length === 0 ? (
                <Text style={{ fontStyle: 'italic', color: '#555' }}>No contacts.</Text>
              ) : (
                <View style={{ gap: 6 }}>
                  {contacts
                    .filter(c => c.client_id === selectedClient.client_id)
                    .map(c => (
                      <View key={c.contact_id || c.contact_email} style={{ borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                        <Text style={{ fontWeight: '500' }}>{c.contact_fullname}</Text>
                        <Text style={{ color: '#333' }}>{c.contact_email}</Text>
                        {c.contact_phone ? (
                          <Text style={{ color: '#555', fontSize: 12 }}>{c.contact_phone}</Text>
                        ) : null}
                      </View>
                    ))}
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDetail(false);
                  setSelectedClient(null);
                }}
                style={{ backgroundColor: '#114d89', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ViewClients;
