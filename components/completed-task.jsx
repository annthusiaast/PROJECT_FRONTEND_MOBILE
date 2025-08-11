import React, { useState, useRef } from "react";
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
import { FILTER_OPTIONS, completedTasks } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";

const CompletedTask = () => {
  const [filter, setFilter] = useState(7); // default filter: last 7 days
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const buttonRef = useRef(null);

  /** === FILTER COMPLETED TASKS BASED ON SELECTED RANGE === */
  const filterTasks = () => {
    const today = new Date();
    return completedTasks.filter((task) => {
      if (!task.completedDate) return false;
      const taskDate = new Date(`${task.completedDate}T00:00:00`);

      const diffDays =
        (today.setHours(0, 0, 0, 0) - taskDate.getTime()) /
        (1000 * 3600 * 24);

      return diffDays >= 0 && diffDays <= filter;
    });
  };

  /** === OPEN DROPDOWN BELOW FILTER BUTTON === */
  const openDropdown = () => {
    const handle = findNodeHandle(buttonRef.current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, _width, height, _pageX, pageY) => {
        setDropdownTop(pageY + height + 5);
        setModalVisible(true);
      });
    }
  };

  /** === RENDER INDIVIDUAL TASK CARD === */
  const renderTaskCard = ({ item }) => (
    <View style={styles.renderTaskCard}>
      <View style={styles.completedTexButton}>
        <Text style={styles.priorityBadgeText}>Completed</Text>
      </View>

      <Text style={styles.taskCardTitle}>{item.title || "Untitled Task"}</Text>
      <Text style={styles.taskCardDescription}>
        {item.description || "No description available."}
      </Text>

      <View style={styles.assignedUser}>
        <User size={16} color="#1b4332" style={{ marginRight: 5 }} />
        <Text>Assigned to: {item.staff || "Unknown"}</Text>
      </View>

      <View style={styles.dueDate}>
        <Calendar size={16} color="#114d89" style={{ marginRight: 5 }} />
        <Text style={styles.dueDateText}>
          Completed on: {item.completedDate || "N/A"}
        </Text>
      </View>
    </View>
  );

  /** === HEADER CONTAINING DROPDOWN === */
  const renderHeader = () => (
    <>
      <View style={styles.dropdownBox}>
        <TouchableOpacity
          ref={buttonRef}
          style={styles.dropdownBoxOption}
          onPress={openDropdown}
        >
          <Text style={styles.dropdownBoxOptionText}>
            {FILTER_OPTIONS.find((opt) => opt.value === filter)?.label ||
              "Filter"}
          </Text>
          <ChevronDown size={18} color="#114d89" />
        </TouchableOpacity>
      </View>

      {/* === FILTER DROPDOWN MODAL === */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.dropdownModalPosition, { top: dropdownTop }]}>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{ padding: 12 }}
                onPress={() => {
                  setFilter(option.value);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: filter === option.value ? "#114d89" : "#000",
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );

  return (
    <FlatList
      data={filterTasks()}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTaskCard}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
          No tasks found for this date range.
        </Text>
      }
    />
  );
};

export default CompletedTask;
