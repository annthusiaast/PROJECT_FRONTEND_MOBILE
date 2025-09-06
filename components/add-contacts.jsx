import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "../constants/styles/add-contacts";
import { getEndpoint } from "../constants/api-config";

const AddContact = ({ visible, onAdd, onClose, clients = [] }) => {
  // Internal visibility state so Cancel works even if parent does not control "visible" prop
  const isControlled = typeof visible === 'boolean';
  const [internalVisible, setInternalVisible] = useState(isControlled ? !!visible : true);

  useEffect(() => {
    if (isControlled) setInternalVisible(!!visible);
  }, [visible, isControlled]);

  const [formData, setFormData] = useState({
    contact_fullname: "",
    contact_email: "",
    contact_phone: "",
    contact_role: "",
    client_id: null, // null means no selection yet so placeholder shows
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setItems(
      clients.map((client) => ({
        label: client.client_fullname || `Client ${client.client_id}`,
        value: client.client_id,
      }))
    );
  }, [clients]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { contact_fullname, contact_email, contact_phone, client_id } = formData;
    setErrorMsg('');
    if (!contact_fullname || !contact_email || !contact_phone || !client_id) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    if (!/.+@.+\..+/.test(contact_email)) {
      Alert.alert('Validation Error', 'Please enter a valid email.');
      return;
    }

    Alert.alert(
      'Confirm',
      'Add this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => doSubmit() }
      ]
    );
  };

  const doSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(getEndpoint('/client-contacts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        let msg = 'Failed to add contact';
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
      }
      let saved = formData;
      try { saved = await res.json(); } catch { }
      if (onAdd) onAdd(saved);
      Alert.alert('Success', 'Contact added.');
      setFormData({ contact_fullname: '', contact_email: '', contact_phone: '', contact_role: '', client_id: null });
      onClose && onClose();
    } catch (e) {
      setErrorMsg(e.message);
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // When uncontrolled and user pressed cancel, do not render anything
  if (!internalVisible) return null;

  const handleCancel = () => {
    if (onClose) onClose(); else setInternalVisible(false);
  };

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Client Contact</Text>

          <DropDownPicker
            open={open}
            value={formData.client_id}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const nextVal = typeof callback === 'function' ? callback(formData.client_id) : callback;
              handleChange('client_id', nextVal);
            }}
            setItems={setItems}
            placeholder="Select Client"
            style={styles.input}
            dropDownContainerStyle={{ borderColor: '#ccc' }}
            disabled={isSubmitting}
            listMode="SCROLLVIEW"
          />

          <TextInput
            placeholder="Full Name"
            value={formData.contact_fullname}
            onChangeText={(text) => handleChange("contact_fullname", text)}
            style={styles.input}
            editable={!isSubmitting}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={formData.contact_email}
            onChangeText={(text) => handleChange("contact_email", text)}
            style={styles.input}
            editable={!isSubmitting}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.contact_phone}
            onChangeText={(text) => handleChange("contact_phone", text)}
            style={styles.input}
            editable={!isSubmitting}
          />
          <TextInput
            placeholder="Role (e.g. Manager, Secretary)"
            value={formData.contact_role}
            onChangeText={(text) => handleChange("contact_role", text)}
            style={styles.input}
            editable={!isSubmitting}
          />

          {errorMsg ? (
            <Text style={{ color: 'red', marginTop: 4, fontSize: 12 }}>{errorMsg}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveButton, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.saveText}>{isSubmitting ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddContact;