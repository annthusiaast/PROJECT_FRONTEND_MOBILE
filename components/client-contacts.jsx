import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Pencil, Trash2 } from "lucide-react-native"; // works with lucide-react-native
import { useAuth } from "@/context/auth-context"; // keep same context
import { getEndpoint } from "../constants/api-config";
import { styles } from "../constants/styles/client-contacts"; // base styles
import AddContact from "./add-contacts"; // modal component

const ClientContact = () => {
  const { user } = useAuth();

  const [tableData, setTableData] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editContact, setEditContact] = useState(null); // object being edited
  const [editForm, setEditForm] = useState({
    contact_fullname: '',
    contact_email: '',
    contact_phone: '',
    contact_role: '',
    client_id: '',
  });
  const [removeContactModalOpen, setRemoveContactModalOpen] = useState(false);
  const [contactToBeRemoved, setContactToBeRemoved] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Toast state (lightweight implementation)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success', duration = 2000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const client_contacts_endpoint =
        user?.user_role === "Admin"
          ? getEndpoint("/client-contacts")
          : getEndpoint(`/a-lawyer-client-contacts/${user.user_id}`);

      const clients_endpoint =
        user?.user_role === "Admin"
          ? getEndpoint("/clients")
          : getEndpoint(`/clients/${user.user_id}`);

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
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getClientNameById = (id) => {
    const client = clients.find((c) => c.client_id === id);
    return client ? client.client_fullname : "Unknown";
  };

  // Pagination logic (no search now)
  const rowsPerPage = 5;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedContacts = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleContactRemoval = async (contact) => {
    try {
      const res = await fetch(
        getEndpoint(`/client-contacts/${contact.contact_id}`),
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

  const openEdit = (item) => {
    setEditContact(item);
    setEditForm({
      contact_fullname: item.contact_fullname || '',
      contact_email: item.contact_email || '',
      contact_phone: item.contact_phone || '',
      contact_role: item.contact_role || '',
      client_id: item.client_id,
    });
  };

  const handleEditSave = async () => {
    if (!editContact) return;
    // Basic validation
    const requiredFields = ['contact_fullname', 'contact_email', 'client_id'];
    const missing = requiredFields.filter(f => !editForm[f] || String(editForm[f]).trim() === '');
    if (missing.length) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }
    // Simple email validation
    const emailOk = /.+@.+\..+/.test(editForm.contact_email);
    if (!emailOk) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return;
    }
    setIsSavingEdit(true);
    try {
      const res = await fetch(getEndpoint(`/client-contacts/${editContact.contact_id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update contact');
      let updated;
      try { updated = await res.json(); } catch { updated = { ...editContact, ...editForm }; }
      setTableData(prev => prev.map(c => c.contact_id === editContact.contact_id ? updated : c));
      setEditContact(null);
      showToast('Contact updated successfully', 'success');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const renderContactItem = ({ item }) => (
    <View style={[styles.contactCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={styles.contactName}>{item.contact_fullname}</Text>
        <Text style={styles.contactText}>{item.contact_email}</Text>
        {item.contact_phone ? <Text style={styles.contactText}>{item.contact_phone}</Text> : null}
        {item.contact_role ? <Text style={styles.contactText}>{item.contact_role}</Text> : null}
        <Text style={styles.contactText}>{getClientNameById(item.client_id)}</Text>
      </View>
      <View style={[styles.actionsRow, { marginTop: 0 }]}>
        <TouchableOpacity onPress={() => openEdit(item)} accessibilityLabel="Edit Contact">
          <Pencil color="orange" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setContactToBeRemoved(item); setRemoveContactModalOpen(true); }}
          accessibilityLabel="Delete Contact"
        >
          <Trash2 color="red" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddContact = (savedContact) => {
    // savedContact already persisted by modal component
    setTableData(prev => [savedContact, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>{error.message}</Text>}


      {/* Floating Add Contact Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#114d89',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 28,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
          zIndex: 10,
        }}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
        accessibilityLabel="Add Contact"
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>+ Add Contact</Text>
      </TouchableOpacity>

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
      {/* Edit Contact Modal */}
      <Modal
        visible={!!editContact}
        transparent
        animationType="slide"
        onRequestClose={() => setEditContact(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Contact</Text>
            <View style={{ gap: 8 }}>
              <View>
                <TouchableOpacity>
                  {/* Using basic inputs replaced with Text + temp quick edit approach due to style file; can be swapped to TextInput if style allows */}
                </TouchableOpacity>
              </View>
            </View>
            {/* Inputs */}
            <View style={{ marginTop: 4 }}>
              <EditableField label="Full Name" value={editForm.contact_fullname} onChange={(v) => setEditForm(f => ({ ...f, contact_fullname: v }))} />
              <EditableField label="Email" value={editForm.contact_email} onChange={(v) => setEditForm(f => ({ ...f, contact_email: v }))} keyboardType="email-address" />
              <EditableField label="Phone" value={editForm.contact_phone} onChange={(v) => setEditForm(f => ({ ...f, contact_phone: v }))} keyboardType="phone-pad" />
              <EditableField label="Role" value={editForm.contact_role} onChange={(v) => setEditForm(f => ({ ...f, contact_role: v }))} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditContact(null)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.removeBtn, isSavingEdit && { opacity: 0.6 }]}
                onPress={handleEditSave}
                disabled={isSavingEdit}
              >
                <Text style={{ color: '#fff' }}>{isSavingEdit ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Add Contact Modal */}
      <AddContact
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddContact}
        clients={clients}
      />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </SafeAreaView>
  );
};

// Lightweight inline editable field component (avoids external file)
const EditableField = ({ label, value, onChange, keyboardType }) => (
  <View style={{ marginBottom: 8 }}>
    <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 2 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType || 'default'}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff'
      }}
    />
  </View>
);

export default ClientContact;

// Toast overlay (simple, ephemeral)
const Toast = ({ visible, message, type }) => {
  if (!visible) return null;
  const bg = type === 'error' ? '#dc2626' : '#16a34a';
  return (
    <View style={{
      position: 'absolute',
      bottom: 90,
      left: 20,
      right: 20,
      backgroundColor: bg,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      alignItems: 'center'
    }}>
      <Text style={{ color: '#fff', fontWeight: '600' }}>{message}</Text>
    </View>
  );
};

