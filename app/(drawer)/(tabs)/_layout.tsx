import { Tabs } from "expo-router";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { DrawerToggleButton } from "@react-navigation/drawer";

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
        headerLeft: () => <DrawerToggleButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>Dashboard</Text>,
          tabBarIcon: () => <Ionicons name="apps" size={24} color="white" />,
          headerTitle: () => <Text style={{ color: "black" }}>Dashboard</Text>,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: () => (
            <Text style={{ color: "white" }}>Notification</Text>
          ),
          tabBarIcon: () => (
            <Ionicons name="notifications" size={24} color="white" />
          ),
          headerTitle: () => (
            <Text style={{ color: "black", fontSize: 18 }}>Notification</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>Inbox</Text>,
          tabBarIcon: () => <Feather name="mail" size={24} color="white" />,
          headerTitle: () => (
            <Text style={{ color: "black", fontSize: 16, marginLeft: 10 }}>
              Inbox
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
