import AddNewCase from "@/components/add-new-case";
import AllCase from "@/components/all-case";
import { today } from "@/constants/sample_data";
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
            {/* Header Date */}
            <Text style={styles.headerDate}>{today}</Text>

            {/* Header with Notification */}
            <View style={styles.headerWrapper}>
              <Text style={styles.headerContainer}>Cases</Text>
              <TouchableOpacity
                onPress={() => alert("Notifications Clicked!")}
                style={{ marginTop: 15 }}
              >
                <Bell size={26} color="#0B3D91" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#999"
              />
            </View>

            {/* ==== Tab Buttons ==== */}
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

            {/* ==== Content Area ==== */}
            <View style={{ flex: 1 }}>
              {caseTab === "All Case" && <AllCase />}
              {caseTab === "+Add New Case" && <AddNewCase />}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Cases;
