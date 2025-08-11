import { Tabs, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClipboardList, FileText, Home, Scale, User, Bell } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

function CustomHeader({ title }) {
  const router = useRouter();
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    setToday(date.toLocaleDateString("en-US", options));
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 40, // status bar space
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* date + title */}
      <View>
        <Text style={{ fontSize: 10, color: "#666" }}>{today}</Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#0B3D91" }}>
          {title}
        </Text>
      </View>

      {/* bell */}
      <TouchableOpacity onPress={() => router.push("/Notifications")}>
        <Bell size={26} color="#0B3D91" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          header: ({ route }) => (
            <CustomHeader title={route.name === "Home" ? "Home" : route.name} />
          ),
          tabBarActiveTintColor: "#1111e0ff",
          tabBarInactiveTintColor: "#0b0b68ff",
          tabBarStyle: {
            backgroundColor: "#f8f8fbff",
            height: 100,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color }) => <Home color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color }) => <ClipboardList color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="cases"
          options={{
            title: "Cases",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color }) => <Scale color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="documents"
          options={{
            title: "Documents",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color }) => <FileText color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color }) => <User color={color} size={28} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
