import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../constants/styles/add-clients"; 

const AddClient = ({ visible, onClose }) => {
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

  const handleAddContact = () => {
    const { contact_fullname, contact_email, contact_phone, contact_role } = contact;
    if (!contact_fullname || !contact_email || !contact_phone || !contact_role) {
      Toast.show({ type: "error", text1: "Fill all contact fields" });
      return;
    }

    setContacts([...contacts, contact]);
    setContact({ contact_fullname: "", contact_email: "", contact_phone: "", contact_role: "" });
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="x" size={24} color="#555" />
          </TouchableOpacity>

          <ScrollView>
            <Text style={styles.title}>Add New Client</Text>

            {/* Client info */}
            <Text style={styles.sectionTitle}>Client Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Name / Company"
              value={clientData.client_fullname}
              onChangeText={(text) => setClientData({ ...clientData, client_fullname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={clientData.client_email}
              onChangeText={(text) => setClientData({ ...clientData, client_email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={clientData.client_phonenum}
              onChangeText={(text) => setClientData({ ...clientData, client_phonenum: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={clientData.client_password}
              onChangeText={(text) => setClientData({ ...clientData, client_password: text })}
            />

            {/* Contact person */}
            <Text style={styles.sectionTitle}>Contact Person</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={contact.contact_fullname}
              onChangeText={(text) => setContact({ ...contact, contact_fullname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={contact.contact_email}
              onChangeText={(text) => setContact({ ...contact, contact_email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={contact.contact_phone}
              onChangeText={(text) => setContact({ ...contact, contact_phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Relation / Role"
              value={contact.contact_role}
              onChangeText={(text) => setContact({ ...contact, contact_role: text })}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAddContact}>
              <Text style={styles.addBtnText}>+ Add Contact</Text>
            </TouchableOpacity>

            {/* Contacts list */}
            <FlatList
              data={contacts}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.contactRow}>
                  <Text style={{ flex: 1 }}>{item.contact_fullname}</Text>
                  <Text style={{ flex: 1 }}>{item.contact_email}</Text>
                  <Text style={{ flex: 1 }}>{item.contact_phone}</Text>
                  <Text style={{ flex: 1 }}>{item.contact_role}</Text>
                  <TouchableOpacity onPress={() => handleRemoveContact(index)}>
                    <Icon name="trash-2" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Submit */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddClient;


