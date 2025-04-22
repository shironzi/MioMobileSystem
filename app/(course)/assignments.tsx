import { View, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import AssCard from "@/components/AssCard";

const data = [
  {
    id: 1,
    title: "Activity 1",
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
    score: 30 + "/50 pts",
    type: "Type Entry",
  },
];

const assignments = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Assignments",
        headerStyle: styles.headerStyle,
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {},
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  return (
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
