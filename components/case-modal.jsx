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
import { getEndpoint } from "@/constants/api-config";

const CaseModal = ({ visible, onClose, caseData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCase, setEditableCase] = useState(caseData || {});
  const [baseCase, setBaseCase] = useState(caseData || {}); // persisted snapshot (last fetched)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllDocs, setShowAllDocs] = useState(false);

  useEffect(() => {
    // When a different case is selected, reset both editable and base to the incoming data
    setBaseCase(caseData || {});
    setEditableCase(caseData || {});
    setIsEditing(false);
    setError(null);
    setShowFullDesc(false);
    setShowAllDocs(false);
  }, [caseData]);

  // Fetch latest case details from backend when modal opens
  useEffect(() => {
    const fetchCaseDetails = async () => {
      const caseId = caseData?.id || caseData?.case_id;
      if (!visible || !caseId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getEndpoint(`/cases/${caseId}`), {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to load case details');
        }
        const data = await res.json();
        // Best-effort mapping from backend fields to modal fields
        const mapped = {
          ...editableCase,
          id: data.case_id ?? editableCase.id,
          title: data.ct_name || data.case_title || editableCase.title,
          category: data.cc_name || editableCase.category,
          client: data.client_fullname || editableCase.client,
          lawyer: data.user_fname ? `${data.user_fname} ${data.user_lname || ''}`.trim() : (editableCase.lawyer || ''),
          totalFee: data.case_fee ?? editableCase.totalFee,
          totalPaid: data.total_paid ?? editableCase.totalPaid,
          description: data.case_remarks || data.case_description || editableCase.description,
          dateFiled: data.case_date_created || editableCase.dateFiled,
          status: (data.case_status || editableCase.status || 'Pending'),
          cabinetNo: data.case_cabinet ?? editableCase.cabinetNo,
          drawerNo: data.case_drawer ?? editableCase.drawerNo,
          documents: Array.isArray(data.documents) ? data.documents.map(d => ({
            name: d.name || d.filename || 'Document',
            status: d.status || 'available',
            link: d.link || d.url || d.download_url || '',
          })) : (editableCase.documents || []),
        };
        setBaseCase(mapped);
        setEditableCase(mapped);
      } catch (e) {
        setError(e.message || 'Error loading case details');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, caseData?.id, caseData?.case_id]);

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

  // numbers (ensure numeric math for summary)
  const totalFee = Number(editableCase.totalFee) || 0;
  const totalPaid = Number(editableCase.totalPaid) || 0;
  const remaining = Math.max(totalFee - totalPaid, 0);

  const safeOpen = (url) => {
    if (!url) return;
    // best-effort validation
    const canOpen = /^https?:\/\//i.test(url) || /^file:\/\//i.test(url);
    if (canOpen) Linking.openURL(url);
  };

  const Field = ({ label, fieldKey, placeholder }) => (
    <View style={styles.rowCompact}>
      <Text style={styles.labelCompact}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.inputCompact}
          value={editableCase[fieldKey] ?? ''}
          placeholder={placeholder}
          onChangeText={(text) => handleChange(fieldKey, text)}
        />
      ) : (
        <Text style={styles.valueCompact} numberOfLines={1}>
          {editableCase[fieldKey] || 'N/A'}
        </Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={styles.modal}>
              {error ? (
                <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
              ) : null}
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
                    <Text style={styles.squareBtnText}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[styles.squareBtn, { backgroundColor: "#e6e6e6" }]}
                      onPress={() => {
                        // Revert edits to last fetched (persisted) snapshot, not the lightweight list item
                        setEditableCase(baseCase);
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

              <View style={styles.metaRow}>
                <View style={styles.chip}><Text style={styles.chipText}>Cabinet: {editableCase.cabinetNo || 'N/A'}</Text></View>
                <View style={styles.chip}><Text style={styles.chipText}>Drawer: {editableCase.drawerNo || 'N/A'}</Text></View>
              </View>

              {/* Scrollable content */}
              <ScrollView style={{ marginTop: 8 }}>
                {loading ? (
                  <Text style={{ marginBottom: 10 }}>Loading details...</Text>
                ) : null}
                {/* Case Name */}
                <View style={styles.rowCompact}>
                  <Text style={styles.labelCompact}>Case Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputCompact}
                      value={editableCase.title ?? ''}
                      onChangeText={(text) => handleChange("title", text)}
                    />)
                    : (
                      <Text style={styles.valueCompact} numberOfLines={1}>{editableCase.title || 'N/A'}</Text>
                    )}
                </View>

                {/* Category */}
                <Field label="Category" fieldKey="category" placeholder="Category" />

                {/* Client */}
                <Field label="Client" fieldKey="client" placeholder="Client" />

                {/* Lawyer */}
                <Field label="Lawyer" fieldKey="lawyer" placeholder="Lawyer" />

                {/* Date Filed */}
                <Field label="Date Filed" fieldKey="dateFiled" placeholder="YYYY-MM-DD" />

                {/* Status */}
                <View style={[styles.rowCompact, { marginTop: 6 }]}>
                  <Text style={styles.labelCompact}>Status</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputCompact}
                      value={editableCase.status ?? ''}
                      onChangeText={(text) => handleChange("status", text)}
                    />
                  ) : (
                    <Text style={[styles.valueCompact, { color: "#b00020" }]} numberOfLines={1}>
                      {editableCase.status || "Pending"}
                    </Text>
                  )}
                </View>

                {/* Payment (condensed) */}
                <View style={styles.paymentBox}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.payLabel}>Fee</Text>
                    <Text style={styles.payValue}>₱{totalFee.toFixed(2)}</Text>
                    <Text style={styles.payLabel}>Paid</Text>
                    <Text style={styles.payValue}>₱{totalPaid.toFixed(2)}</Text>
                    <Text style={[styles.payLabel, { marginLeft: 6 }]}>Rem</Text>
                    <Text style={[styles.payValue, { color: "#b00020", fontWeight: '700' }]}>₱{remaining.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => { /* open payments screen hook */ }}>
                    <Text style={styles.linkInline}>View payment record</Text>
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.label}>Description</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.textarea, { minHeight: 80 }]}
                      value={editableCase.description ?? ''}
                      multiline
                      editable
                      onChangeText={(text) => handleChange("description", text)}
                    />
                  ) : (
                    <>
                      <Text
                        style={styles.descriptionText}
                        numberOfLines={showFullDesc ? undefined : 3}
                      >
                        {editableCase.description || '—'}
                      </Text>
                      {(editableCase.description || '').length > 120 && (
                        <TouchableOpacity onPress={() => setShowFullDesc((s) => !s)}>
                          <Text style={styles.linkInline}>{showFullDesc ? 'Show less' : 'Show more'}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>

                {/* Documents */}
                <View style={styles.section}>
                  <Text style={styles.label}>Documents</Text>
                  {(() => {
                    const docs = editableCase.documents || [];
                    const visibleDocs = showAllDocs ? docs : docs.slice(0, 3);
                    return (
                      <>
                        {visibleDocs.map((doc, index) => (
                          <View key={index} style={styles.docRow}>
                            <Text style={[styles.docText, { flex: 1.4 }]} numberOfLines={1}>{doc.name}</Text>
                            <Text style={[styles.docText, { flex: 0.8, textAlign: 'right', color: '#555' }]} numberOfLines={1}>{doc.status}</Text>
                            <Text style={styles.link} onPress={() => safeOpen(doc.link)}>Open</Text>
                          </View>
                        ))}
                        {docs.length > 3 && !showAllDocs && (
                          <TouchableOpacity onPress={() => setShowAllDocs(true)}>
                            <Text style={styles.linkInline}>Show all ({docs.length})</Text>
                          </TouchableOpacity>
                        )}
                        {docs.length > 3 && showAllDocs && (
                          <TouchableOpacity onPress={() => setShowAllDocs(false)}>
                            <Text style={styles.linkInline}>Show less</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    );
                  })()}
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
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 12,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: "800", flex: 1 },
  sub: { color: "#888", marginTop: 2 },
  close: { fontSize: 30, color: "#999", paddingHorizontal: 6 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  chip: { backgroundColor: '#f2f4f7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  chipText: { color: '#475467', fontSize: 12 },

  // Compact field
  rowCompact: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  labelCompact: { fontSize: 12, color: '#666', width: 92 },
  valueCompact: { fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right', color: '#111' },
  inputCompact: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },

  label: { fontSize: 13, color: "#666" },
  section: { marginTop: 12 },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
    marginTop: 6,
  },
  descriptionText: { marginTop: 6, fontSize: 14, color: '#222' },

  paymentBox: {
    backgroundColor: "#f6f7f9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payLabel: { fontSize: 12, color: '#666' },
  payValue: { fontSize: 14, fontWeight: '600' },
  linkInline: { color: '#1e90ff', marginTop: 6, textDecorationLine: 'underline', alignSelf: 'flex-start' },

  docRow: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  docText: { fontSize: 13 },
  link: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    marginLeft: 8,
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
    width: 44,
    height: 30,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  twoColumnWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  squareBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0B3D91",
  },
});
