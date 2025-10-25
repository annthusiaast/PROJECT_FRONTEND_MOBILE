import AllCase from "@/components/all-case";
import CaseModal from "@/components/case-modal";
import ViewClients from "@/components/view-clients";
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
  const isStaff = String(user?.user_role || '').toLowerCase() === 'staff';
  const [caseTab, setcaseTab] = useState("All Cases");
  const [showArchived, setShowArchived] = useState(false); // toggle for archived cases
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  // Local cases state removed; AllCase handles fetching based on role

  // Ensure Staff defaults to View Clients
  React.useEffect(() => {
    if (isStaff && caseTab !== 'View Clients') {
      setcaseTab('View Clients');
    }
  }, [isStaff]);

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
              {!isStaff && (
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                  {["All Cases"].map((tab) => (
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
                  {/* Archive toggle */}
                  <TouchableOpacity
                    style={[
                      styles.taskButton,
                      showArchived && styles.taskButtonPressed,
                      { marginRight: 8 },
                    ]}
                    onPress={() => setShowArchived((p) => !p)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.taskButtonText,
                        showArchived && styles.taskButtonTextPressed,
                      ]}
                    >
                      {showArchived ? 'Archived' : 'Archive Cases'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

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
              {!isStaff && caseTab === "All Cases" && (
                <AllCase onCasePress={handleCasePress} user={user} showArchived={showArchived} />
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
