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
import ClientDetailModal from "../components/client-detail-modal";
import EditClientModal from "../components/edit-client-modal";

const ViewClients = ({ user, navigation }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState(null);

  const [editClient, setEditClient] = useState(null); // <-- edit state
  // Option B: Local split name state for editing (first + last -> recombine to single full name field)
  const [editFirstName, setEditFirstName] = useState("");
  const [editMiddleName, setEditMiddleName] = useState("");
  const [editLastName, setEditLastName] = useState("");
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
        <TouchableOpacity
          hitSlop={styles.iconHitSlop}
          onPress={() => {
            // Split existing full name into first / middle / last (simple heuristic)
            const parts = (item.client_fullname || "").trim().split(/\s+/).filter(Boolean);
            let first = "";
            let middle = "";
            let last = "";
            if (parts.length === 1) {
              first = parts[0];
            } else if (parts.length === 2) {
              first = parts[0];
              last = parts[1];
            } else if (parts.length > 2) {
              first = parts[0];
              last = parts[parts.length - 1];
              middle = parts.slice(1, -1).join(" ");
            }
            setEditFirstName(first);
            setEditMiddleName(middle);
            setEditLastName(last);
            setEditClient(item);
          }}
        >
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

      <ClientDetailModal
        visible={showDetail && !!selectedClient}
        client={selectedClient}
        contacts={contacts}
        getUserFullName={getUserFullName}
        onClose={() => {
          setShowDetail(false);
          setSelectedClient(null);
        }}
      />

      <EditClientModal
        visible={!!editClient}
        client={editClient}
        onClose={() => {
          setEditClient(null);
          setEditFirstName('');
          setEditMiddleName('');
          setEditLastName('');
        }}
        onSaved={() => {
          setEditClient(null);
          setEditFirstName('');
          setEditMiddleName('');
          setEditLastName('');
          fetchAll();
        }}
        getUserFullName={getUserFullName}
      />



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
