import React, { useState, useEffect } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CaseModal = ({ visible, onClose, caseData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCase, setEditableCase] = useState(caseData || {});

  useEffect(() => {
    setEditableCase(caseData || {});
    setIsEditing(false);
  }, [caseData]);

  const handleChange = (field, value) => {
    setEditableCase((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableCase);
    }
    setIsEditing(false);
  };

  if (!caseData) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {editableCase.title || "Untitled Case"}
                </Text>

                {!isEditing ? (
                  <TouchableOpacity
                    style={styles.squareBtn}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.squareBtnText}>✎</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[styles.squareBtn, { backgroundColor: "#ccc" }]}
                      onPress={() => {
                        setEditableCase(caseData);
                        setIsEditing(false);
                      }}
                    >
                      <Text style={styles.squareBtnText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.squareBtn, { backgroundColor: "#0B3D91" }]}
                      onPress={handleSave}
                    >
                      <Text style={[styles.squareBtnText, { color: "#fff" }]}>
                        ✔
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.close}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sub}>
                Cabinet #: {editableCase.cabinetNo || "N/A"} &nbsp;&nbsp; Drawer #:{" "}
                {editableCase.drawerNo || "N/A"}
              </Text>

              {/* Scrollable content */}
              <ScrollView style={{ marginTop: 10 }}>
                {/* Case Name */}
                <View style={styles.row}>
                  <Text style={styles.label}>Case Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.title}
                      onChangeText={(text) => handleChange("title", text)}
                    />
                  ) : (
                    <Text style={styles.value}>{editableCase.title || "N/A"}</Text>
                  )}
                </View>

                {/* Category */}
                <View style={styles.row}>
                  <Text style={styles.label}>Category</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.category}
                      onChangeText={(text) => handleChange("category", text)}
                    />
                  ) : (
                    <Text style={styles.value}>{editableCase.category || "N/A"}</Text>
                  )}
                </View>

                {/* Client */}
                <View style={styles.row}>
                  <Text style={styles.label}>Client</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.client}
                      onChangeText={(text) => handleChange("client", text)}
                    />
                  ) : (
                    <Text style={styles.value}>{editableCase.client || "N/A"}</Text>
                  )}
                </View>

                {/* Lawyer */}
                <View style={styles.row}>
                  <Text style={styles.label}>Lawyer</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.lawyer}
                      onChangeText={(text) => handleChange("lawyer", text)}
                    />
                  ) : (
                    <Text style={styles.value}>{editableCase.lawyer || "N/A"}</Text>
                  )}
                </View>

                {/* Payment */}
                <View style={styles.paymentBox}>
                  <Text style={[styles.label, { marginBottom: 4 }]}>Payment</Text>
                  <Text>Total Fee: ₱{editableCase.totalFee || "0.00"}</Text>
                  <Text>Total Paid: - ₱{editableCase.totalPaid || "0.00"}</Text>
                  <Text style={{ fontWeight: "bold", color: "red" }}>
                    Remaining: ₱
                    {(
                      (editableCase.totalFee || 0) - (editableCase.totalPaid || 0)
                    ).toFixed(2)}
                  </Text>
                  <TouchableOpacity style={styles.paymentBtn}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                      View Payment Record
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.textarea}
                    value={editableCase.description}
                    multiline
                    editable={isEditing}
                    onChangeText={(text) => handleChange("description", text)}
                  />
                </View>

                {/* Date Filed */}
                <View style={styles.row}>
                  <Text style={styles.label}>Date Filed</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.dateFiled}
                      onChangeText={(text) => handleChange("dateFiled", text)}
                    />
                  ) : (
                    <Text style={styles.value}>
                      {editableCase.dateFiled || "N/A"}
                    </Text>
                  )}
                </View>

                {/* Status */}
                <View style={styles.row}>
                  <Text style={styles.label}>Status</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editableCase.status}
                      onChangeText={(text) => handleChange("status", text)}
                    />
                  ) : (
                    <Text style={[styles.value, { color: "red" }]}>
                      {editableCase.status || "Pending"}
                    </Text>
                  )}
                </View>

                {/* Documents */}
                <View style={styles.section}>
                  <Text style={styles.label}>Documents</Text>
                  {(editableCase.documents || []).map((doc, index) => (
                    <View key={index} style={styles.docRow}>
                      <Text style={styles.docText}>{doc.name}</Text>
                      <Text style={styles.docText}>{doc.status}</Text>
                      <Text
                        style={styles.link}
                        onPress={() => Linking.openURL(doc.link)}
                      >
                        Open
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CaseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  sub: { color: "#888", marginTop: 2 },
  close: { fontSize: 36, color: "#999" },
  row: { marginTop: 10 },
  label: { fontSize: 13, color: "#666" },
  value: { fontSize: 15, fontWeight: "600", marginBottom: 5 },
  section: { marginTop: 15 },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    height: 80,
    textAlignVertical: "top",
    marginTop: 5,
  },
  paymentBox: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  paymentBtn: {
    marginTop: 8,
    backgroundColor: "green",
    paddingVertical: 6,
    borderRadius: 6,
  },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  docText: { fontSize: 14, flex: 1 },
  link: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 6,
    marginTop: 3,
    fontSize: 14,
  },
  squareBtn: {
    width: 50,
    height: 32,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  squareBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B3D91",
  },
});
