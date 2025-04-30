import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import ScoreDetailsCard from "@/components/ScoreDetailsCard";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "Speech Flashcard Activity",
    difficulty: "Challenge",
    actNo: "Exercise 1",
    attemptNo: "Latest Attempt",
    scores: 7,
    totalQuestion: 8,
  },
];

const ScoreDetails = () => {
  HeaderConfig("Score");

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <ScoreDetailsCard
          key={item.id}
          title={item.title}
          difficulty={item.difficulty}
          actNo={item.actNo}
          attemptNo={item.attemptNo}
          score={item.scores}
          totalQuestion={item.totalQuestion}
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
