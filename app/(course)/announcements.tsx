import { View, StyleSheet } from "react-native";
import React, { memo } from "react";
import AnnounceCard from "@/components/AnnounceCard";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "Activity 1",
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
  HeaderConfig("Announcments");

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
});

export default memo(announcements);
