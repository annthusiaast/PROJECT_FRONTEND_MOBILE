import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User, Calendar } from "lucide-react-native";
import { task, getPriority, formatDueDate } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";

const ActiveTask = () => {
  const [priorityFilter, setPriorityFilter] = useState("all");

  const priorityColors = {
    all: "#000000",
    high: "#e63946",
    mid: "#f4a261",
    low: "#6c757d",
  };

  const filteredTasks = task.filter((t) => {
    const priority = getPriority(t.dueDate);
    return priorityFilter === "all" || priorityFilter === priority;
  });

  return (
    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >

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
      {filteredTasks.length === 0 ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 50 }}>
          <Text style={{ fontSize: 16, color: "#888" }}>No task found</Text>
        </View>
      ) : (
        filteredTasks.map((t) => {
          const priority = getPriority(t.dueDate);
          return (
            <View key={t.id} style={styles.taskCard}>
              {/* Priority Badge */}
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] }]}>
                <Text style={styles.priorityBadgeText}>{priority.toUpperCase()}</Text>
              </View>

              {/* Title */}
              <Text style={styles.taskCardTitle}>{t.title}</Text>

              {/* Description */}
              <Text style={styles.taskCardDescription}>{t.description}</Text>

              {/* Assigned User */}
              <View style={styles.assignedUser}>
                <User size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.assignedUserText}>{t.assignedTo}</Text>
              </View>

              {/* Due Date */}
              <View style={styles.dueDate}>
                <Calendar size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.dueDateText}>Due: {formatDueDate(t.dueDate)}</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default ActiveTask;
