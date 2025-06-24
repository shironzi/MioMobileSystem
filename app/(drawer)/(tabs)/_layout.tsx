import {
  CourseCardViewContext,
  CourseCardViewProvider,
} from "@/contexts/CourseCardViewContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";

function HeaderRightToggle() {
  const { toggleCourseCardView, courseCardView } = useContext(
    CourseCardViewContext,
  );
  return (
    <Pressable onPress={toggleCourseCardView}>
      {courseCardView ? (
        <MaterialIcons
          name="splitscreen"
          size={24}
          color="#282727"
          style={{ marginRight: 15 }}
        />
      ) : (
        <AntDesign
          name="appstore1"
          size={24}
          color="#282727"
          style={{ marginRight: 15 }}
        />
      )}
    </Pressable>
  );
}

export default function Layout() {
  return (
    <CourseCardViewProvider>
      <Tabs
        screenOptions={() => ({
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#CCC",
          tabBarStyle: {
            backgroundColor: "#2264DC",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: 90,
            paddingTop: 10,
          },
          headerLeft: () => <DrawerToggleButton tintColor="#282727" />,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: () => (
              <Text style={{ color: "white" }}>Dashboard</Text>
            ),
            tabBarIcon: ({ color }) => (
              <Ionicons name="apps" size={20} color={color} />
            ),
            headerTitle: () => (
              <Text
                style={{ color: "#282727", fontSize: 20, fontWeight: "500" }}
              >
                Dashboard
              </Text>
            ),
            headerBackground: () => (
              <View
                style={{
                  backgroundColor: "#fff",
                  flex: 1,
                }}
              />
            ),
            headerRight: () => <HeaderRightToggle />,
          }}
        />
        {/*<Tabs.Screen*/}
        {/*  name="todo"*/}
        {/*  options={{*/}
        {/*    tabBarLabel: () => <Text style={{ color: "white" }}>To-do</Text>,*/}
        {/*    tabBarIcon: ({ color }) => (*/}
        {/*      <MaterialIcons name="checklist" size={24} color={color} />*/}
        {/*    ),*/}
        {/*    headerTitle: () => (*/}
        {/*      <Text*/}
        {/*        style={{ color: "#282727", fontSize: 20, fontWeight: "500" }}*/}
        {/*      >*/}
        {/*        To do*/}
        {/*      </Text>*/}
        {/*    ),*/}
        {/*    headerBackground: () => (*/}
        {/*      <View style={{ backgroundColor: "#fff", flex: 1 }} />*/}
        {/*    ),*/}
        {/*  }}*/}
        {/*/>*/}
        <Tabs.Screen
          name="notification"
          options={{
            tabBarLabel: () => (
              <Text style={{ color: "white" }}>Notification</Text>
            ),
            tabBarIcon: ({ color }) => (
              <Ionicons name="notifications-outline" size={24} color={color} />
            ),
            headerTitle: () => (
              <Text
                style={{ color: "#282727", fontSize: 20, fontWeight: "500" }}
              >
                Notification
              </Text>
            ),
            headerBackground: () => (
              <View style={{ backgroundColor: "#fff", flex: 1 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            tabBarLabel: () => <Text style={{ color: "white" }}>Inbox</Text>,
            tabBarIcon: ({ color }) => (
              <Feather name="mail" size={24} color={color} />
            ),
            headerTitle: () => (
              <Text
                style={{ color: "#282727", fontSize: 20, fontWeight: "500" }}
              >
                Inbox
              </Text>
            ),
            headerBackground: () => (
              <View style={{ backgroundColor: "#fff", flex: 1 }} />
            ),
          }}
        />
      </Tabs>
    </CourseCardViewProvider>
  );
}
