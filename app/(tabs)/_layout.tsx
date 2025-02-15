import { Tabs } from "expo-router";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "yellow",
        tabBarStyle: {
          backgroundColor: "#2264DC",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: () => <Text style={{ color: "white" }}>Dashboard</Text>,
          tabBarIcon: () => <Ionicons name="apps" size={24} color="white" />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          headerShown: false,
          tabBarLabel: () => <Text style={{ color: "white" }}>Inbox</Text>,
          tabBarIcon: () => (
            <Ionicons name="notifications" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          tabBarLabel: () => (
            <Text style={{ color: "white" }}>Notification</Text>
          ),
          tabBarIcon: () => <Feather name="mail" size={24} color="white" />,
        }}
      />
    </Tabs>
  );
}
