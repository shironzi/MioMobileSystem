import AttendanceCard from "@/components/attendanceCard";
import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {data.map((item) => (
            <AttendanceCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // router.push("attendanceDetails")
          console.log("Attendance");
        }}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 2,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default memo(attendanceDetails);
