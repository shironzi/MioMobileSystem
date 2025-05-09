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
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
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
        onPress={() => router.push("addAnnouncement")}
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

export default memo(announcements);
