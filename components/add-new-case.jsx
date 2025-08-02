import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { ChevronDown } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  findNodeHandle,
  InteractionManager,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

// Sample dropdown options
const clientOptions = ["Client A", "Client B", "Client C"];
const categoryOptions = [
  "Civil",
  "Criminal",
  "Constitutional",
  "Jurisdictional",
];
const offenseTypeOptions = [
  "Crimes Against Persons",
  "Crimes Against Property",
  "Crimes Against Public Interest",
];

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
  const [modalType, setModalType] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 20,
    right: 20,
  });

  const buttonRefs = {
    category: useRef(null),
    client: useRef(null),
    offense: useRef(null),
  };

  const measureDropdown = (type) => {
    const handle = findNodeHandle(buttonRefs[type].current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, _width, height, pageX, pageY) => {
        InteractionManager.runAfterInteractions(() => {
          setDropdownPos({ top: pageY + height, left: pageX, right: 20 });
          setModalType(type);
        });
      });
    }
  };

  const DropdownButton = ({ value, onPress, type, style }) => (
    <TouchableOpacity
      ref={buttonRefs[type]}
      style={[styles.dropdownPosition, style]}
      onPress={onPress}
    >
      <Text style={{ color: "#101111ff" }}>{value}</Text>
      <ChevronDown size={18} color="#114d89" />
    </TouchableOpacity>
  );

  const DropdownModal = ({ visible, options, onSelect }) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
        onPress={() => setModalType(null)}
      >
        <View
          style={[
            styles.dropdownModal,
            {
              top: dropdownPos.top,
              left: dropdownPos.left,
              right: dropdownPos.right,
              width: 200,
              zIndex: 9999,
            },
          ]}
        >
          {options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={{ padding: 12 }}
              onPress={() => {
                onSelect(opt);
                setModalType(null);
              }}
            >
              <Text style={{ fontSize: 16, color: "#114d89" }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, padding: 15 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabinet Number */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
          Cabinet Number
        </Text>
        <TextInput
          style={styles.TitlePlaceholder}
          placeholder="Enter cabinet number"
          value={cabinetNumber}
          onChangeText={setCabinetNumber}
        />

        {/* Case Name */}
        <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
          Case Name
        </Text>
        <TextInput
          style={styles.TitlePlaceholder}
          placeholder="Enter case name"
          value={caseName}
          onChangeText={setCaseName}
        />

        {/* Client */}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Client
        </Text>
        <DropdownButton
          value={client}
          onPress={() => measureDropdown("client")}
          type="client"
        />

        {/* Category & Offense Type */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
              Category
            </Text>
            <DropdownButton
              value={category}
              onPress={() => measureDropdown("category")}
              type="category"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
              Offense Type
            </Text>
            <DropdownButton
              value={offenseType}
              onPress={() => measureDropdown("offense")}
              type="offense"
            />
          </View>
        </View>

        {/* Branch */}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Branch
        </Text>
        <TextInput
          style={styles.TitlePlaceholder}
          placeholder="Enter branch"
          value={branch}
          onChangeText={setBranch}
        />

        {/* Filed Date & Fee */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
              Filed Date
            </Text>
            <TouchableOpacity
              style={styles.dueDateDropdown}
              onPress={() => setShowCalendar(true)}
            >
              <Text>{filedDate.toLocaleDateString()}</Text>
              <ChevronDown size={18} color="#114d89" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 5 }}>
              Fee
            </Text>
            <TextInput
              style={styles.TitlePlaceholder}
              placeholder="Enter fee"
              value={fee}
              onChangeText={setFee}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal visible={showCalendar} transparent animationType="slide">
          <Pressable
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => setShowCalendar(false)}
          >
            <View style={styles.calendarModal}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#114d89",
                  marginBottom: 10,
                }}
              >
                Select Filed Date
              </Text>
              <Calendar
                onDayPress={(day) => {
                  setFiledDate(new Date(day.dateString));
                  setShowCalendar(false);
                }}
                markedDates={{
                  [filedDate.toISOString().split("T")[0]]: {
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

        {/* Description */}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 15,
            marginBottom: 5,
          }}
        >
          Description
        </Text>
        <TextInput
          style={styles.DescriptionPlaceholder}
          placeholder="Enter case description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.taskCreatedBtn}
          onPress={() => alert("Case Created!")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Create Case
          </Text>
        </TouchableOpacity>

        {/* Dropdown Modals */}
        <DropdownModal
          visible={modalType === "client"}
          options={clientOptions}
          onSelect={setClient}
        />
        <DropdownModal
          visible={modalType === "category"}
          options={categoryOptions}
          onSelect={setCategory}
        />
        <DropdownModal
          visible={modalType === "offense"}
          options={offenseTypeOptions}
          onSelect={setOffenseType}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewCase;
