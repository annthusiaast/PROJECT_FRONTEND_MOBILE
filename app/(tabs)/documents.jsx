import React, { useState, useEffect } from "react";
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
  Linking,
} from "react-native";
import { Calendar, User, Download, Search, ChevronDown } from "lucide-react-native";
import { CASE_FILTERS, DOC_TYPES } from "@/constants/sample_data";
import { styles } from "../../constants/styles/(tabs)/documents_styles";
import { API_CONFIG, getEndpoint } from "@/constants/api-config";

const Dropdown = ({ label, options, value, onSelect, topOffset }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, position: 'relative', zIndex: 100 }}>
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
            elevation: 12,
            zIndex: 1000,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
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

// Helper to format dates: Month day, Year. Hour:Minute AM/PM
const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value); // Fallback to raw if unparsable
  const datePart = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}. ${timePart}`;
};

const Documents = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  const [caseFilter, setCaseFilter] = useState("All Cases");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]); // for resolving submitter names
  const [loading, setLoading] = useState(false);

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await fetch(getEndpoint('/documents'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        const origin = String(API_CONFIG.BASE_URL || '').replace('/api', '');
        const mapped = Array.isArray(data)
          ? data
              .filter((d) => !!d?.doc_file) // only include docs with actual file
              .map((d, idx) => {
                const isTask = String(d?.doc_type || '').toLowerCase().includes('task');
                const chosenDate = isTask
                  ? (d.doc_date_submitted || d.doc_due_date || d.updated_at)
                  : (d.doc_date_created || d.created_at || d.updated_at || d.doc_due_date);
                return {
                  id: d.doc_id || idx,
                  title: d.doc_name || 'Untitled',
                  caseName: d.case_id ? `Case #${d.case_id}` : 'No Case',
                  type: d.doc_type || 'Document',
                  date: chosenDate || '',
                  size: d.size || '',
                  fileUrl: d.doc_file ? `${origin}${d.doc_file}` : null,
                  submittedById: d.doc_submitted_by || d.submitted_by_id || null,
                  submittedByName: d.submitted_by_name || null,
                  raw: d,
                };
              })
          : [];
        setDocs(mapped);
      } catch (e) {
        console.warn('Documents fetch failed:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Fetch users to resolve submitter names (web-style client-side join)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(getEndpoint('/users'), { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const getSubmitterName = (submittedById) => {
    if (!submittedById) return '-';
    // compare as strings to avoid type mismatches
    const idStr = String(submittedById);
    const u = users.find(x => String(x.user_id) === idStr);
    if (!u) return idStr; // fallback to showing the id
    const m = u.user_mname ? `${u.user_mname[0]}.` : '';
    const name = `${u.user_fname} ${m} ${u.user_lname}`.replace(/\s+/g, ' ').trim();
    return u.user_role === 'Staff' ? name : `Atty. ${name}`;
  };

  const filteredDocs = docs.filter(
    (doc) =>
      (caseFilter === "All Cases" || doc.caseName === caseFilter) &&
      (typeFilter === "All Types" || doc.type === typeFilter)
  );

  const finalDocs = activeTab === "Recent" ? filteredDocs.slice(0, 5) : filteredDocs;

  const openUrl = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Failed to open URL:', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }}>

          {/* Search */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
          </View>

          {/* Filters */}
          <View style={{ flexDirection: "row", marginHorizontal: 14, marginTop: 10, zIndex: 200, elevation: 16, position: 'relative' }}>
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
                    <Text style={styles.metaText}>{doc.date ? formatDateTime(doc.date) : ''}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>{doc.size || '-'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <User size={14} color="#666" />
                    <Text style={styles.metaText}>{doc.submittedByName || getSubmitterName(doc.submittedById)}</Text>
                  </View>
                </View>

                {/* Buttons ( Download close together) */}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
                  <TouchableOpacity style={styles.downloadButton} onPress={() => openUrl(doc.fileUrl)} disabled={!doc.fileUrl}>
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
