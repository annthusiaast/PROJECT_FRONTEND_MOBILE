import React, { useState } from "react";
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

const AddContact = ({ visible, onAdd, onClose, clients = [] }) => {
  const [formData, setFormData] = useState({
    contact_fullname: "",
    contact_email: "",
    contact_phone: "",
    contact_role: "",
    client_id: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(
    clients.map((client) => ({
      label: client.client_fullname || `Client ${client.client_id}`,
      value: client.client_id,
    }))
  );

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
            Alert.alert("Success", "Contact saved successfully!");
            onClose();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel",
      "Are you sure you want to cancel?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: onClose }
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
          <Text style={styles.title}>Client Contact</Text>

          <DropDownPicker
            open={open}
            value={formData.client_id}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const val = callback(formData.client_id);
              handleChange("client_id", val);
              setValue(val);
            }}
            setItems={setItems}
            placeholder="Select Client"
            style={styles.input}
            dropDownContainerStyle={{ borderColor: "#ccc" }}
          />

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
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
