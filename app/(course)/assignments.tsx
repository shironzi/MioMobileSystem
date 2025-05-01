import { View, StyleSheet, ScrollView } from "react-native";
import React, { memo } from "react";
import AssCard from "@/components/AssCard";
import HeaderConfig from "@/components/HeaderConfig";


const data = [
  {
    id: 1,
    title: "Activity 1: Sound Difference",
    date: new Date(Date.now()),
    time: "10:00 AM",
    score: 50 + "/50 pts",
    type: "Quiz",
  },
  {
    id: 2,
    title: "Activity 2",
    date: new Date(Date.now()),
    time: "10:00 AM",
    score: 50 + "/50 pts",
    type: "Quiz",
  },
];

const assignments = () => {
  HeaderConfig("Assignments");

  return (
    <ScrollView>
      <View style={styles.container}>
      {data.map((item) => (
        <AssCard
          key={item.id}
          title={item.title}
          date={item.date}
          time={item.time}
          score={item.score}
          type={item.type}
        />
      ))}
    </View>
    </ScrollView>
    
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

export default memo(assignments);
