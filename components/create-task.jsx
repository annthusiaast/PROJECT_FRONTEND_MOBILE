import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  findNodeHandle,
  UIManager,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ChevronDown } from "lucide-react-native";
// We will fetch real cases and users from backend instead of static sample data.
import { sampleCases, teamMembers } from "@/constants/sample_data"; // fallback if API fails
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { getEndpoint } from "@/constants/api-config";

// Helper to format date to YYYY-MM-DD for backend
const toISODate = (d) => d.toISOString().split('T')[0];

const CreateTask = ({ user }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedCase, setRelatedCase] = useState("Select Case");
  const [assignee, setAssignee] = useState("Select Team Member");
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 20, right: 20 });
  // Dynamic data
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const buttonRefs = {
    case: useRef(null),
    assignee: useRef(null),
  };

  // Fetch cases & users to populate dropdowns (mirrors pattern in other components like view-clients)
  const fetchMeta = useCallback(async () => {
    setLoadingMeta(true); setError(null);
    try {
      const [caseRes, userRes] = await Promise.all([
        fetch(getEndpoint('/cases'), { credentials: 'include' }),
        fetch(getEndpoint('/users'), { credentials: 'include' })
      ]);
      if (!caseRes.ok || !userRes.ok) throw new Error('Failed to load references');
      const [caseData, userData] = await Promise.all([caseRes.json(), userRes.json()]);
      setCases(Array.isArray(caseData) ? caseData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (e) {
      // fallback to sample arrays
      setCases(sampleCases.map((c, idx) => ({ case_id: idx + 1, label: c })));
      setUsers(teamMembers.map((m, idx) => ({ user_id: idx + 1, full_name: m.name, user_role: m.role })));
      setError(e.message);
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  // Build display values for dropdowns from fetched data
  const caseOptions = cases.length
    ? cases.map(c => c.case_id ? { key: c.case_id, label: c.case_title || c.ct_name || c.label || `Case #${c.case_id}` } : { key: c.key, label: c.label })
    : sampleCases.map((c, i) => ({ key: i + 1, label: c }));

  const userOptions = users.length
    ? users.map(u => ({ key: u.user_id, label: `${u.user_fname ? u.user_fname : ''} ${u.user_lname ? u.user_lname : ''}`.trim() || u.full_name || 'User', role: u.user_role || u.role || '' }))
    : teamMembers.map((m, i) => ({ key: i + 1, label: m.name, role: m.role }));

  // Resolve selected IDs based on label stored
  const selectedCaseObj = caseOptions.find(o => o.label === relatedCase);
  const selectedUserObj = userOptions.find(o => o.label === assignee);

  /** === MEASURE DROPDOWN POSITION === */
  const measureDropdown = (type) => {
    const handle = findNodeHandle(buttonRefs[type].current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setDropdownPos({ top: pageY + height, left: pageX, right: 20 });
        setModalType(type);
      });
    }
  };

  /** === DROPDOWN BUTTON COMPONENT === */
  const DropdownButton = ({ value, onPress, type }) => (
    <TouchableOpacity
      ref={buttonRefs[type]}
      style={styles.dropdownPosition}
      onPress={onPress}
    >
      <Text style={{ color: "#101111ff" }}>{value}</Text>
      <ChevronDown size={18} color="#114d89" />
    </TouchableOpacity>
  );

  /** === GENERIC DROPDOWN MODAL === */
  const DropdownModal = ({ visible, options, onSelect, isAssignee }) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
        onPress={() => setModalType(null)}
      >
        <View
          style={[
            styles.dropdownModal,
            { top: dropdownPos.top, left: dropdownPos.left, right: dropdownPos.right, width: 200 },
          ]}
        >
          {options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={{ padding: 12, flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => {
                onSelect(isAssignee ? opt.label : opt.label || opt);
                setModalType(null);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{opt.label || opt}</Text>
              {isAssignee && <Text style={{ fontSize: 14, color: "#666" }}>{opt.role}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  // Form submit -> POST /tasks (mirrors fetch pattern used elsewhere with credentials included)
  const handleCreateTask = async () => {
    setSuccess(null); setError(null);
    // Minimal validation
    if (!taskTitle.trim()) { setError('Task title required'); return; }
    if (!selectedCaseObj) { setError('Select a related case'); return; }
    if (!selectedUserObj) { setError('Select an assignee'); return; }

    const payload = {
      td_case_id: selectedCaseObj.key,
      td_name: taskTitle.trim(),
      td_description: description.trim(),
      td_due_date: toISODate(dueDate),
      td_priority: null, // priority can be computed client-side; placeholder
      td_doc_path: null,
      td_to: selectedUserObj.label,
      td_by: user ? user.user_id : null,
      td_status: 'Pending',
      td_date_completed: null
    };

    try {
      setSubmitting(true);
      const res = await fetch(getEndpoint('/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create task');
      const data = await res.json();
      setSuccess('Task created successfully');
      // Reset form
      setTaskTitle('');
      setDescription('');
      setRelatedCase('Select Case');
      setAssignee('Select Team Member');
      setDueDate(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canCreate = user && ['Admin','Lawyer'].includes(user.user_role);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1, padding: 15 }} keyboardShouldPersistTaps="handled">

        {!canCreate && (
          <View style={{ padding: 16, backgroundColor: '#ffe8e8', borderRadius: 8, marginBottom: 20 }}>
            <Text style={{ color: '#b00020', fontWeight: '600' }}>
              You don\'t have permission to create tasks. (Allowed: Admin, Lawyer)
            </Text>
          </View>
        )}

        {canCreate && (
        <>

        {/* === TASK TITLE === */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Task Title</Text>
        <TextInput
          style={styles.TitlePlaceholder}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        {/* === DESCRIPTION === */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Description</Text>
        <TextInput
          style={styles.DescriptionPlaceholder}
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* === RELATED CASE + DUE DATE === */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Related Case</Text>
      <DropdownButton value={relatedCase} onPress={() => measureDropdown("case")} type="case" />
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Due Date</Text>
            <TouchableOpacity style={styles.dueDateDropdown} onPress={() => setShowCalendar(true)}>
              <Text>{dueDate.toLocaleDateString()}</Text>
              <ChevronDown size={18} color="#114d89" />
            </TouchableOpacity>
          </View>
        </View>

        {/* === CALENDAR MODAL === */}
        <Modal visible={showCalendar} transparent animationType="slide">
          <Pressable
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => setShowCalendar(false)}
          >
            <View style={styles.calendarModal}>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#114d89", marginBottom: 10 }}>
                Select Due Date
              </Text>
              <Calendar
                onDayPress={(day) => {
                  setDueDate(new Date(day.dateString));
                  setShowCalendar(false);
                }}
                markedDates={{
                  [dueDate.toISOString().split("T")[0]]: {
                    selected: true,
                    marked: true,
                    selectedColor: "#114d89",
                  },
                }}
                theme={{
                  todayTextColor: "#114d89",
                  arrowColor: "#114d89",
                  selectedDayBackgroundColor: "#114d89",
                  textDayFontWeight: "500",
                }}
              />
            </View>
          </Pressable>
        </Modal>

        {/* === ASSIGNEE === */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Assign To</Text>
  <DropdownButton value={assignee} onPress={() => measureDropdown("assignee")} type="assignee" />

  {loadingMeta && <Text style={{ marginTop: 10, color: '#666' }}>Loading reference data...</Text>}
  {error && <Text style={{ marginTop: 10, color: 'red' }}>{error}</Text>}
  {success && <Text style={{ marginTop: 10, color: 'green' }}>{success}</Text>}

        {/* === SUBMIT BUTTON === */}
        <TouchableOpacity style={[styles.taskCreatedBtn, submitting && { opacity: 0.7 }]} disabled={submitting} onPress={handleCreateTask}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{submitting ? 'Creating...' : 'Create Task'}</Text>
        </TouchableOpacity>

  {/* === DROPDOWN MODALS === */}
  <DropdownModal visible={modalType === "case"} options={caseOptions} onSelect={setRelatedCase} />
  <DropdownModal visible={modalType === "assignee"} options={userOptions} onSelect={setAssignee} isAssignee />
  </>
  )}

  </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTask;
