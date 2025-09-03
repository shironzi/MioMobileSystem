import { StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React, { useState } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";
import AcademicItemCard from "@/app/subject/(sub-details)/Scores/AcademicItemCard";

const ViewAssignment = () => {
  useHeaderConfig("Assignment");

  const overallScore = 0;
  const [score, setScore] = useState("0");

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text1}>Latest Attempt</Text>

      <View style={{ rowGap: 15 }}>
        <View style={globalStyles.cardContainer}>
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={10}
              fill={overallScore}
              tintColor="#2264DC"
              backgroundColor="#e7eaea"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <>
                  <Text style={styles.scoreText}>{overallScore}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of 100 points</Text>
          </View>
        </View>

        <View>
          <AcademicItemCard
            title={"Question 1"}
            score={score}
            setScore={setScore}
            totalScore={"10"}
            question={"Question Here"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
});

export default ViewAssignment;
