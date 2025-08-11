import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

// Sample dropdown options
const clientOptions = ["Client A", "Client B", "Client C"];
const categoryOptions = ["Civil", "Criminal", "Constitutional", "Jurisdictional"];
const offenseTypeOptions = [
  "Crimes Against Persons",
  "Crimes Against Property",
  "Crimes Against Public Interest",
];

//  Reusable Dropdown (like Documents)
const Dropdown = ({ options, value, onSelect, width = "100%", topOffset = 40 }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ width, position: "relative" }}>
      {/* Button */}
      <TouchableOpacity
        style={[styles.dropdownPosition, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#101111ff" }}>{value}</Text>
        <ChevronDown size={18} color="#114d89" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {open && (
        <View
          style={{
            position: "absolute",
            top: topOffset,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            elevation: 4,
            zIndex: 9999,
          }}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={{ padding: 12 }}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const AddNewCase = () => {
  const [cabinetNumber, setCabinetNumber] = useState("");
  const [caseName, setCaseName] = useState("");
  const [category, setCategory] = useState("Select category");
  const [offenseType, setOffenseType] = useState("Select offense type");
  const [client, setClient] = useState("Select a client");
  const [branch, setBranch] = useState("");
  const [filedDate, setFiledDate] = useState(new Date());
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{ flex: 1, padding: 15 }} keyboardShouldPersistTaps="handled">
          
          {/* Cabinet Number */}
          <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Cabinet Number</Text>
          <TextInput
            style={styles.TitlePlaceholder}
            placeholder="Enter cabinet number"
            placeholderTextColor="#0b0c0cff"
            value={cabinetNumber}
            onChangeText={setCabinetNumber}
          />

          {/* Case Name */}
          <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Case Name</Text>
          <TextInput
            style={styles.TitlePlaceholder}
            placeholder="Enter case name"
            placeholderTextColor="#0b0c0cff"
            value={caseName}
            onChangeText={setCaseName}
          />

          {/* Client Dropdown */}
          <Text style={{ fontWeight: "bold", fontSize: 14, marginTop: 10, marginBottom: 5 }}>Client</Text>
          <Dropdown options={clientOptions} value={client} onSelect={setClient} />

          {/* Category & Offense Type */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Category</Text>
              <Dropdown options={categoryOptions} value={category} onSelect={setCategory} />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Offense Type</Text>
              <Dropdown options={offenseTypeOptions} value={offenseType} onSelect={setOffenseType} />
            </View>
          </View>

          {/* Branch */}
          <Text style={{ fontWeight: "bold", fontSize: 14, marginTop: 10, marginBottom: 5 }}>Branch</Text>
          <TextInput
            style={styles.TitlePlaceholder}
            placeholder="Enter branch"
            placeholderTextColor="#0b0c0cff"
            value={branch}
            onChangeText={setBranch}
          />

          {/* Filed Date & Fee */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Filed Date</Text>
              <TouchableOpacity style={styles.dueDateDropdown} onPress={() => setShowCalendar(true)}>
                <Text>{filedDate.toLocaleDateString()}</Text>
                <ChevronDown size={18} color="#114d89" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>Fee</Text>
              <TextInput
                style={styles.FeePlaceholder}
                placeholder="Enter fee"
                placeholderTextColor="#0b0c0cff"
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Calendar (Optional) */}
          {showCalendar && (
            <View style={styles.calendarModal}>
              <Calendar
                onDayPress={(day) => {
                  setFiledDate(new Date(day.dateString));
                  setShowCalendar(false);
                }}
                markedDates={{
                  [filedDate.toISOString().split("T")[0]]: { selected: true, marked: true, selectedColor: "#114d89" },
                }}
                theme={{
                  todayTextColor: "#114d89",
                  arrowColor: "#114d89",
                  selectedDayBackgroundColor: "#114d89",
                  textDayFontWeight: "500",
                }}
              />
            </View>
          )}

          {/* Description */}
          <Text style={{ fontWeight: "bold", fontSize: 14, marginTop: 15, marginBottom: 5 }}>Description</Text>
          <TextInput
            style={styles.DescriptionPlaceholder}
            placeholder="Enter case description"
            placeholderTextColor="#0b0c0cff"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.taskCreatedBtn} onPress={() => alert("Case Created!")}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Create Case</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddNewCase;
