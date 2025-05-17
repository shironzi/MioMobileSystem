import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { DrawerToggleButton } from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
    CourseCardViewProvider,
    CourseCardViewContext,
} from "@/contexts/CourseCardViewContext";
import { useContext } from "react";

function HeaderRightToggle() {
    const { toggleCourseCardView, courseCardView } = useContext(
        CourseCardViewContext
    );
    return (
        <Pressable onPress={toggleCourseCardView}>
            {courseCardView ? (
                <MaterialIcons
                    name="splitscreen"
                    size={24}
                    color="white"
                    style={{ marginRight: 15 }}
                />
            ) : (
                <AntDesign
                    name="appstore1"
                    size={24}
                    color="white"
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
                        height: 75,
                        paddingTop: 10,
                    },
                    headerLeft: () => <DrawerToggleButton tintColor="white" />,
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
                            <Text style={{ color: "white", fontSize: 20, fontWeight:"500" }}>Dashboard</Text>
                        ),
                        headerBackground: () => (
                            <View style={{ backgroundColor: "#2264DC", flex: 1 }} />
                        ),
                        headerRight: () => <HeaderRightToggle />,
                    }}
                />
                <Tabs.Screen
                    name="todo"
                    options={{
                        tabBarLabel: () => <Text style={{ color: "white" }}>To-do</Text>,
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="checklist" size={24} color={color} />
                        ),
                        headerTitle: () => (
                            <Text style={{ color: "white",fontSize: 20, fontWeight:"500" }}>To do</Text>
                        ),
                        headerBackground: () => (
                            <View style={{ backgroundColor: "#2264DC", flex: 1 }} />
                        ),

                    }}
                />
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
                            <Text style={{ color: "white", fontSize: 20, fontWeight:"500" }}>Notification</Text>
                        ),
                        headerBackground: () => (
                            <View style={{ backgroundColor: "#2264DC", flex: 1 }} />
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
                            <Text style={{ color: "white", fontSize: 20, fontWeight:"500" }}>Inbox</Text>
                        ),
                        headerBackground: () => (
                            <View style={{ backgroundColor: "#2264DC", flex: 1 }} />
                        ),
                    }}
                />
            </Tabs>
        </CourseCardViewProvider>
    );
}
