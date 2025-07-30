import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, KeyboardAvoidingView, Platform, findNodeHandle, UIManager, } from "react-native";
import { Calendar } from "react-native-calendars";
import { ChevronDown } from "lucide-react-native";
import { sampleCases, teamMembers } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedCase, setRelatedCase] = useState("Select Case");
  const [assignee, setAssignee] = useState("Select Team Member");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalType, setModalType] = useState<"case" | "assignee" | "priority" | null>(null);

 
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 20, right: 20 });

  const buttonRefs: any = {
    case: useRef(null),
    assignee: useRef(null),
    priority: useRef(null),
  };

  const measureDropdown = (type: "case" | "assignee" | "priority") => {
    const handle = findNodeHandle(buttonRefs[type].current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {

        // Set top and left only (keep right fixed as default)
        setDropdownPos({ top: pageY + height, left: pageX, right: 20 });
        setModalType(type);
      });
    }
  };

  const DropdownButton = ({ value, onPress, type, style }: any) => (
    <TouchableOpacity
      ref={buttonRefs[type]}
      style={[styles.dropdownPosition, style]}
      onPress={onPress}
    >
      <Text style={{ color: "#101111ff" }}>{value}</Text>
      <ChevronDown size={18} color="#114d89" />
    </TouchableOpacity>
  );

  const DropdownModal = ({ visible, options, onSelect, isAssignee = false }: any) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} onPress={() => setModalType(null)}>
        <View
          style={[
            styles.dropdownModal,
            {
              top: dropdownPos.top, left: dropdownPos.left, right: dropdownPos.right, width: 200, 
            },
          ]}
        >
          {options.map((opt: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={{ padding: 12, flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => {
                onSelect(isAssignee ? opt.name : opt);
                setModalType(null);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{isAssignee ? opt.name : opt}</Text>
              {isAssignee && <Text style={{ fontSize: 14, color: "#666" }}>{opt.role}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={{ flex: 1, padding: 15 }} keyboardShouldPersistTaps="handled">
        {/* Task Title */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Task Title</Text>
        <TextInput
          style={styles.TitlePlaceholder}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        {/* Description */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Description</Text>
        <TextInput
          style={styles.DescriptionPlaceholder}
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Related Case & Due Date */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Related Case</Text>
            <DropdownButton value={relatedCase} onPress={() => measureDropdown("case")} type="case" />
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Due Date</Text>
            <TouchableOpacity
              style={styles.dueDateDropdown}
              onPress={() => setShowCalendar(true)}
            >
              <Text>{dueDate.toLocaleDateString()}</Text>
              <ChevronDown size={18} color="#114d89" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal visible={showCalendar} transparent animationType="slide">
          <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={() => setShowCalendar(false)}>
            <View
              style={styles.calendarModal}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#114d89", marginBottom: 10 }}>Select Due Date</Text>
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

        {/* Assign To */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Assign To</Text>
        <DropdownButton value={assignee} onPress={() => measureDropdown("assignee")} type="assignee" />

        {/* Submit */}
        <TouchableOpacity
          style={styles.taskCreatedBtn}
          onPress={() => alert("Task Created!")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Create Task</Text>
        </TouchableOpacity>

        {/* Dropdown Modals */}
        <DropdownModal visible={modalType === "case"} options={sampleCases} onSelect={setRelatedCase} />
        <DropdownModal visible={modalType === "assignee"} options={teamMembers} onSelect={setAssignee} isAssignee />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTask;
