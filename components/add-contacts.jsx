import React, { useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../constants/styles/add-contacts"; 

const AddContact = ({ visible, onAdd, onClose, clients = [] }) => {
  const [formData, setFormData] = useState({
    contact_fullname: "",
    contact_email: "",
    contact_phone: "",
    contact_role: "",
    client_id: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { contact_fullname, contact_email, contact_phone, client_id } = formData;

    if (!contact_fullname || !contact_email || !contact_phone || !client_id) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to add this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: () => {
            onAdd(formData);
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Client Contact Person</Text>

          <Picker
            selectedValue={formData.client_id}
            onValueChange={(value) => handleChange("client_id", value)}
            style={styles.input}
          >
            <Picker.Item label="Select Client" value="" />
            {clients.map((client) => (
              <Picker.Item 
                key={client.client_id} 
                label={client.client_fullname || `Client ${client.client_id}`} 
                value={client.client_id} 
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Full Name"
            value={formData.contact_fullname}
            onChangeText={(text) => handleChange("contact_fullname", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={formData.contact_email}
            onChangeText={(text) => handleChange("contact_email", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.contact_phone}
            onChangeText={(text) => handleChange("contact_phone", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Role (e.g. Manager, Secretary)"
            value={formData.contact_role}
            onChangeText={(text) => handleChange("contact_role", text)}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddContact;
