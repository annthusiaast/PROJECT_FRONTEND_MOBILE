import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../constants/styles/add-clients";
import { getEndpoint } from "../constants/api-config";
import { useAuth } from "@/context/auth-context";

const AddClient = ({ visible, onClose, onCreated }) => {
  const { user } = useAuth();

  const [clientData, setClientData] = useState({
    client_fullname: "",
    client_email: "",
    client_phonenum: "",
    client_password: "",
    created_by: user?.user_id,
  });

  const [contact, setContact] = useState({
    contact_fullname: "",
    contact_email: "",
    contact_phone: "",
    contact_role: "",
  });

  const [contacts, setContacts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = 'success', duration = 2200) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
  };

  const handleAddContact = () => {
    const { contact_fullname, contact_email, contact_phone, contact_role } = contact;
    if (!contact_fullname || !contact_email || !contact_phone || !contact_role) {
      showToast("Fill all contact fields", 'error');
      return;
    }

    setContacts([...contacts, contact]);
    setContact({ contact_fullname: "", contact_email: "", contact_phone: "", contact_role: "" });
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const validateClient = () => {
    const { client_fullname, client_email, client_phonenum, client_password } = clientData;
    if (!client_fullname || !client_email || !client_phonenum || !client_password) {
      setErrorMsg('Please fill all required client fields.');
      return false;
    }
    if (!/.+@.+\..+/.test(client_email)) {
      setErrorMsg('Enter a valid client email.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setErrorMsg('');
    if (!validateClient()) return;
    // optional: validate at least one contact? Not mandatory.
    doSubmit();
  };

  const doSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Create client first
      const clientPayload = { ...clientData, created_by: user?.user_id };
      const clientRes = await fetch(getEndpoint('/clients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientPayload),
      });
      if (!clientRes.ok) {
        let msg = 'Failed to create client';
        try { const j = await clientRes.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
      }
      let createdClient = clientPayload;
      try { createdClient = await clientRes.json(); } catch { }

      // Create contacts sequentially (could also batch with Promise.all)
      const createdContacts = [];
      for (const c of contacts) {
        const contactPayload = { ...c, client_id: createdClient.client_id };
        try {
          const contactRes = await fetch(getEndpoint('/client-contacts'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactPayload),
          });
          if (contactRes.ok) {
            try { createdContacts.push(await contactRes.json()); } catch { createdContacts.push(contactPayload); }
          }
        } catch (_) { /* swallow individual contact failures; could aggregate */ }
      }

      showToast('Client created successfully');
      // Notify parent
      onCreated && onCreated({ client: createdClient, contacts: createdContacts });

      // Reset form
      setClientData({ client_fullname: '', client_email: '', client_phonenum: '', client_password: '', created_by: user?.user_id });
      setContacts([]);
      setContact({ contact_fullname: '', contact_email: '', contact_phone: '', contact_role: '' });
      onClose && onClose();
    } catch (e) {
      setErrorMsg(e.message);
      showToast(e.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isSubmitting}>
            <Icon name="x" size={24} color="#555" />
          </TouchableOpacity>

          <ScrollView>
            <Text style={styles.title}>Add New Client</Text>
            {errorMsg ? <Text style={{ color: 'red', marginBottom: 8, fontSize: 12 }}>{errorMsg}</Text> : null}

            {/* Client info */}
            <Text style={styles.sectionTitle}>Client Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Name / Company"
              value={clientData.client_fullname}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_fullname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={clientData.client_email}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={clientData.client_phonenum}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_phonenum: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={clientData.client_password}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_password: text })}
            />

            {/* Contact person */}
            <Text style={styles.sectionTitle}>Contact Person</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={contact.contact_fullname}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_fullname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={contact.contact_email}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={contact.contact_phone}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Relation / Role"
              value={contact.contact_role}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_role: text })}
            />

            <TouchableOpacity style={[styles.addBtn, isSubmitting && { opacity: 0.5 }]} onPress={handleAddContact} disabled={isSubmitting}>
              <Text style={styles.addBtnText}>+ Add Contact</Text>
            </TouchableOpacity>

            {/* Contacts list (non-virtualized to avoid nested VirtualizedList warning) */}
            {contacts.map((item, index) => (
              <View key={index.toString()} style={styles.contactRow}>
                <Text style={{ flex: 1 }}>{item.contact_fullname}</Text>
                <Text style={{ flex: 1 }}>{item.contact_email}</Text>
                <Text style={{ flex: 1 }}>{item.contact_phone}</Text>
                <Text style={{ flex: 1 }}>{item.contact_role}</Text>
                <TouchableOpacity onPress={() => handleRemoveContact(index)}>
                  <Icon name="trash-2" size={18} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Submit */}
            <TouchableOpacity style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.saveBtnText}>{isSubmitting ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      {toast.visible && (
        <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: toast.type === 'error' ? '#dc2626' : '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{toast.message}</Text>
        </View>
      )}
    </Modal>
  );
};

export default AddClient;


