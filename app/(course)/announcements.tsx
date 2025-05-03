import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import AnnounceCard from "@/components/AnnounceCard";
import HeaderConfig from "@/components/HeaderConfig";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const data = [
  {
    id: 1,
    title: "Activity 1: Pitch Perfect and Again",
    date: new Date(Date.now()),
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "No Classes",
    date: new Date(Date.now()),
    time: "10:00 AM",
  },
];

const announcements = () => {
  HeaderConfig("Announcements");
  const router = useRouter();

  return (
    <View>
      <ScrollView>
      <View style={styles.container}>
      {data.map((item) => (
        <AnnounceCard
          key={item.id}
          title={item.title}
          date={item.date}
          time={item.time}
        />
      ))}
    </View>

    </ScrollView>
    <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("helpDetails")}
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
  headerStyle: {
    backgroundColor: "#2264DC",
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -530,
    right: 20,
    elevation: 5,
  },
});

export default memo(announcements);
