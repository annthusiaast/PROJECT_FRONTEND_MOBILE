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
// Use global Toast via useToast
import { styles } from "../constants/styles/add-clients";
import { getEndpoint } from "../constants/api-config";
import { useToast } from "@/context/toast-context";
import { useAuth } from "@/context/auth-context";

const AddClient = ({ visible, onClose, onCreated }) => {
  const { user } = useAuth();
  const { showToast: showGlobalToast } = useToast();
  const [clientType, setClientType] = useState('person'); // 'person' | 'company'

  // Store split fields locally; recombine to client_fullname only on submit
  const [clientData, setClientData] = useState({
    client_firstname: "",
    client_middlename: "",
    client_lastname: "",
    client_fullname: "",
    client_email: "",
    client_phonenum: "",
    client_address: "",
    client_password: "",
    created_by: user?.user_id,
  });

  const [contact, setContact] = useState({
    contact_firstname: "",
    contact_middlename: "",
    contact_lastname: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    contact_role: "",
  });

  const [contacts, setContacts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // use global toast instead of local component
  const showToast = (message, type = 'success', duration = 2200) => {
    showGlobalToast({ message, type, duration });
  };

  const handleAddContact = () => {
    const { contact_firstname, contact_middlename, contact_lastname, contact_email, contact_phone, contact_address, contact_role } = contact;
    if (!contact_firstname || !contact_lastname || !contact_email || !contact_phone || !contact_address || !contact_role) {
      showToast("Fill all contact fields", 'error');
      return;
    }
    const contact_fullname = [contact_firstname, contact_middlename, contact_lastname].filter(Boolean).join(' ');
    setContacts([...contacts, { ...contact, contact_fullname }]);
    setContact({ contact_firstname: "", contact_middlename: "", contact_lastname: "", contact_email: "", contact_phone: "", contact_address: "", contact_role: "" });
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const validateClient = () => {
    const { client_firstname, client_middlename, client_lastname, client_fullname, client_email, client_phonenum, client_address } = clientData;
    if (clientType === 'person') {
      if (!client_firstname || !client_lastname) {
        setErrorMsg('First and Last Name are required for an individual client.');
        return false;
      }
    } else {
      if (!(client_fullname || '').trim()) {
        setErrorMsg('Company Name is required.');
        return false;
      }
    }
    if (!client_email || !/.+@.+\..+/.test(client_email)) {
      setErrorMsg('Enter a valid client email.');
      return false;
    }
    if (!client_phonenum || !client_address) {
      setErrorMsg('Phone number and address are required.');
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
  const client_fullname = clientType === 'company'
    ? (clientData.client_fullname || '').trim()
    : [clientData.client_firstname, clientData.client_middlename, clientData.client_lastname]
    .filter(Boolean)
    .join(' ')
    .trim();
      const clientPayload = {
        client_fullname,
        client_email: clientData.client_email,
        client_phonenum: clientData.client_phonenum,
        client_address: clientData.client_address,
        created_by: user?.user_id,
      };
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
      setClientData({ client_firstname: '', client_middlename: '', client_lastname: '', client_fullname: '', client_email: '', client_phonenum: '', client_address: '', client_password: '', created_by: user?.user_id });
      setContacts([]);
      setContact({ contact_firstname: '', contact_middlename: '', contact_lastname: '', contact_email: '', contact_phone: '', contact_address: '', contact_role: '' });
      setClientType('person');

      // Close immediately; toast is global and persists across unmount
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

            {/* Client type toggle */}
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() => setClientType('person')}
                disabled={isSubmitting}
                style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: clientType === 'person' ? '#0B3D91' : '#e5e7eb' }}
                activeOpacity={0.8}
              >
                <Text style={{ color: clientType === 'person' ? '#fff' : '#111827', fontWeight: '700' }}>Individual</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setClientType('company')}
                disabled={isSubmitting}
                style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: clientType === 'company' ? '#0B3D91' : '#e5e7eb' }}
                activeOpacity={0.8}
              >
                <Text style={{ color: clientType === 'company' ? '#fff' : '#111827', fontWeight: '700' }}>Company</Text>
              </TouchableOpacity>
            </View>

            {clientType === 'person' ? (
              <>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
                  First Name {!(clientData.client_firstname || '').trim() ? (
                    <Text style={{ color: '#dc2626' }}>*</Text>
                  ) : null}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={"#666"}
                  value={clientData.client_firstname}
                  editable={!isSubmitting}
                  onChangeText={(text) => setClientData({ ...clientData, client_firstname: text })}
                />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>Middle Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Middle Name"
                  placeholderTextColor={"#666"}
                  value={clientData.client_middlename}
                  editable={!isSubmitting}
                  onChangeText={(text) => setClientData({ ...clientData, client_middlename: text })}
                />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
                  Last Name {!(clientData.client_lastname || '').trim() ? (
                    <Text style={{ color: '#dc2626' }}>*</Text>
                  ) : null}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={"#666"}
                  value={clientData.client_lastname}
                  editable={!isSubmitting}
                  onChangeText={(text) => setClientData({ ...clientData, client_lastname: text })}
                />
              </>
            ) : (
              <>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
                  Company Name {!(clientData.client_fullname || '').trim() ? (
                    <Text style={{ color: '#dc2626' }}>*</Text>
                  ) : null}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  placeholderTextColor={"#666"}
                  value={clientData.client_fullname}
                  editable={!isSubmitting}
                  onChangeText={(text) => setClientData({ ...clientData, client_fullname: text })}
                />
              </>
            )}
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Email {!(clientData.client_email || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"#666"}
              keyboardType="email-address"
              value={clientData.client_email}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_email: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Phone Number {!(clientData.client_phonenum || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={"#666"}
              keyboardType="phone-pad"
              value={clientData.client_phonenum}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_phonenum: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Address {!(clientData.client_address || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor={"#666"}
              value={clientData.client_address}
              editable={!isSubmitting}
              onChangeText={(text) => setClientData({ ...clientData, client_address: text })}
            />
            

            {/* Contact person */}
            <Text style={styles.sectionTitle}>Contact Person</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              First Name {!(contact.contact_firstname || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={"#666"}
              value={contact.contact_firstname}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_firstname: text })}
            />
             <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>Middle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              placeholderTextColor={"#666"}
              value={contact.contact_middlename}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_middlename: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Last Name {!(contact.contact_lastname || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={"#666"}
              value={contact.contact_lastname}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_lastname: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Email {!(contact.contact_email || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"#666"}
              keyboardType="email-address"
              value={contact.contact_email}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_email: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Phone {!(contact.contact_phone || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor={"#666"}
              keyboardType="phone-pad"
              value={contact.contact_phone}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_phone: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Address {!(contact.contact_address || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor={"#666"}
              value={contact.contact_address}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_address: text })}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 6, marginBottom: 4 }}>
              Relation / Role {!(contact.contact_role || '').trim() ? (
                <Text style={{ color: '#dc2626' }}>*</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Relation / Role"
              placeholderTextColor={"#666"}
              value={contact.contact_role}
              editable={!isSubmitting}
              onChangeText={(text) => setContact({ ...contact, contact_role: text })}
            />

            <TouchableOpacity style={[styles.addBtn, isSubmitting && { opacity: 0.5 }]} onPress={handleAddContact} disabled={isSubmitting}>
              <Text style={styles.addBtnText}>+ Add Contact</Text>
            </TouchableOpacity>

            {/* Contacts list (non-virtualized to avoid nested VirtualizedList warning) */}
            {contacts.map((item, index) => (
              <View key={index.toString()} style={styles.contactCard}>
                <View style={styles.contactCardHeader}>
                  <Text style={styles.contactCardTitle}>Contact Person {index + 1}</Text>
                  <TouchableOpacity onPress={() => handleRemoveContact(index)}>
                    <Icon name="trash-2" size={18} color="red" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.contactCardField}><Text style={styles.contactCardLabel}>Name:</Text> {item.contact_fullname}</Text>
                <Text style={styles.contactCardField}><Text style={styles.contactCardLabel}>Email:</Text> {item.contact_email}</Text>
                <Text style={styles.contactCardField}><Text style={styles.contactCardLabel}>Phone:</Text> {item.contact_phone}</Text>
                <Text style={styles.contactCardField}><Text style={styles.contactCardLabel}>Address:</Text> {item.contact_address}</Text>
                <Text style={styles.contactCardField}><Text style={styles.contactCardLabel}>Role:</Text> {item.contact_role}</Text>
              </View>
            ))}

            {/* Submit */}
            <TouchableOpacity style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.saveBtnText}>{isSubmitting ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddClient;


