import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User, Calendar } from "lucide-react-native";
import { getPriority, formatDueDate, task as rawTask } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";

type Priority = "all" | "pending" | "processing" | "completed";

type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status?: Priority; 
};

const task: Task[] = rawTask as Task[];

const AllCase = () => {
  const [priorityFilter, setPriorityFilter] = useState<Priority>("all");

  const priorityColors: Record<Priority, string> = {
    all: "#000000",
    pending: "#656162ff",
    processing: "#d5441bff",
    completed: "#0c8744ff",
  };

  //Filter Tasks safely
  const filteredTasks = task.filter(
    (t) => priorityFilter === "all" || t.status === priorityFilter
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      
      {/* === FILTER BUTTONS === */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        {(Object.keys(priorityColors) as Array<Priority>).map((p) => (
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
            <Text
              style={[
                styles.priorityBtnText,
                { color: priorityFilter === p ? "#fff" : "#000" },
              ]}
            >
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === TASK LIST === */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No case found.
          </Text>
        ) : (
          filteredTasks.map((t) => {
            //  Safely handle missing status
            const priority: Priority = t.status || "pending";

            return (
              <View key={t.id} style={styles.taskCard}>
                
                {/* Priority Badge */}
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: priorityColors[priority] || "#000" },
                  ]}
                >
                  <Text style={styles.priorityBadgeText}>
                    {(priority || "pending").toUpperCase()}
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
