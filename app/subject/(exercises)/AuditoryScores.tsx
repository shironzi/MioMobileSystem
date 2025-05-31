import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import ScoreFeedback from "@/components/ScoreFeedback";

const AuditoryScores = () => {
  headerConfigScoreDetails("Score Details");

  const { score, totalItems, activityType, difficulty } = useLocalSearchParams<{
    score: string;
    totalItems: string;
    activityType: string;
    difficulty: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const s = Number(score ?? 0);
    const t = Number(totalItems ?? 0);
    setOverallScore(s);
    setTotal(t);
    setLoading(false);
  }, [score, totalItems]);

  const percentage = total > 0 ? (overallScore / total) * 100 : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={[globalStyles.container, { rowGap: 20 }]}>
        <View>
          <Text style={styles.title}>
            {activityType === "picture" && "Picture Flashcards"}
            {activityType === "pronunciation" &&
              "ReadMe: Pronunciation Challenge"}
            {activityType === "phrases" && "Phrase Flashcards"}
            {activityType === "question" && "Question Flashcards"}
            {activityType === "bingo" && "Bingo Cards"}
            {activityType === "matching" && "Matching Cards"}
          </Text>
          <Text style={styles.subtitle}>{difficulty}</Text>
        </View>

        <View style={[globalStyles.cardContainer, { paddingVertical: 25 }]}>
          <Text style={styles.sectionTitle}>Score</Text>
          <View style={styles.scoreRow}>
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
                <>
                  <Text style={styles.scoreText}>{overallScore}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of {total} points</Text>
          </View>
        </View>

        <ScoreFeedback percentage={percentage} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#1F1F1F",
    lineHeight: 28,
    fontWeight: "500" as const,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 28,
  },
  sectionTitle: {
    fontWeight: "bold" as const,
    fontSize: 18,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackText: {
    paddingHorizontal: 20,
    textAlign: "center" as const,
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 28,
  },
  cardContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  correctText: {
    color: "green",
    marginBottom: 4,
  },
  incorrectText: {
    color: "red",
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackIconStyle: {
    width: "20%",
    height: 80,
    resizeMode: "contain" as const,
  },
  feedbackIconSelectedStyle: {
    width: "30%",
    paddingHorizontal: 10,
    height: 120,
    resizeMode: "contain" as const,
  },
});

export default memo(AuditoryScores);
