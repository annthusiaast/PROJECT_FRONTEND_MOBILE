import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { User, Calendar } from "lucide-react-native";
// retain utility functions for priority & date formatting
import { getPriority, formatDueDate } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { getEndpoint } from "@/constants/api-config";
import TaskDetailsModal from "./task-details-modal";

// NOTE: We accept optional user prop (passed by parent) in case future role-based filtering is needed
const ActiveTask = ({ user }) => {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState([]); // backend fetched tasks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]); // for resolving assigner names
  // Fetch task documents for current user, then filter active on client
  const fetchPendingTasks = useCallback(async () => {
    if (!user?.user_id) return;
    setLoading(true);
    setError(null);
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

  useEffect(() => { fetchPendingTasks(); }, [fetchPendingTasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPendingTasks().finally(() => setRefreshing(false));
  }, [fetchPendingTasks]);

  const priorityColors = {
    all: "#000000",
    high: "#e63946",
    mid: "#f4a261",
    low: "#6c757d",
  };

  // Map backend field names to existing UI expectation
  const mapped = tasks.map(d => ({
    id: d.doc_id,
    title: d.doc_name || d.doc_task || 'Untitled Task',
    description: d.doc_description || d.doc_task || '',
    assignedTo: d.doc_tasked_to || 'Unassigned',
    dueDate: d.doc_due_date ? String(d.doc_due_date).split('T')[0] : null,
    status: (d.doc_status || '').toLowerCase(),
    assignedById: d.doc_tasked_by || d.doc_submitted_by || d.doc_created_by || null,
    raw: d,
  }));

  const viewerRole = String(user?.user_role || '').toLowerCase();
  // Fetch users list to resolve assigner name (same pattern as documents tab)
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

  const filteredTasks = mapped
    .filter(t => t.status !== 'done' && t.status !== 'completed')
    .filter((t) => {
      const priority = t.dueDate ? getPriority(t.dueDate) : 'low';
      return priorityFilter === 'all' || priorityFilter === priority;
    });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error && (
        <View style={{ padding: 10 }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

      {/* === PRIORITY FILTER BUTTONS === */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15, marginTop: 10 }}>
        {Object.keys(priorityColors).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityBtn,
              {
                borderColor: priorityColors[p],
                backgroundColor: priorityFilter === p ? priorityColors[p] : "transparent",
              },
            ]}
            onPress={() => setPriorityFilter(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.priorityBtnText, { color: priorityFilter === p ? "#fff" : "#000" }]}>
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === TASK CARDS OR "NO TASK" MESSAGE === */}
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text>Loading tasks...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No task found</Text>
        </View>
      ) : (
        filteredTasks.map((t) => {
          const priority = t.dueDate ? getPriority(t.dueDate) : 'low';
          return (
            <TouchableOpacity
              key={t.id}
              style={styles.taskCard}
              activeOpacity={0.9}
              onPress={() => setSelectedTask({
                ...t,
                assignedByName: getUserDisplayName(t.assignedById),
                assignedToName: t.assignedTo && t.assignedTo !== 'Unassigned' ? getUserDisplayName(t.assignedTo) : 'Unassigned',
              })}
            >
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] }]}>
                <Text style={styles.priorityBadgeText}>{priority.toUpperCase()}</Text>
              </View>
              <Text style={styles.taskCardTitle}>{t.title}</Text>
              <Text style={styles.taskCardDescription}>{t.description}</Text>
              {viewerRole !== 'staff' && viewerRole !== 'paralegal' && (
                <View style={styles.assignedUser}>
                  <User size={16} color="#333" style={{ marginRight: 5 }} />
                  <Text style={styles.assignedUserText}>Assigned to: {t.assignedTo && t.assignedTo !== 'Unassigned' ? getUserDisplayName(t.assignedTo) : 'Unassigned'}</Text>
                </View>
              )}
              {viewerRole !== 'lawyer' && viewerRole !== 'admin' && (
                <View style={styles.assignedUser}>
                  <User size={16} color="#333" style={{ marginRight: 5 }} />
                  <Text style={styles.assignedUserText}>Assigned by: {getUserDisplayName(t.assignedById)}</Text>
                </View>
              )}
              <View style={styles.dueDate}>
                <Calendar size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.dueDateText}>Due: {t.dueDate ? formatDueDate(t.dueDate) : 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
      <TaskDetailsModal
        visible={!!selectedTask}
        task={selectedTask}
        viewerRole={viewerRole}
        onClose={() => setSelectedTask(null)}
      />
    </ScrollView>
  );
};
export default ActiveTask;
