import { useFocusEffect, useNavigation } from "expo-router";
import React, { memo, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import ScoreDetailsCard from "@/components/ScoreDetailsCard";

const data = [
  {
    id: 1,
    title: "Speech Flashcard Activity",
    difficulty: "Challenge",
    actNo: "Exercise 1",
    attemptNo: "Latest Attempt",
  },
];


const ScoreDetails = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Exercise Details",
        headerStyle: { backgroundColor: "#2264DC" },
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
        <ScoreDetailsCard
          key={item.id}
          title={item.title}
          difficulty={item.difficulty}
          actNo={item.actNo}
          attemptNo={item.attemptNo}
        />
      ))}
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default memo(ScoreDetails);
