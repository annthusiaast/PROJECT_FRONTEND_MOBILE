import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User } from "lucide-react-native";
import { task as rawTask } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";

const task = rawTask;

const AllCase = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const statusColors = {
    all: "#000000",
    pending: "#656162ff",
    processing: "#d5441bff",
    completed: "#0c8744ff",
  };

  // ✅ Filtering works exactly like in ActiveTask
  const filteredTasks = task.filter((t) => {
    const status = t.status || "pending";
    return statusFilter === "all" || statusFilter === status;
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* === STATUS FILTER BUTTONS === */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        {Object.keys(statusColors).map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.priorityBtn,
              {
                borderColor: statusColors[s],
                backgroundColor: statusFilter === s ? statusColors[s] : "transparent",
              },
            ]}
            onPress={() => setStatusFilter(s)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.priorityBtnText,
                { color: statusFilter === s ? "#fff" : "#000" },
              ]}
            >
              {s.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === CASE CARDS === */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No case found.
          </Text>
        ) : (
          filteredTasks.map((t) => {
            const status = t.status || "pending";

            return (
              <View key={t.id} style={styles.taskCard}>
                {/* Status Badge */}
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: statusColors[status] || "#000" },
                  ]}
                >
                  <Text style={styles.priorityBadgeText}>
                    {status.toUpperCase()}
                  </Text>
                </View>

                {/* Title */}
                <Text style={styles.taskCardTitle}>{t.title || "Untitled Case"}</Text>

                {/* Description */}
                <Text style={styles.taskCardDescription}>
                  {t.description || "No description provided."}
                </Text>

                {/* Assigned User */}
                <View style={styles.assignedUser}>
                  <User size={16} color="#333" style={{ marginRight: 5 }} />
                  <Text style={styles.assignedUserText}>
                    {t.assignedTo || "Unassigned"}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default AllCase;
