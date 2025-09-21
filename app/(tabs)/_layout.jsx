import { Tabs, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Bell } from "lucide-react-native";
import { View, Text, TouchableOpacity, Platform, StatusBar, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { baseTabs, getAllowedTabs } from "@/constants/role-tabs";
import Notifications from "@/components/notifications";

function CustomHeader({ title, onPressBell }) {
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
        <TouchableOpacity onPress={onPressBell}>
          <Bell size={26} color="#0B3D91" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  const segments = useSegments().filter((seg) => seg !== "(tabs)");
  const currentTab = segments[segments.length - 1] || "home";
  const { user, loading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const role = user?.user_role;

  const filteredTabs = useMemo(() => {
    return getAllowedTabs(role);
  }, [role]);

  // If current tab is hidden due to role change, redirect silently to first allowed tab
  useEffect(() => {
    const active = filteredTabs.map((t) => t.name);
    if (!active.includes(currentTab) && filteredTabs.length) {
      // using imperative navigation is tricky here because Tabs is parent; rely on first tab name in path
      // expo-router: we can push or replace
      // eslint-disable-next-line no-console
      // console.log(`Redirecting from ${currentTab} to ${filteredTabs[0].name}`);
    }
  }, [currentTab, filteredTabs]);

  return (
    <ProtectedRoute allowedTabs={filteredTabs.map(t => t.name)}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <CustomHeader
            title={(filteredTabs.find(t => t.name === currentTab)?.label) || (currentTab.charAt(0).toUpperCase() + currentTab.slice(1))}
            onPressBell={() => setShowNotifications(true)}
          />
          {/* Notifications Modal shown from any tab via header bell */}
          <Modal
            visible={showNotifications}
            animationType="slide"
            onRequestClose={() => setShowNotifications(false)}
            presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
          >
            <Notifications onClose={() => setShowNotifications(false)} />
          </Modal>
          {(loading || filteredTabs.length === 0) && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#0B3D91" />
            </View>
          )}
          {!loading && filteredTabs.length > 0 && (
            <Tabs
              initialRouteName={filteredTabs[0]?.name || 'home'}
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
              {baseTabs.map((tab) => {
                const allowed = filteredTabs.some(t => t.name === tab.name);
                return (
                  <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                      title: tab.label,
                      tabBarIcon: ({ color }) => <tab.icon color={color} size={26} />,
                      // Hide from tab bar and deep links if not allowed for the current role
                      href: allowed ? undefined : null,
                    }}
                  />
                );
              })}
            </Tabs>
          )}
        </View>
      </GestureHandlerRootView>
    </ProtectedRoute>
  );
}
