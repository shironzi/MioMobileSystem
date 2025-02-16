import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: "yellow",
        tabBarStyle: {
          backgroundColor: "#2264DC",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        headerLeft: () => <DrawerToggleButton tintColor="white"/>,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>Dashboard</Text>,
          tabBarIcon: () => <Ionicons name="apps" size={20} color="white" />, 
          headerTitle: () => <Text style={{ color: "white", fontSize: 18 }}>Dashboard</Text>,
          headerBackground: () => <View style={{ backgroundColor: "#2264DC", flex: 1 }} />,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>To-do</Text>,
          tabBarIcon: () => <MaterialIcons name="checklist" size={24} color="white" />, 
          headerTitle: () => <Text style={{ color: "white", fontSize: 18 }}>To-do</Text>,
          headerBackground: () => <View style={{ backgroundColor: "#2264DC", flex: 1 }} />,
          
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>Notification</Text>,
          tabBarIcon: () => <Ionicons name="notifications" size={24} color="white" />,
          headerTitle: () => <Text style={{ color: "white", fontSize: 18}}>Notification</Text>,
          headerBackground: () => <View style={{ backgroundColor: "#2264DC", flex: 1 }} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarLabel: () => <Text style={{ color: "white" }}>Inbox</Text>,
          tabBarIcon: () => <Feather name="mail" size={24} color="white" />,
          headerTitle: () => <Text style={{ color: "white", fontSize: 18}}>Inbox</Text>,
          headerBackground: () => <View style={{ backgroundColor: "#2264DC", flex: 1 }} />,
        }}
      />
    </Tabs>
  );
}
