import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CaseModal = ({ visible, onClose, caseData }) => {
  if (!caseData) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <View style={styles.header}>
            <Text style={styles.title}>
              {caseData.title || "Untitled Case"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>

            {/* Cabinet and Drawer */}
          <Text style={styles.sub}>
            Cabinet #: {caseData.cabinetNo || "N/A"} &nbsp;&nbsp; Drawer #:{" "}
            {caseData.drawerNo || "N/A"}
          </Text>
          <ScrollView style={{ marginTop: 10 }}>

            {/* Case Name */}
            <View style={styles.row}>
              <Text style={styles.label}>Case Name</Text>
              <Text style={styles.value}>{caseData.title || "N/A"}</Text>
            </View>

            {/* Case Details */}
            <View style={styles.row}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{caseData.category || "N/A"}</Text>
            </View>

            {/* Client */}
            <View style={styles.row}>
              <Text style={styles.label}>Client</Text>
              <Text style={styles.value}>{caseData.client || "N/A"}</Text>
            </View>

            {/* Lawyer */}
            <View style={styles.row}>
              <Text style={styles.label}>Lawyer</Text>
              <Text style={styles.value}>{caseData.lawyer || "N/A"}</Text>
            </View>

             {/* Payment */}

            <View style={styles.paymentBox}>
              <Text style={[styles.label, { marginBottom: 4 }]}>Payment</Text>
              <Text>Total Fee: ₱{caseData.totalFee || "0.00"}</Text>
              <Text>Total Paid: - ₱{caseData.totalPaid || "0.00"}</Text>
              <Text style={{ fontWeight: "bold", color: "red" }}>
                Remaining: ₱
                {(caseData.totalFee - caseData.totalPaid).toFixed(2) || "0.00"}
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
                value={caseData.description}
                multiline
                editable={false}
              />
            </View>

            {/* Date Filled */}

            <View style={styles.row}>
              <Text style={styles.label}>Date Filed</Text>
              <Text style={styles.value}>{caseData.dateFiled || "N/A"}</Text>
            </View>

            {/* Status */}
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: "red" }]}>
                {caseData.status || "Pending"}
              </Text>
            </View>

            {/* Documents */}

            <View style={styles.section}>
              <Text style={styles.label}>Documents</Text>
              {(caseData.documents || []).map((doc, index) => (
                <View key={index} style={styles.docRow}>
                  <Text style={styles.docText}>{doc.name}</Text>
                  <Text style={styles.docText}>{doc.status}</Text>
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(doc.link)}
                    >
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
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
  },
  title: { fontSize: 22, fontWeight: "bold" },
  sub: { color: "#888", marginTop: 2 },
  close: { fontSize: 26, color: "#999" },
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
});
