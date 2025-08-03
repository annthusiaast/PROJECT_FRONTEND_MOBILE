import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Bell, Calendar, Clock, Download, Eye, Search, ChevronDown } from "lucide-react-native";
import { today, documents, CASE_FILTERS, DOC_TYPES } from "@/constants/sample_data";
import { styles } from "../../constants/styles/(tabs)/documents_styles";

const Dropdown = ({ label, options, value, onSelect, topOffset }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.dropdownButton, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <ChevronDown size={16} color="#114d89" />
      </TouchableOpacity>

      {/* Absolutely Positioned Dropdown */}
      {open && (
        <View
          style={{
            position: "absolute",
            top: topOffset || 40,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            elevation: 4,
            zIndex: 9999,
          }}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={{ padding: 10 }}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Documents = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  const [caseFilter, setCaseFilter] = useState("All Cases");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // Filtered Documents
  const filteredDocs = documents.filter(
    (doc) =>
      (caseFilter === "All Cases" || doc.caseName === caseFilter) &&
      (typeFilter === "All Types" || doc.type === typeFilter)
  );

  const finalDocs = activeTab === "Recent" ? filteredDocs.slice(0, 5) : filteredDocs;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }}>
          {/* Header */}
          <Text style={styles.headerDate}>{today}</Text>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerContainer}>Documents</Text>
            <TouchableOpacity onPress={() => alert("Notifications Clicked!")} style={{ marginTop: 15 }}>
              <Bell size={26} color="#373839" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search documents..." placeholderTextColor="#999" />
          </View>

          {/* Filters */}
          <View style={{ flexDirection: "row", marginHorizontal: 14, marginTop: 10, zIndex: 10 }}>
            <Dropdown label="Case" options={CASE_FILTERS} value={caseFilter} onSelect={setCaseFilter} topOffset={42} />
            <View style={{ width: 10 }} />
            <Dropdown label="Type" options={DOC_TYPES} value={typeFilter} onSelect={setTypeFilter} topOffset={42} />
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: "row", marginHorizontal: 14, marginTop: 15 }}>
            {["Recent", "All Files"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Document List */}
          {finalDocs.length > 0 ? (
            finalDocs.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                {/* Title */}
                <View style={styles.docHeader}>
                  <View>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text style={styles.docCase}>{doc.caseName}</Text>
                  </View>
                  <View style={styles.docTag}>
                    <Text style={styles.docTagText}>{doc.type}</Text>
                  </View>
                </View>

                {/* Meta */}
                <View style={styles.docMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.metaText}>{doc.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.metaText}>{doc.size}</Text>
                  </View>
                </View>

                {/* Buttons (View & Download close together) */}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
                  <TouchableOpacity style={[styles.viewButton, { marginRight: 6 }]}>
                    <Eye size={16} color="#1E3A8A" />
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewButton}>
                    <Download size={16} color="#1E3A8A" />
                    <Text style={styles.ButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>No documents found.</Text>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Documents;
