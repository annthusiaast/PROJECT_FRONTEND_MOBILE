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
import { colors } from "../constants/styles/colors";
import AddContact from "./add-contacts"; // modal component
import ModalWrapper from "./common/modal-wrapper"; // added

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
    contact_address: '',
    contact_role: '',
    client_id: '',
  });
  // Option B local split name pieces (first + middle + last)
  const [editFirstName, setEditFirstName] = useState('');
  const [editMiddleName, setEditMiddleName] = useState('');
  const [editLastName, setEditLastName] = useState('');
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
      contact_address: item.contact_address || '',
      contact_role: item.contact_role || '',
      client_id: item.client_id,
    });
    // Split current full name into first / middle / last (heuristic)
    const parts = (item.contact_fullname || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      setEditFirstName('');
      setEditMiddleName('');
      setEditLastName('');
    } else if (parts.length === 1) {
      setEditFirstName(parts[0]);
      setEditMiddleName('');
      setEditLastName('');
    } else if (parts.length === 2) {
      setEditFirstName(parts[0]);
      setEditMiddleName('');
      setEditLastName(parts[1]);
    } else {
      setEditFirstName(parts[0]);
      setEditLastName(parts[parts.length - 1]);
      setEditMiddleName(parts.slice(1, -1).join(' '));
    }
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
        body: JSON.stringify({
          ...editForm,
          contact_fullname: [editFirstName, editMiddleName, editLastName]
            .filter(Boolean)
            .join(' ')
            .trim() || editForm.contact_fullname,
        }),
      });
      if (!res.ok) throw new Error('Failed to update contact');
      let updated;
      try { updated = await res.json(); } catch { updated = { ...editContact, ...editForm }; }
      setTableData(prev => prev.map(c => c.contact_id === editContact.contact_id ? updated : c));
      handleCloseEdit();
      showToast('Contact updated successfully', 'success');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCloseEdit = () => {
    setEditContact(null);
    setEditFirstName('');
    setEditMiddleName('');
    setEditLastName('');
    setEditForm({
      contact_fullname: '',
      contact_email: '',
      contact_phone: '',
      contact_address: '',
      contact_role: '',
      client_id: '',
    });
  };

  const renderContactItem = ({ item }) => (
    <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={styles.contactName}>{item.contact_fullname}</Text>
        <Text style={styles.contactText}>{item.contact_email}</Text>
        {item.contact_phone ? <Text style={styles.contactText}>{item.contact_phone}</Text> : null}
        {item.contact_address ? <Text style={styles.contactText}>{item.contact_address}</Text> : null}
        {item.contact_role ? <Text style={styles.contactText}>{item.contact_role}</Text> : null}
        <Text style={styles.contactText}>{getClientNameById(item.client_id)}</Text>
      </View>
      <View style={[styles.actionsRow, { marginTop: 0 }]}>
        <TouchableOpacity hitSlop={styles.iconHitSlop} onPress={() => openEdit(item)} accessibilityLabel="Edit Contact">
          <Pencil color="orange" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={styles.iconHitSlop}
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
    <SafeAreaView style={{ flex: 1 }}>
      {error && <Text style={styles.errorText}>{error.message}</Text>}


      {/* Floating Add Contact Button */}
      <TouchableOpacity
        style={styles.fab}
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
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
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
      {/* Replaced native Modal with ModalWrapper */}
      <ModalWrapper
        visible={!!editContact}
        onClose={handleCloseEdit}
        animationType="fade"
      >
        <Text style={styles.modalTitle}>Edit Contact</Text>
        <View style={{ marginTop: 4 }}>
          <EditableField
            label="First Name"
            value={editFirstName}
            onChange={(v) => {
              setEditFirstName(v);
              setEditForm(f => ({
                ...f,
                contact_fullname: [v, editMiddleName, editLastName].filter(Boolean).join(' ')
              }));
            }}
          />
          <EditableField
            label="Middle Name(s)"
            value={editMiddleName}
            onChange={(v) => {
              setEditMiddleName(v);
              setEditForm(f => ({
                ...f,
                contact_fullname: [editFirstName, v, editLastName].filter(Boolean).join(' ')
              }));
            }}
          />
          <EditableField
            label="Last Name"
            value={editLastName}
            onChange={(v) => {
              setEditLastName(v);
              setEditForm(f => ({
                ...f,
                contact_fullname: [editFirstName, editMiddleName, v].filter(Boolean).join(' ')
              }));
            }}
          />
          <EditableField label="Email" value={editForm.contact_email} onChange={(v) => setEditForm(f => ({ ...f, contact_email: v }))} keyboardType="email-address" />
          <EditableField label="Phone" value={editForm.contact_phone} onChange={(v) => setEditForm(f => ({ ...f, contact_phone: v }))} keyboardType="phone-pad" />
          <EditableField label="Address" value={editForm.contact_address} onChange={(v) => setEditForm(f => ({ ...f, contact_address: v }))} />
          <EditableField label="Role" value={editForm.contact_role} onChange={(v) => setEditForm(f => ({ ...f, contact_role: v }))} />
        </View>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCloseEdit}>
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
      </ModalWrapper>
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

