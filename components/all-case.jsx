import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { User } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const AllCase = ({ onCasePress, cases }) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const statusColors = {
    all: "#000000",
    pending: "#656162ff",
    processing: "#d5441bff",
    completed: "#0c8744ff",
  };

  const filteredCases = cases.filter(
    (t) => statusFilter === "all" || t.status === statusFilter
  );

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 10 }}>
        {/* Filter Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          {Object.keys(statusColors).map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.priorityBtn,
                {
                  borderColor: statusColors[s],
                  backgroundColor:
                    statusFilter === s ? statusColors[s] : "transparent",
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

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No case found.
          </Text>
        ) : (
          filteredCases.map((t) => {
            const status = t.status || "pending";
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => onCasePress(t)}
                activeOpacity={0.85}
              >
                <View style={styles.taskCard}>
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
                  <Text style={styles.taskCardTitle}>
                    {t.title || "Untitled Case"}
                  </Text>

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
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default AllCase;
