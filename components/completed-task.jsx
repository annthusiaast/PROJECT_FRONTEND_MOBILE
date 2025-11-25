import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  findNodeHandle,
  UIManager,
} from "react-native";
import { User, Calendar, ChevronDown } from "lucide-react-native";
import { FILTER_OPTIONS } from "@/constants/sample_data"; // retain filter options only
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { getEndpoint } from "@/constants/api-config";
import TaskDetailsModal from "./task-details-modal";

const CompletedTask = ({ user }) => {
  const [filter, setFilter] = useState(7); // default range days
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const buttonRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchCompleted = useCallback(async () => {
    if (!user?.user_id) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(getEndpoint(`/documents/task/user/${user.user_id}`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => { fetchCompleted(); }, [fetchCompleted]);

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

  const getUserDisplayName = (userId) => {
    if (!userId) return 'Unknown';
    const u = users.find(x => String(x.user_id) === String(userId));
    if (!u) return `User ${userId}`;
    const middle = u.user_mname ? `${u.user_mname[0]}.` : '';
    const name = `${u.user_fname || ''} ${middle} ${u.user_lname || ''}`.replace(/\s+/g, ' ').trim();
    return (u.user_role === 'Staff' || u.user_role === 'Paralegal') ? name : `Atty. ${name}`;
  };

  const viewerRole = String(user?.user_role || '').toLowerCase();

  const filterTasks = () => {
    const today = new Date();
    return tasks
      .filter(d => (d.doc_status || '').toLowerCase() === 'done' || (d.doc_status || '').toLowerCase() === 'completed')
      .filter(d => {
        const raw = d.doc_due_date || d.td_date_completed || d.updated_at;
        if (!raw) return false;
        const base = String(raw).split('T')[0];
        const taskDate = new Date(`${base}T00:00:00`);
        const diffDays = (today.setHours(0,0,0,0) - taskDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= filter;
      })
      .map(d => ({
        id: d.doc_id,
        title: d.doc_name || d.doc_task || 'Untitled Task',
        description: d.doc_description || d.doc_task || '',
        completedDate: (d.doc_due_date || d.td_date_completed || '').split('T')[0] || null,
        staff: d.doc_tasked_to || 'Unknown',
        status: (d.doc_status || '').toLowerCase(),
        dueDate: d.doc_due_date ? String(d.doc_due_date).split('T')[0] : null,
        assignedTo: d.doc_tasked_to || 'Unknown',
        assignedById: d.doc_tasked_by || d.doc_submitted_by || d.doc_created_by || null,
        raw: d,
      }));
  };

  const openDropdown = () => {
    const handle = findNodeHandle(buttonRef.current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, _width, height, _pageX, pageY) => {
        setDropdownTop(pageY + height + 5);
        setModalVisible(true);
      });
    }
  };

  const renderTaskCard = ({ item }) => (
    <TouchableOpacity
      style={styles.renderTaskCard}
      activeOpacity={0.9}
      onPress={() => setSelectedTask({
        ...item,
        assignedByName: getUserDisplayName(item.assignedById),
        assignedToName: item.assignedTo && item.assignedTo !== 'Unknown' ? getUserDisplayName(item.assignedTo) : 'Unknown',
      })}
    >
      <View style={styles.completedTexButton}>
        <Text style={styles.priorityBadgeText}>Completed</Text>
      </View>
      <Text style={styles.taskCardTitle}>{item.title || 'Untitled Task'}</Text>
      <Text style={styles.taskCardDescription}>{item.description || 'No description available.'}</Text>
      {viewerRole !== 'staff' && viewerRole !== 'paralegal' && (
        <View style={styles.assignedUser}>
          <User size={16} color="#1b4332" style={{ marginRight: 5 }} />
          <Text>Assigned to: {item.assignedTo && item.assignedTo !== 'Unknown' ? getUserDisplayName(item.assignedTo) : 'Unknown'}</Text>
        </View>
      )}
      {viewerRole !== 'lawyer' && viewerRole !== 'admin' && (
        <View style={styles.assignedUser}>
          <User size={16} color="#1b4332" style={{ marginRight: 5 }} />
          <Text>Assigned by: {getUserDisplayName(item.assignedById)}</Text>
        </View>
      )}
      <View style={styles.dueDate}>
        <Calendar size={16} color="#114d89" style={{ marginRight: 5 }} />
        <Text style={styles.dueDateText}>Completed on: {item.completedDate || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.dropdownBox}>
        <TouchableOpacity ref={buttonRef} style={styles.dropdownBoxOption} onPress={openDropdown}>
          <Text style={styles.dropdownBoxOptionText}>{FILTER_OPTIONS.find(opt => opt.value === filter)?.label || 'Filter'}</Text>
          <ChevronDown size={18} color="#114d89" />
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setModalVisible(false)}>
          <View style={[styles.dropdownModalPosition, { top: dropdownTop }]}>
            {FILTER_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={{ padding: 12 }}
                onPress={() => {
                  setFilter(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={{ fontSize: 16, color: filter === option.value ? '#114d89' : '#000' }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );

  const filtered = filterTasks();

  return (
    <>
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text>}
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskCard}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>No tasks found for this date range.</Text>}
        />
      )}
      <TaskDetailsModal
        visible={!!selectedTask}
        task={selectedTask}
        viewerRole={viewerRole}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};

export default CompletedTask;
