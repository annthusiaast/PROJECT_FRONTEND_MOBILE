import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { Pencil, Trash2, Eye, RefreshCcw } from "lucide-react-native";
import { styles } from "../constants/styles/view-clients";
import { colors } from "../constants/styles/colors";

// api
import { getEndpoint } from "../constants/api-config";

// import your pages
import AddContact from "../components/add-contacts";
import ClientContact from "../components/client-contacts"; // integrated contacts view
import AddClient from "../components/add-clients";

const ViewClients = ({ user, navigation }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState(null);

  const [editClient, setEditClient] = useState(null); // <-- edit state
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [activeTab, setActiveTab] = useState("clients");
  const [showAddClient, setShowAddClient] = useState(false);

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

  const renderItem = ({ item }) => (
    <View style={[styles.card, styles.clientRow]}>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.client_fullname}</Text>
        <Text style={styles.clientEmail}>{item.client_email}</Text>
        <Text style={styles.clientPhone}>{item.client_phonenum}</Text>
        <Text style={styles.clientAddress}>{item.client_address}</Text>
        <Text style={styles.clientCreatedBy}>
          {getUserFullName(item.created_by)}
        </Text>
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity
          hitSlop={styles.iconHitSlop}
          onPress={() => {
            setSelectedClient(item);
            setShowDetail(true);
          }}
        >
          <Eye size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={styles.iconHitSlop} onPress={() => setEditClient(item)}>
          <Pencil size={20} color="orange" />
        </TouchableOpacity>
        {item.client_status !== "Removed" ? (
          <TouchableOpacity hitSlop={styles.iconHitSlop} onPress={() => confirmRemove(item)}>
            <Trash2 size={20} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity hitSlop={styles.iconHitSlop} onPress={() => {}}>
            <RefreshCcw size={20} color="green" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { flex: 1 }]}> 
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
           Clients
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
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 120 }}
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

          {/* Floating Add Client Button */}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add Client"
            onPress={() => setShowAddClient(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Add Client
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <ClientContact />
        </>
      )}

      {/* Client Detail Overlay */}
      {showDetail && selectedClient && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 50,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 18,
              borderRadius: 12,
              width: "92%",
              maxHeight: "80%",
            }}
          >
            {/* Header with name and status badge */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827", flex: 1, paddingRight: 8 }}>
                  {selectedClient.client_fullname}
                </Text>
                <View
                  style={{
                    backgroundColor:
                      selectedClient.client_status === "Active"
                        ? "#16a34a"
                        : selectedClient.client_status === "Removed"
                        ? "#dc2626"
                        : "#64748b",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
                    {selectedClient.client_status || "Unknown"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Scrollable details */}
            <ScrollView style={{ maxHeight: "75%" }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 10 }}>
                {/* Info rows */}
                <View style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, backgroundColor: "#f9fafb" }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#6b7280", fontWeight: "700" }}>Email</Text>
                    <Text style={{ color: "#111827", fontWeight: "600" }}>
                      {selectedClient.client_email || "—"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#6b7280", fontWeight: "700" }}>Phone</Text>
                    <Text style={{ color: "#111827" }}>
                      {selectedClient.client_phonenum || "—"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#6b7280", fontWeight: "700" }}>Address</Text>
                    <Text style={{ color: "#111827", flex: 1, textAlign: "right", paddingLeft: 12 }}>
                      {selectedClient.client_address || "—"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#6b7280", fontWeight: "700" }}>Created By</Text>
                    <Text style={{ color: "#111827" }}>
                      {getUserFullName(selectedClient.created_by)}
                    </Text>
                  </View>
                </View>

                {/* Contacts section */}
                <View>
                  <Text style={{ fontWeight: "800", marginBottom: 6, color: "#111827" }}>Contacts</Text>
                  {contacts.filter((c) => c.client_id === selectedClient.client_id).length === 0 ? (
                    <Text style={{ fontStyle: "italic", color: "#6b7280" }}>No contacts.</Text>
                  ) : (
                    <View style={{ gap: 8 }}>
                      {contacts
                        .filter((c) => c.client_id === selectedClient.client_id)
                        .map((c) => (
                          <View
                            key={c.contact_id || c.contact_email}
                            style={{
                              borderWidth: 1,
                              borderColor: "#e5e7eb",
                              backgroundColor: "#ffffff",
                              padding: 10,
                              borderRadius: 10,
                            }}
                          >
                            <Text style={{ fontWeight: "700", marginBottom: 2 }}>
                              {c.contact_fullname}
                            </Text>
                            <Text style={{ color: "#374151", marginBottom: 2 }}>{c.contact_email}</Text>
                            {c.contact_phone ? (
                              <Text style={{ color: "#6b7280", fontSize: 12 }}>{c.contact_phone}</Text>
                            ) : null}
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDetail(false);
                  setSelectedClient(null);
                }}
                style={{
                  backgroundColor: "#114d89",
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Edit Client Modal */}
      {editClient && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 60,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 18,
              borderRadius: 12,
              width: "92%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>
              Edit Client
            </Text>

            {/* Full Name */}
            <Text>First Name</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
              value={editClient.client_fullname}
              onChangeText={(text) =>
                setEditClient({ ...editClient, client_fullname: text })
              }
            />

            <Text>Last Name</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
              value={editClient.client_fullname}
              onChangeText={(text) =>
                setEditClient({ ...editClient, client_fullname: text })
              }
            />

            {/* Email */}
            <Text>Email</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
              value={editClient.client_email}
              onChangeText={(text) =>
                setEditClient({ ...editClient, client_email: text })
              }
            />

            {/* Phone */}
            <Text>Phone</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
              value={editClient.client_phonenum}
              onChangeText={(text) =>
                setEditClient({ ...editClient, client_phonenum: text })
              }
            />

            {/* Address */}
            <Text>Address</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
              value={editClient.client_address}
              onChangeText={(text) =>
                setEditClient({ ...editClient, client_address: text })
              }
            />

            {/* Created By (disabled input) */}
            <Text>Created By</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
                backgroundColor: "#f2f2f2", // gray background to show disabled
                color: "#555",
              }}
              value={getUserFullName(editClient.created_by)}
              editable={false}
            />

            {/* Status */}
            <Text>Status</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 10,
                padding: 8,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setEditClient({
                    ...editClient,
                    client_status:
                      editClient.client_status === "Active" ? "Inactive" : "Active",
                  })
                }
              >
                <Text>{editClient.client_status || "Active"}</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setEditClient(null)}
                style={{
                  backgroundColor: "#ccc",
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    await fetch(getEndpoint(`/clients/${editClient.client_id}`), {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        client_fullname: editClient.client_fullname,
                        client_email: editClient.client_email,
                        client_status: editClient.client_status,
                      }), // now includes status
                    });
                    setEditClient(null);
                    fetchAll();
                  } catch (err) {
                    console.error("Update error:", err);
                  }
                }}
                style={{
                  backgroundColor: "#114d89",
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}



      {/* Add Client Modal */}
      <AddClient
        visible={showAddClient}
        onClose={() => setShowAddClient(false)}
        onCreated={({ client, contacts: newContacts }) => {
          setShowAddClient(false);
          if (client) setClients((prev) => [client, ...prev]);
          if (newContacts?.length)
            setContacts((prev) => [...newContacts, ...prev]);
        }}
      />
    </View>
  );
};

export default ViewClients;
