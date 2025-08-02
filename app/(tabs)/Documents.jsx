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
  Modal,
  Pressable,
  findNodeHandle,
  UIManager,
} from "react-native";
import { Bell, Calendar, Clock, Download, Eye, Search, ChevronDown } from "lucide-react-native";
import { today, documents, CASE_FILTERS, DOC_TYPES } from "@/constants/sample_data"; // Add filter options to your sample_data
import { styles } from "../../constants/styles/(tabs)/documents_styles";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  const [caseFilter, setCaseFilter] = useState("All Cases");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [modalType, setModalType] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 20, right: 20 });

  const buttonRefs = {
    case: useRef(null),
    type: useRef(null),
  };

  // === Measure Dropdown Position ===
  const measureDropdown = (type) => {
    const handle = findNodeHandle(buttonRefs[type].current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, _width, height, pageX, pageY) => {
        setDropdownPos({ top: pageY + height, left: pageX, right: 20 });
        setModalType(type);
      });
    }
  };

  // === Dropdown Button Component ===
  const DropdownButton = ({ value, type }) => (
    <TouchableOpacity
      ref={buttonRefs[type]}
      style={styles.dropdownButton}
      onPress={() => measureDropdown(type)}
    >
      <Text style={styles.dropdownText}>{value}</Text>
      <ChevronDown size={16} color="#114d89" />
    </TouchableOpacity>
  );

  // === Dropdown Modal Component ===
  const DropdownModal = ({ visible, options, onSelect }) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} onPress={() => setModalType(null)}>
        <View style={[styles.dropdownModal, { top: dropdownPos.top, left: dropdownPos.left, right: dropdownPos.right, width: 180 }]}>
          {options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={{ padding: 12 }}
              onPress={() => {
                onSelect(opt);
                setModalType(null);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  // === Filter Documents Based on Tabs & Filters ===
  const filteredDocs = documents.filter((doc) => {
    const caseMatch = caseFilter === "All Cases" || doc.caseName === caseFilter;
    const typeMatch = typeFilter === "All Types" || doc.type === typeFilter;
    return caseMatch && typeMatch;
  });

  const finalDocs = activeTab === "Recent" ? filteredDocs.slice(0, 5) : filteredDocs;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }}>
          {/* === Header === */}
          <Text style={styles.headerDate}>{today}</Text>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerContainer}>Documents</Text>
            <TouchableOpacity onPress={() => alert("Notifications Clicked!")} style={{ marginTop: 15 }}>
              <Bell size={26} color="#373839" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* === Search Input === */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search documents..." placeholderTextColor="#999" />
          </View>

          {/* === Filter Dropdowns === */}
          <View style={{ flexDirection: "row", marginHorizontal: 14, marginTop: 10 }}>
            <DropdownButton value={caseFilter} type="case" />
            <View style={{ width: 10 }} /> 
            <DropdownButton value={typeFilter} type="type" />
          </View>

          {/* === Tabs === */}
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

          {/* === Document Cards === */}
          {finalDocs.length > 0 ? (
            finalDocs.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <View style={styles.docHeader}>
                  <View>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text style={styles.docCase}>{doc.caseName}</Text>
                  </View>
                  <View style={styles.docTag}>
                    <Text style={styles.docTagText}>{doc.type}</Text>
                  </View>
                </View>

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

                <View style={styles.docButtons}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Eye size={16} color="#1E3A8A" />
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={16} color="#fff" />
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>No documents found.</Text>
          )}

          {/* === Dropdown Modals === */}
          <DropdownModal visible={modalType === "case"} options={CASE_FILTERS} onSelect={setCaseFilter} />
          <DropdownModal visible={modalType === "type"} options={DOC_TYPES} onSelect={setTypeFilter} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Documents;
