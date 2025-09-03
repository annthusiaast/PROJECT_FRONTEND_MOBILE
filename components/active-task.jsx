import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { User, Calendar } from "lucide-react-native";
// retain utility functions for priority & date formatting
import { getPriority, formatDueDate } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { getEndpoint } from "@/constants/api-config";

// NOTE: We accept optional user prop (passed by parent) in case future role-based filtering is needed
const ActiveTask = ({ user }) => {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState([]); // backend fetched tasks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  // Fetch pending tasks from backend (td_status null or not Completed)
  const fetchPendingTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getEndpoint('/tasks/pending'), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch pending tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
  const mapped = tasks.map(t => ({
    id: t.td_id,
    title: t.td_name,
    description: t.td_description,
    assignedTo: t.td_to || 'Unassigned',
    dueDate: t.td_due_date ? t.td_due_date.split('T')[0] : null,
    status: t.td_status
  }));

  const filteredTasks = mapped.filter((t) => {
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
            <View key={t.id} style={styles.taskCard}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] }]}>
                <Text style={styles.priorityBadgeText}>{priority.toUpperCase()}</Text>
              </View>
              <Text style={styles.taskCardTitle}>{t.title}</Text>
              <Text style={styles.taskCardDescription}>{t.description}</Text>
              <View style={styles.assignedUser}>
                <User size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.assignedUserText}>{t.assignedTo}</Text>
              </View>
              <View style={styles.dueDate}>
                <Calendar size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.dueDateText}>Due: {t.dueDate ? formatDueDate(t.dueDate) : 'N/A'}</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};
export default ActiveTask;
