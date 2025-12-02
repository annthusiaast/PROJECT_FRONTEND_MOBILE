import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
} from "react-native";
import { API_CONFIG, getEndpoint } from "@/constants/api-config";
import DropDownPicker from "react-native-dropdown-picker";
import { Pencil } from "lucide-react-native";
import { useAuth } from "@/context/auth-context";
import PaymentsModal from "./payments-modal";

const formatUserDisplayName = (record) => {
  if (!record) return "Unknown";
  const middle = record.user_mname ? `${record.user_mname[0]}.` : "";
  const raw = `${record.user_fname || ""} ${middle} ${record.user_lname || ""}`
    .replace(/\s+/g, " ")
    .trim();
  if (raw) return raw;
  if (record.user_email) return record.user_email;
  return `User ${record.user_id ?? ""}`.trim();
};

const CaseModal = ({ visible, onClose, caseData, onSave }) => {
  const { user } = useAuth();
  const isAdmin = user?.user_role === "admin";

  const [isEditing, setIsEditing] = useState(false);
  const [editableCase, setEditableCase] = useState(caseData || {});
  const [baseCase, setBaseCase] = useState(caseData || {}); // persisted snapshot (last fetched)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [clientItems, setClientItems] = useState([]);
  const [clientLookup, setClientLookup] = useState({});
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [caseCategoryItems, setCaseCategoryItems] = useState([]);
  const [caseCategoryLookup, setCaseCategoryLookup] = useState({});
  const [caseCategoryDropdownOpen, setCaseCategoryDropdownOpen] = useState(false);
  const [caseCategoriesLoading, setCaseCategoriesLoading] = useState(false);
  const [caseTypeItems, setCaseTypeItems] = useState([]);
  const [caseTypeLookup, setCaseTypeLookup] = useState({});
  const [caseTypeDropdownOpen, setCaseTypeDropdownOpen] = useState(false);
  const [caseTypesLoading, setCaseTypesLoading] = useState(false);
  const [lawyerItems, setLawyerItems] = useState([]);
  const [lawyerDropdownOpen, setLawyerDropdownOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userLookup, setUserLookup] = useState({});

  useEffect(() => {
    // When a different case is selected, reset both editable and base to the incoming data
    setBaseCase(caseData || {});
    setEditableCase(caseData || {});
    setIsEditing(false);
    setError(null);
    setShowFullDesc(false);
    setShowAllDocs(false);
  }, [caseData]);

  useEffect(() => {
    if (!visible) {
      setClientDropdownOpen(false);
      setLawyerDropdownOpen(false);
      setCaseCategoryDropdownOpen(false);
      setCaseTypeDropdownOpen(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!isEditing) {
      setClientDropdownOpen(false);
      setLawyerDropdownOpen(false);
      setCaseCategoryDropdownOpen(false);
      setCaseTypeDropdownOpen(false);
    }
  }, [isEditing]);

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
        const rawStatus = data.case_status || editableCase.status || editableCase.rawStatus || 'Pending';
        const isArchived = String(rawStatus).toLowerCase().includes('archived');
        const normalizedStatus = isArchived ? 'archived' : String(rawStatus).toLowerCase();
        
        const mapped = {
          ...editableCase,
          id: data.case_id ?? editableCase.id,
          caseTypeId: data.ct_id ?? editableCase.caseTypeId,
          title: data.ct_name || data.case_title || editableCase.title,
          categoryId: data.cc_id ?? editableCase.categoryId,
          category: data.cc_name || editableCase.category,
          clientId: data.client_id ?? editableCase.clientId,
          client: data.client_fullname || editableCase.client,
          lawyerId: data.user_id ?? editableCase.lawyerId,
          lawyer: data.user_fname ? `${data.user_fname} ${data.user_lname || ''}`.trim() : (editableCase.lawyer || ''),
          totalFee: data.case_fee ?? editableCase.totalFee,
          caseBalance: data.case_balance ?? editableCase.caseBalance,
          // derive totalPaid: prefer explicit total_paid; else compute from fee - balance
          totalPaid: (data.total_paid != null && data.total_paid !== '')
            ? data.total_paid
            : (data.case_fee != null && data.case_balance != null
                ? (Number(data.case_fee) - Number(data.case_balance))
                : editableCase.totalPaid),
          description: data.case_remarks || data.case_description || editableCase.description,
          dateFiled: data.case_date_created || editableCase.dateFiled,
          status: normalizedStatus,
          rawStatus: rawStatus,
          cabinetNo: data.case_cabinet ?? editableCase.cabinetNo,
          drawerNo: data.case_drawer ?? editableCase.drawerNo,
          lastUpdatedAt: data.case_last_updated ?? editableCase.lastUpdatedAt,
          lastUpdatedBy: data.last_updated_by ?? editableCase.lastUpdatedBy,
          lastUpdatedByName: data.last_updated_by_name || editableCase.lastUpdatedByName,
          // Placeholder; will be replaced by fetch to /case/documents/:caseId
          documents: Array.isArray(data.documents) ? data.documents.map(d => ({
            name: d.name || d.filename || 'Document',
            status: d.status || 'available',
            link: d.link || d.url || d.download_url || '',
          })) : (editableCase.documents || []),
        };
        setBaseCase(mapped);
        setEditableCase(mapped);

        // After basic case details, fetch associated documents
        try {
          const docsRes = await fetch(getEndpoint(`/case/documents/${caseId}`), {
            method: 'GET',
            credentials: 'include',
          });
          if (docsRes.ok) {
            const docsData = await docsRes.json();
            const origin = String(API_CONFIG.BASE_URL || '').replace('/api', '');
            const docsMapped = (Array.isArray(docsData) ? docsData : [])
              .map(d => ({
                id: d.doc_id,
                name: d.doc_name || 'Document',
                type: d.doc_type || 'Document',
                status: d.doc_status || 'available',
                due: d.doc_due_date || null,
                submittedById: d.doc_submitted_by || null,
                taskedById: d.doc_tasked_by || null,
                link: d.doc_file ? `${origin}${d.doc_file}` : '',
              }));
            setBaseCase(prev => ({ ...prev, documents: docsMapped }));
            setEditableCase(prev => ({ ...prev, documents: docsMapped }));
          }
        } catch (_ignored) {
          // keep existing docs if fetch fails
        }
      } catch (e) {
        setError(e.message || 'Error loading case details');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, caseData?.id, caseData?.case_id]);

  useEffect(() => {
    if (!visible) return;
    let ignore = false;

    const loadClients = async () => {
      setClientsLoading(true);
      try {
        let endpoint = "/clients";
        if (user?.user_role === "Admin") {
          endpoint = "/all-clients";
        } else if (user?.user_role === "Lawyer" && user?.user_id) {
          endpoint = `/clients/${user.user_id}`;
        }
        const res = await fetch(getEndpoint(endpoint), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load clients");
        const data = await res.json();
        if (ignore) return;
        const items = (Array.isArray(data) ? data : []).map((client) => ({
          label: client.client_fullname || `Client ${client.client_id}`,
          value: client.client_id,
        }));
        items.sort((a, b) => a.label.localeCompare(b.label));
        const lookup = Object.fromEntries(items.map((item) => [item.value, item.label]));
        setClientItems(items);
        setClientLookup(lookup);
      } catch (_e) {
        // silently ignore
      } finally {
        if (!ignore) setClientsLoading(false);
      }
    };

    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch(getEndpoint("/users"), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        if (ignore) return;
        const lookup = {};
        const lawyerList = [];
        (Array.isArray(data) ? data : []).forEach((u) => {
          lookup[u.user_id] = formatUserDisplayName(u);
          if (u.user_role === "Lawyer") {
            lawyerList.push({
              label: formatUserDisplayName(u),
              value: u.user_id,
            });
          }
        });
        lawyerList.sort((a, b) => a.label.localeCompare(b.label));
        setUserLookup(lookup);
        setLawyerItems(lawyerList);
      } catch (_e) {
        // silently ignore
      } finally {
        if (!ignore) setUsersLoading(false);
      }
    };

    const loadCaseCategories = async () => {
      setCaseCategoriesLoading(true);
      try {
        const res = await fetch(getEndpoint("/case-categories"), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load case categories");
        const data = await res.json();
        if (ignore) return;
        const items = (Array.isArray(data) ? data : []).map((cat) => {
          const id = cat.cc_id ?? cat.category_id ?? cat.id ?? null;
          return {
            label: cat.cc_name || cat.category_name || cat.name || (id != null ? `Category ${id}` : "Category"),
            value: id,
          };
        }).filter((item) => item.value != null);
        items.sort((a, b) => a.label.localeCompare(b.label));
        const lookup = Object.fromEntries(items.map((item) => [item.value, item.label]));
        setCaseCategoryItems(items);
        setCaseCategoryLookup(lookup);
      } catch (_e) {
        // silently ignore
      } finally {
        if (!ignore) setCaseCategoriesLoading(false);
      }
    };

    const loadCaseTypes = async () => {
      setCaseTypesLoading(true);
      try {
        const res = await fetch(getEndpoint("/case-category-types"), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load case types");
        const data = await res.json();
        if (ignore) return;
        const items = (Array.isArray(data) ? data : []).map((type) => {
          const id = type.ct_id ?? type.case_type_id ?? type.id ?? null;
          const categoryId = type.cc_id ?? type.category_id ?? null;
          return {
            label: type.ct_name || type.case_type || type.name || (id != null ? `Type ${id}` : "Type"),
            value: id,
            categoryId,
          };
        }).filter((item) => item.value != null);
        items.sort((a, b) => a.label.localeCompare(b.label));
        const lookup = Object.fromEntries(items.map((item) => [item.value, item.label]));
        setCaseTypeItems(items);
        setCaseTypeLookup(lookup);
      } catch (_e) {
        // silently ignore
      } finally {
        if (!ignore) setCaseTypesLoading(false);
      }
    };

    loadClients();
    loadUsers();
    loadCaseCategories();
    loadCaseTypes();

    return () => {
      ignore = true;
    };
  }, [visible, user?.user_role, user?.user_id]);

  useEffect(() => {
    if (clientDropdownOpen) {
      setLawyerDropdownOpen(false);
      setCaseCategoryDropdownOpen(false);
      setCaseTypeDropdownOpen(false);
    }
  }, [clientDropdownOpen]);

  useEffect(() => {
    if (lawyerDropdownOpen) {
      setClientDropdownOpen(false);
      setCaseCategoryDropdownOpen(false);
      setCaseTypeDropdownOpen(false);
    }
  }, [lawyerDropdownOpen]);

  useEffect(() => {
    if (caseCategoryDropdownOpen) {
      setClientDropdownOpen(false);
      setLawyerDropdownOpen(false);
      setCaseTypeDropdownOpen(false);
    }
  }, [caseCategoryDropdownOpen]);

  useEffect(() => {
    if (caseTypeDropdownOpen) {
      setClientDropdownOpen(false);
      setLawyerDropdownOpen(false);
      setCaseCategoryDropdownOpen(false);
    }
  }, [caseTypeDropdownOpen]);

  const clientId = editableCase?.clientId;
  const currentClientName = editableCase?.client;
  const lawyerId = editableCase?.lawyerId;
  const currentLawyerName = editableCase?.lawyer;
  const categoryId = editableCase?.categoryId ?? null;
  const currentCategoryName = editableCase?.category;
  const caseTypeId = editableCase?.caseTypeId ?? null;
  const currentCaseTypeName = editableCase?.title;

  useEffect(() => {
    if (!clientId) return;
    const resolvedName = clientLookup[clientId];
    if (resolvedName && resolvedName !== currentClientName) {
      setEditableCase((prev) => ({ ...prev, client: resolvedName }));
    }
  }, [clientId, currentClientName, clientLookup]);

  useEffect(() => {
    if (!lawyerId) return;
    const resolvedName = userLookup[lawyerId];
    if (resolvedName && resolvedName !== currentLawyerName) {
      setEditableCase((prev) => ({ ...prev, lawyer: resolvedName }));
    }
  }, [lawyerId, currentLawyerName, userLookup]);

  useEffect(() => {
    if (categoryId == null) return;
    const resolvedName = caseCategoryLookup[categoryId];
    if (resolvedName && resolvedName !== currentCategoryName) {
      setEditableCase((prev) => ({ ...prev, category: resolvedName }));
    }
  }, [categoryId, currentCategoryName, caseCategoryLookup]);

  useEffect(() => {
    if (caseTypeId == null) return;
    const resolvedName = caseTypeLookup[caseTypeId];
    if (resolvedName && resolvedName !== currentCaseTypeName) {
      setEditableCase((prev) => ({ ...prev, title: resolvedName }));
    }
  }, [caseTypeId, currentCaseTypeName, caseTypeLookup]);

  const filteredCaseTypeItems = useMemo(() => {
    if (!caseTypeItems.length) return caseTypeItems;
    if (categoryId == null) return caseTypeItems;
    return caseTypeItems.filter(
      (item) => item.categoryId == null || item.categoryId === categoryId
    );
  }, [caseTypeItems, categoryId]);

  const lastUpdatedByResolved = useMemo(() => {
    if (editableCase?.lastUpdatedBy && userLookup[editableCase.lastUpdatedBy]) {
      return userLookup[editableCase.lastUpdatedBy];
    }
    if (editableCase?.lastUpdatedByName) return editableCase.lastUpdatedByName;
    if (editableCase?.lastUpdatedBy) return `User ${editableCase.lastUpdatedBy}`;
    return null;
  }, [editableCase?.lastUpdatedBy, editableCase?.lastUpdatedByName, userLookup]);

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
  const caseBalanceNum = editableCase.caseBalance != null ? Number(editableCase.caseBalance) : NaN;
  const totalPaid = (editableCase.totalPaid != null && editableCase.totalPaid !== '')
    ? Number(editableCase.totalPaid)
    : (!isNaN(caseBalanceNum) ? Math.max(totalFee - caseBalanceNum, 0) : 0);
  const remaining = !isNaN(caseBalanceNum)
    ? Math.max(caseBalanceNum, 0)
    : Math.max(totalFee - totalPaid, 0);

  const safeOpen = (url) => {
    if (!url) return;
    // best-effort validation
    const canOpen = /^https?:\/\//i.test(url) || /^file:\/\//i.test(url);
    if (canOpen) Linking.openURL(url);
  };

  const Field = ({ label, fieldKey, placeholder, editable = true, formatter, renderEdit }) => {
    const renderValue = () => {
      const raw = editableCase[fieldKey];
      if (raw === 0) return '0';
      if (!raw) return 'N/A';
      if (formatter) return formatter(raw);
      return raw;
    };

    return (
      <View style={styles.rowCompact}>
        <Text style={styles.labelCompact}>{label}</Text>
        {(isEditing && editable) ? (
          renderEdit ? (
            renderEdit({
              value: editableCase[fieldKey],
              onChange: (text) => handleChange(fieldKey, text),
            })
          ) : (
            <TextInput
              style={styles.inputCompact}
              value={editableCase[fieldKey] ?? ''}
              placeholder={placeholder}
              onChangeText={(text) => handleChange(fieldKey, text)}
            />
          )
        ) : (
          <Text style={styles.valueCompact} numberOfLines={1}>
            {renderValue()}
          </Text>
        )}
      </View>
    );
  };

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (isNaN(d)) return value; // fallback to raw if invalid
    return d.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Status color mapping aligned with list view (see all-case.jsx)
  const statusColors = {
    pending: '#656162ff',
    processing: '#3b82f6',
    completed: '#0c8744ff',
  };
  const statusValueRaw = editableCase.status || 'Pending';
  const statusValue = statusValueRaw.toLowerCase();
  const statusColor = statusColors[statusValue] || '#656162ff';
  const assignedLawyerId = editableCase?.lawyerId ?? baseCase?.lawyerId;
  const isSelfAssignedLawyer = user?.user_role === 'Lawyer' && user?.user_id && assignedLawyerId && Number(user.user_id) === Number(assignedLawyerId);
  const canEditAssignedLawyer = isAdmin || !isSelfAssignedLawyer;
  const formattedLastUpdatedAt = editableCase?.lastUpdatedAt ? formatDateTime(editableCase.lastUpdatedAt) : null;

  // Case status actions similar to web view-case.jsx
  const handleCaseAction = async (type) => {
    const currentStatus = String(editableCase?.status || '').toLowerCase();
    if (currentStatus !== 'processing') {
      Alert.alert('Not allowed', 'Only processing cases can be updated.');
      return;
    }

    // Prevent closing if there are pending or in-progress documents
    if (type === 'close') {
      const hasPending = (editableCase?.documents || []).some((d) => {
        const s = String(d?.status || '').toLowerCase();
        return s === 'todo' || s === 'in_progress';
      });
      if (hasPending) {
        Alert.alert('Cannot close case', 'There are pending or in-progress documents. Complete them before closing.');
        return;
      }
    }

    const actionLabel = type === 'close' ? 'Close Case' : 'Dismiss Case';
    const newStatus = type === 'close' ? 'Completed' : 'Dismissed';

    Alert.alert(
      actionLabel,
      `Are you sure you want to ${type === 'close' ? 'close' : 'dismiss'} this case?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            const caseId = caseData?.id || caseData?.case_id;
            if (!caseId) return;
            try {
              const res = await fetch(getEndpoint(`/cases/${caseId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  case_status: newStatus,
                  last_updated_by: user?.user_id || null,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data?.error || `Failed to ${type} case`);
              // Update local state optimistically
              setBaseCase((prev) => ({ ...prev, status: newStatus, lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
              setEditableCase((prev) => ({ ...prev, status: newStatus, lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
            } catch (e) {
              Alert.alert('Error', e.message || `Failed to ${type} case.`);
            }
          },
        },
      ]
    );
  };

  // Unarchive action for archived cases
  const handleUnarchive = async () => {
    // Check if user is admin
    if (String(user?.user_role || '').toLowerCase() !== 'admin') {
      Alert.alert('Access Denied', 'Only administrators can unarchive cases.');
      return;
    }

    const currentStatus = String(editableCase?.status || editableCase?.rawStatus || '').toLowerCase();
    if (!currentStatus.includes('archived')) {
      Alert.alert('Not allowed', 'Only archived cases can be unarchived.');
      return;
    }

    Alert.alert(
      'Unarchive Case',
      'Are you sure you want to unarchive this case? It will be restored to Completed status.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const caseId = caseData?.id || caseData?.case_id;
            if (!caseId) return;
            try {
              const res = await fetch(getEndpoint(`/cases/${caseId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  case_status: 'Completed',
                  last_updated_by: user?.user_id || null,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data?.error || 'Failed to unarchive case');
              // Update local state and close modal
              setBaseCase((prev) => ({ ...prev, status: 'completed', rawStatus: 'Completed', lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
              setEditableCase((prev) => ({ ...prev, status: 'completed', rawStatus: 'Completed', lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
              Alert.alert('Success', 'Case unarchived successfully.');
              // Trigger parent refresh by calling onSave
              if (onSave) {
                onSave({ ...editableCase, status: 'completed', case_status: 'Completed' });
              }
              // Close modal after short delay
              setTimeout(() => onClose(), 1000);
            } catch (e) {
              Alert.alert('Error', e.message || 'Failed to unarchive case.');
            }
          },
        },
      ]
    );
  };

  // Archive action for completed or dismissed cases
  const handleArchive = async () => {
    // Check if user is admin
    if (String(user?.user_role || '').toLowerCase() !== 'admin') {
      Alert.alert('Access Denied', 'Only administrators can archive cases.');
      return;
    }

    const currentStatus = String(editableCase?.status || editableCase?.rawStatus || '').toLowerCase();
    const isCompleted = currentStatus === 'completed';
    const isDismissed = currentStatus === 'dismissed';
    
    if (!isCompleted && !isDismissed) {
      Alert.alert('Not allowed', 'Only completed or dismissed cases can be archived.');
      return;
    }

    const archiveStatus = isCompleted ? 'Archived (Completed)' : 'Archived (Dismissed)';

    Alert.alert(
      'Archive Case',
      `Are you sure you want to archive this ${currentStatus} case?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            const caseId = caseData?.id || caseData?.case_id;
            if (!caseId) return;
            try {
              const res = await fetch(getEndpoint(`/cases/${caseId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  case_status: archiveStatus,
                  last_updated_by: user?.user_id || null,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data?.error || 'Failed to archive case');
              // Update local state and close modal
              setBaseCase((prev) => ({ ...prev, status: 'archived', rawStatus: archiveStatus, lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
              setEditableCase((prev) => ({ ...prev, status: 'archived', rawStatus: archiveStatus, lastUpdatedBy: user?.user_id ?? prev.lastUpdatedBy }));
              Alert.alert('Success', 'Case archived successfully.');
              // Trigger parent refresh by calling onSave
              if (onSave) {
                onSave({ ...editableCase, status: 'archived', case_status: archiveStatus });
              }
              // Close modal after short delay
              setTimeout(() => onClose(), 1000);
            } catch (e) {
              Alert.alert('Error', e.message || 'Failed to archive case.');
            }
          },
        },
      ]
    );
  };

  return (
    <>
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
                    accessibilityLabel="Edit case"
                  >
                    <Pencil size={18} color="#0B3D91" />
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

              {/* Cabinet & Drawer (editable) */}
              <View style={styles.metaRow}>
                {(isEditing) ? (
                  <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.chipText}>Cabinet</Text>
                      <TextInput
                        style={styles.metaInput}
                        value={editableCase.cabinetNo ? String(editableCase.cabinetNo) : ''}
                        placeholder="Cabinet"
                        onChangeText={(t) => handleChange('cabinetNo', t)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.chipText}>Drawer</Text>
                      <TextInput
                        style={styles.metaInput}
                        value={(editableCase.drawerNo !== undefined && editableCase.drawerNo !== null && editableCase.drawerNo !== '') ? String(editableCase.drawerNo) : 'N/A'}
                        placeholder="Drawer"
                        onChangeText={(t) => handleChange('drawerNo', t)}
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.chip}><Text style={styles.chipText}>Cabinet: {editableCase.cabinetNo || 'N/A'}</Text></View>
                    <View style={styles.chip}><Text style={styles.chipText}>Drawer: {editableCase.drawerNo || 'N/A'}</Text></View>
                  </>
                )}
              </View>

              {(lastUpdatedByResolved || (formattedLastUpdatedAt && formattedLastUpdatedAt !== 'N/A')) ? (
                <View style={styles.lastUpdatedRow}>
                  <Text style={styles.lastUpdatedLabel}>Last updated by</Text>
                  <Text style={styles.lastUpdatedValue} numberOfLines={2}>
                    {lastUpdatedByResolved || 'N/A'}
                    {(formattedLastUpdatedAt && formattedLastUpdatedAt !== 'N/A') ? ` (${formattedLastUpdatedAt})` : ''}
                  </Text>
                </View>
              ) : null}

              {/* Scrollable content */}
              <ScrollView style={{ marginTop: 8 }}>
                {loading ? (
                  <Text style={{ marginBottom: 10 }}>Loading details...</Text>
                ) : null}
                {/* Case Type (dropdown) */}
                <Field
                  label="Case Type"
                  fieldKey="title"
                  placeholder="Case Type"
                  editable
                  renderEdit={() => (
                    <View style={[styles.dropdownCompact, { zIndex: 3600 }]}>
                      <DropDownPicker
                        open={caseTypeDropdownOpen}
                        value={caseTypeId}
                        items={filteredCaseTypeItems}
                        setOpen={setCaseTypeDropdownOpen}
                        setValue={(callback) => {
                          setEditableCase((prev) => {
                            const current = prev.caseTypeId ?? null;
                            const nextVal = typeof callback === 'function' ? callback(current) : callback;
                            const resolved = nextVal ?? null;
                            return {
                              ...prev,
                              caseTypeId: resolved,
                              title: resolved != null ? (caseTypeLookup[resolved] || prev.title) : '',
                            };
                          });
                        }}
                        setItems={setCaseTypeItems}
                        placeholder="Select case type"
                        style={styles.dropdownInput}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        disabled={caseTypesLoading}
                        loading={caseTypesLoading}
                        zIndex={3600}
                        zIndexInverse={1300}
                      />
                    </View>
                  )}
                />

                {/* Category (dropdown) */}
                <Field
                  label="Category"
                  fieldKey="category"
                  placeholder="Category"
                  editable
                  renderEdit={() => (
                    <View style={[styles.dropdownCompact, { zIndex: 3400 }]}>
                      <DropDownPicker
                        open={caseCategoryDropdownOpen}
                        value={categoryId}
                        items={caseCategoryItems}
                        setOpen={setCaseCategoryDropdownOpen}
                        setValue={(callback) => {
                          setEditableCase((prev) => {
                            const current = prev.categoryId ?? null;
                            const nextVal = typeof callback === 'function' ? callback(current) : callback;
                            const resolved = nextVal ?? null;
                            const resolvedName = resolved != null ? (caseCategoryLookup[resolved] || prev.category) : '';
                            const shouldResetType = resolved == null
                              ? prev.caseTypeId != null
                              : (prev.caseTypeId != null && !caseTypeItems.some((item) => item.value === prev.caseTypeId && (item.categoryId == null || item.categoryId === resolved)));
                            return {
                              ...prev,
                              categoryId: resolved,
                              category: resolvedName,
                              ...(shouldResetType ? { caseTypeId: null, title: '' } : {}),
                            };
                          });
                        }}
                        setItems={setCaseCategoryItems}
                        placeholder="Select category"
                        style={styles.dropdownInput}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        disabled={caseCategoriesLoading}
                        loading={caseCategoriesLoading}
                        zIndex={3400}
                        zIndexInverse={1200}
                      />
                    </View>
                  )}
                />

                {/* Client (dropdown) */}
                <Field
                  label="Client"
                  fieldKey="client"
                  placeholder="Client"
                  editable
                  renderEdit={() => (
                    <View
                      style={[styles.dropdownCompact, { zIndex: 3000 }]}
                    >
                      <DropDownPicker
                        open={clientDropdownOpen}
                        value={editableCase.clientId ?? null}
                        items={clientItems}
                        setOpen={setClientDropdownOpen}
                        setValue={(callback) => {
                          setEditableCase((prev) => {
                            const current = prev.clientId ?? null;
                            const nextVal = typeof callback === 'function' ? callback(current) : callback;
                            const resolved = nextVal ?? null;
                            return {
                              ...prev,
                              clientId: resolved,
                              client: resolved != null ? (clientLookup[resolved] || prev.client) : '',
                            };
                          });
                        }}
                        setItems={setClientItems}
                        placeholder="Select client"
                        style={styles.dropdownInput}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        disabled={clientsLoading}
                        loading={clientsLoading}
                        zIndex={3000}
                        zIndexInverse={1000}
                      />
                    </View>
                  )}
                />

                {/* Assigned Lawyer */}
                <Field
                  label="Assigned Lawyer"
                  fieldKey="lawyer"
                  placeholder="Lawyer"
                  editable={canEditAssignedLawyer}
                  renderEdit={() => (
                    <View style={[styles.dropdownCompact, { zIndex: 2500 }]}>
                      <DropDownPicker
                        open={lawyerDropdownOpen}
                        value={editableCase.lawyerId ?? null}
                        items={lawyerItems}
                        setOpen={setLawyerDropdownOpen}
                        setValue={(callback) => {
                          setEditableCase((prev) => {
                            const current = prev.lawyerId ?? null;
                            const nextVal = typeof callback === 'function' ? callback(current) : callback;
                            const resolved = nextVal ?? null;
                            return {
                              ...prev,
                              lawyerId: resolved,
                              lawyer: resolved != null ? (userLookup[resolved] || prev.lawyer) : '',
                            };
                          });
                        }}
                        setItems={setLawyerItems}
                        placeholder="Select lawyer"
                        style={styles.dropdownInput}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        disabled={usersLoading || !canEditAssignedLawyer}
                        loading={usersLoading}
                        zIndex={2500}
                        zIndexInverse={900}
                      />
                    </View>
                  )}
                />

                {/* Date Filed (read-only, formatted) */}
                <Field label="Date Filed" fieldKey="dateFiled" placeholder="YYYY-MM-DD" editable={false} formatter={formatDateTime} />

                {/* Status (read-only) */}
                <View style={[styles.rowCompact, { marginTop: 6 }]}>
                  <Text style={styles.labelCompact}>Status</Text>
                  <Text style={[styles.valueCompact, { color: statusColor }]} numberOfLines={1}>{statusValueRaw}</Text>
                </View>

                {/* Payment (condensed) */}
                <View style={styles.paymentBox}>
                  <View style={styles.paymentMatrix}>
                    <View style={styles.paymentColumnLabels}>
                      <Text style={styles.payLabel}>Fee</Text>
                      <Text style={styles.payLabel}>Paid</Text>
                      <Text style={styles.payLabel}>Balance</Text>
                    </View>
                    <View style={styles.paymentColumnValues}>
                      <Text style={styles.payValue}>₱{totalFee.toFixed(2)}</Text>
                      <Text style={styles.payValue}>₱{totalPaid.toFixed(2)}</Text>
                      <Text
                        style={[
                          styles.payValue,
                          remaining === 0 ? styles.payValuePositive : styles.payValueNegative,
                        ]}
                      >
                        ₱{remaining.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowPayments(true)}>
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

                    const normalizeStatus = (s) => {
                      if (!s) return '—';
                      const v = String(s).toLowerCase();
                      if (v === 'todo') return 'to do';
                      if (v === 'in_progress') return 'in progress';
                      return s;
                    };

                    const resolveByLabel = (doc) => {
                      const isTask = String(doc.type || '').toLowerCase().includes('task');
                      return isTask ? 'Assigned by' : 'Submitted by';
                    };

                    const resolveByName = (doc) => {
                      const byId = String(String(doc.type || '').toLowerCase().includes('task') ? (doc.taskedById ?? doc.submittedById) : doc.submittedById || '');
                      if (!byId) return '—';
                      return userLookup[Number(byId)] || `User ${byId}`;
                    };

                    return (
                      <>
                        {visibleDocs.length === 0 ? (
                          <Text style={{ marginTop: 6, color: '#666' }}>No documents for this case.</Text>
                        ) : (
                          visibleDocs.map((doc, index) => (
                            <View key={index} style={styles.docRow}>
                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text style={[styles.docText, { fontWeight: '600' }]} numberOfLines={1}>
                                    {doc.name}
                                  </Text>
                                  <View style={[styles.chip, { backgroundColor: '#eef2ff' }]}>
                                    <Text style={[styles.chipText, { color: '#3730a3' }]}>{doc.type || 'Document'}</Text>
                                  </View>
                                </View>
                                <Text style={[styles.docText, { marginTop: 4, color: '#475467' }]} numberOfLines={2}>
                                  Status: {normalizeStatus(doc.status)}
                                  {doc.due ? `   •   Due: ${formatDateTime(doc.due)}` : ''}
                                  {`   •   ${resolveByLabel(doc)}: ${resolveByName(doc)}`}
                                </Text>
                              </View>
                              <Text style={styles.link} onPress={() => safeOpen(doc.link)}>Open</Text>
                            </View>
                          ))
                        )}
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

                {/* Case Actions (only when Processing) */}
                {String(editableCase?.status || '').toLowerCase() === 'processing' && (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleCaseAction('close')}
                      style={{ backgroundColor: '#16a34a', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                      accessibilityLabel="Close Case"
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Close Case</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCaseAction('dismiss')}
                      style={{ backgroundColor: '#4b5563', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                      accessibilityLabel="Dismiss Case"
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Dismiss Case</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Unarchive Action (only for Archived cases and Admin users) */}
                {String(user?.user_role || '').toLowerCase() === 'admin' && 
                 (String(editableCase?.status || '').toLowerCase() === 'archived' || 
                  String(editableCase?.rawStatus || '').toLowerCase().includes('archived')) && (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={handleUnarchive}
                      style={{ backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                      accessibilityLabel="Unarchive Case"
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Unarchive</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Archive Action (only for Completed or Dismissed cases and Admin users) */}
                {(() => {
                  const isAdmin = String(user?.user_role || '').toLowerCase() === 'admin';
                  const status = String(editableCase?.status || '').toLowerCase();
                  const rawStatus = String(editableCase?.rawStatus || '').toLowerCase();
                  const isCompleted = status === 'completed' || rawStatus === 'completed';
                  const isDismissed = status === 'dismissed' || rawStatus === 'dismissed';
                  const isNotArchived = !status.includes('archived') && !rawStatus.includes('archived');
                  
                  return isAdmin && (isCompleted || isDismissed) && isNotArchived && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                      <TouchableOpacity
                        onPress={handleArchive}
                        style={{ backgroundColor: '#f59e0b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                        accessibilityLabel="Archive Case"
                      >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Archive Case</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })()}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    {/* Payments Modal */}
    <PaymentsModal
      visible={showPayments}
      onClose={() => setShowPayments(false)}
      caseId={caseData?.id || caseData?.case_id}
      title={editableCase?.title}
    />
    </>
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
  lastUpdatedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  lastUpdatedLabel: { fontSize: 12, color: '#666', width: 120 },
  lastUpdatedValue: { fontSize: 12, color: '#1f2937', flex: 1, textAlign: 'right' },

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
  dropdownCompact: { flex: 1 },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    minHeight: 36,
    paddingHorizontal: 8,
  },
  dropdownList: {
    borderColor: '#ddd',
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
  paymentMatrix: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentColumnLabels: { flex: 1 },
  paymentColumnValues: { flex: 1, alignItems: 'flex-end' },
  payLabel: { fontSize: 12, color: '#666' },
  payValue: { fontSize: 14, fontWeight: '600', textAlign: 'right' },
  payValuePositive: { color: '#0c8744ff', fontWeight: '700' },
  payValueNegative: { color: '#b00020', fontWeight: '700' },
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
