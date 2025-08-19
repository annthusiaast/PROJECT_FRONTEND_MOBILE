import { Tabs, useSegments, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClipboardList, FileText, Home, Scale, User, Bell } from "lucide-react-native";
import { View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/protected-route";

function CustomHeader({ title }) {
  const router = useRouter();
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    setToday(date.toLocaleDateString("en-US", options));
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#fff"
      />
      <View
        style={{
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
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Bell size={26} color="#0B3D91" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  const segments = useSegments().filter((seg) => seg !== "(tabs)");
  const currentTab = segments[segments.length - 1] || "home";

  return (
    <ProtectedRoute>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <CustomHeader
            title={currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
          />

          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#0B3D91",
              tabBarInactiveTintColor: "#666",
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "500",
                marginTop: 2,
              },
              tabBarStyle: {
                backgroundColor: "#fff",
                height: Platform.OS === "ios" ? 90 : 70,
                paddingBottom: Platform.OS === "ios" ? 20 : 12,
                paddingTop: 6,
                borderTopWidth: 0.5,
                borderTopColor: "#ddd",
              },
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => <Home color={color} size={26} />,
              }}
            />
            <Tabs.Screen
              name="tasks"
              options={{
                title: "Tasks",
                tabBarIcon: ({ color }) => <ClipboardList color={color} size={26} />,
              }}
            />
            <Tabs.Screen
              name="cases"
              options={{
                title: "Cases",
                tabBarIcon: ({ color }) => <Scale color={color} size={26} />,
              }}
            />
            <Tabs.Screen
              name="documents"
              options={{
                title: "Documents",
                tabBarIcon: ({ color }) => <FileText color={color} size={26} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color }) => <User color={color} size={26} />,
              }}
            />
          </Tabs>
        </View>
      </GestureHandlerRootView>
    </ProtectedRoute>
  );
}
