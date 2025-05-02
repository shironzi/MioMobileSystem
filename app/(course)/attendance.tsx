import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { memo } from "react";
import AttendanceCard from "@/components/attendanceCard";
import HeaderConfig from "@/components/HeaderConfig";
import { useRouter } from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

const data = [
  {
    id: 1,
    date: new Date(Date.now()),
  },
  {
    id: 2,
    date: new Date(Date.now()),
  },
];

const attendanceDetails = () => {
  HeaderConfig("Attendance");
  const router = useRouter();

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {data.map((item) => (
            <AttendanceCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("attendanceDetails")}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -550,
    right: 20,
    elevation: 5,
  },
});

export default memo(attendanceDetails);
