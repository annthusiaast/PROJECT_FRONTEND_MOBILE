import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User, Calendar } from "lucide-react-native";
import { task, getPriority, formatDueDate } from "@/constants/sample_data";
import { styles  }  from "@/constants/styles/(tabs)/tasksBtn_styles";

type Priority = "all" | "high" | "medium" | "low";

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string; 
}

const ActiveTask = () => {
  const [priorityFilter, setPriorityFilter] = useState<Priority>("all");

  const priorityColors: Record<Priority, string> = {
    all: "#000000",
    high: "#e63946",   
    medium: "#f4a261", 
    low: "#6c757d",  
  };

  // Apply filter 
  const filteredTasks = task.filter(task => {
    const priority = getPriority(task.dueDate);
    return priorityFilter === "all" || priorityFilter === priority;
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      
      {/* === PRIORITY FILTER BUTTONS === */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        {(Object.keys(priorityColors) as Array<Priority>).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityBtn, { borderColor: priorityColors[p], backgroundColor: priorityFilter === p ? priorityColors[p] : "transparent", }]}
            onPress={() => setPriorityFilter(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.priorityBtnText, {color: priorityFilter === p ? "#fff" : "#000",}]}>
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === TASK CARDS === */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTasks.map((task) => {
          const priority = getPriority(task.dueDate);
          return (
            <View
              key={task.id}
              style={styles.taskCard}
            >
              {/* Priority Badge (Top Right) */}
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority],}]}>
                <Text style={styles.priorityBadgeText}>
                  {priority.toUpperCase()}
                </Text>
              </View>

              {/* Title */}
              <Text style={styles.taskCardTitle}>{task.title}</Text>

              {/* Description */}
              <Text style={styles.taskCardDescription}> {task.description} </Text>

              {/* Assigned User */}
              <View style={styles.assignedUser}>
                <User size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.assignedUserText}>{task.assignedTo}</Text>
              </View>

              {/* Due Date */}
              <View style={styles.dueDate}>
                <Calendar size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.dueDateText}>Due: {formatDueDate(task.dueDate)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

    </View>
  );
};

export default ActiveTask;
