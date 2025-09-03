import AllCase from "@/components/all-case";
import CaseModal from "@/components/case-modal";
import ViewClients from "@/components/view-clients";
import { today } from "@/constants/sample_data"; // removed raw sample list; AllCase fetches from backend
import { styles } from "@/constants/styles/(tabs)/case_styles";
import { useAuth } from "@/context/auth-context";
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
  const { user } = useAuth();
  const [caseTab, setcaseTab] = useState("All Case");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  // Local cases state removed; AllCase handles fetching based on role

  const handleCasePress = (caseItem) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  };

  const handleSaveCase = (updatedCase) => {
    // Could trigger a refetch in AllCase if we lift state; for now just update selectedCase for modal display.
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
                {["All Case"].map((tab) => (
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
                <AllCase onCasePress={handleCasePress} user={user} />
              )}
              {caseTab === "View Clients" && <ViewClients user={user} />}
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
