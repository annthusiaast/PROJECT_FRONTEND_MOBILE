import { today } from "@/constants/sample_data";
import { Bell, Calendar, Clock, Download, Eye, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { documents } from "../../constants/sample_data";
import { styles } from "../../constants/styles/(tabs)/documents_styles";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }}>
          {/* Header Date */}
          <View>
            <Text style={styles.headerDate}>{today}</Text>
          </View>

          {/* Header with Notification */}
          <View style={styles.headerWrapper}>
            <Text style={styles.headerContainer}>Documents</Text>
            <TouchableOpacity
              onPress={() => alert("Notifications Clicked!")}
              style={{ marginTop: 15 }}
            >
              <Bell size={26} color="#373839" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search documents..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Filter Dropdowns */}
          <View style={{ flexDirection: "row", gap: 1, marginRight: 18, marginTop: 10 }}>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>All Cases</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: "row", marginRight: 15, marginLeft: 14, marginTop: 15 }}>
            {["Recent", "All Files"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Document Cards */}
          {documents.map((doc) => (
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
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Documents;
