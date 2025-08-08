import { Tabs } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ClipboardList, FileText, Home, Scale, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1111e0ff',
          tabBarInactiveTintColor: '#0b0b68ff',
          tabBarStyle: { backgroundColor: '#f8f8fbff', height: 100, paddingBottom: 10, paddingTop: 10 },
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
