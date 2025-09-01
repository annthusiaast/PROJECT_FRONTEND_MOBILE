import AddNewCase from "@/components/add-new-case";
import AllCase from "@/components/all-case";
import CaseModal from "@/components/case-modal";
import ViewClients from "@/components/view-clients";
import { today, allCases as rawallCases } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/case_styles";
import { Bell, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Cases = () => {
  const [caseTab, setcaseTab] = useState("All Case");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState(rawallCases); // store editable list

  const handleCasePress = (caseItem) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  };

  const handleSaveCase = (updatedCase) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    setSelectedCase(updatedCase);
  };

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>

            {/* Searh input */}
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.taskButtonAlignments}>
              <View style={{ flexDirection: "row" }}>
                {["All Case", "+Add New Case"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.taskButton,
                      caseTab === tab && styles.taskButtonPressed,
                      { marginRight: 8 },
                    ]}
                    onPress={() => setcaseTab(tab)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.taskButtonText,
                        caseTab === tab && styles.taskButtonTextPressed,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.taskButton,
                  caseTab === "View Clients" && styles.taskButtonPressed,
                ]}
                onPress={() => setcaseTab("View Clients")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.taskButtonText,
                    caseTab === "View Clients" && styles.taskButtonTextPressed,
                  ]}
                >
                  View Clients
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              {caseTab === "All Case" && (
                <AllCase onCasePress={handleCasePress} cases={cases} />
              )}
              {caseTab === "+Add New Case" && <AddNewCase />}
              {caseTab === "View Clients" && <ViewClients />}
            </View>

            {selectedCase && (
              <CaseModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                caseData={selectedCase}
                onSave={handleSaveCase} // 🔹 pass save handler
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
};

export default Cases;
