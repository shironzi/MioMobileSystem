import globalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React from "react";

interface Props {
  percentage: number;
  score: number;
  setScore: (value: number) => void;
  total: number;
}

const Score = ({ percentage, score, setScore, total }: Props) => {
  return (
    <View style={globalStyles.cardContainer}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Score</Text>
      <View style={styles.scoreBox}>
        <AnimatedCircularProgress
          size={150}
          width={10}
          fill={percentage}
          tintColor="#2264DC"
          backgroundColor="#e7eaea"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View>
              <TextInput
                value={score.toString()}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const parsed = parseInt(v, 10);
                  if (v === "") {
                    setScore(0);
                  } else if (parsed < 0) {
                    setScore(0);
                  } else if (parsed > total) {
                    setScore(score);
                  } else {
                    setScore(isNaN(parsed) ? 0 : parsed);
                  }
                }}
                style={styles.scoreContainer}
              />
              <Text>Points</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <Text>Out of {total} points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreContainer: { fontSize: 24, color: "#1F1F1F", textAlign: "center" },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
});

export default Score;
