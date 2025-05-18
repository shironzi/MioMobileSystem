import ScoreDetailsCard from "@/components/ScoreDetailsCard";
import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const data = [
  {
    id: 1,
    title: "Speech Flashcard Activity",
    difficulty: "Challenge",
    actNo: "Exercise 1",
    attemptNo: "Latest Attempt",
    scores: 7,
    totalQuestion: 8,
    comments: [
      {
        id: 1,
        word: "Passed! 'Ph' sound softer, like an 'F'. Good pacing, try to pronounce 'Th' sharper.",
      },
      { id: 2, word: "Good pacing, try to pronounce 'Th' sharper." },
      { id: 3, word: "Watch your lip movement in 'V' sounds." },
    ],
  },
];

const ScoreDetails = () => {
  HeaderConfig("Score");

  return (
    <ScrollView>
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
            comments={item.comments}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 70,
  },
});

export default memo(ScoreDetails);
