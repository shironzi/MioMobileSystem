import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";

interface PhoneEntry {
  phone: string;
  quality_score: number;
  sound_most_like: string;
}

interface EvalEntry {
  id: string;
  phones: PhoneEntry[];
}

const ViewScores = () => {
  headerConfigScoreDetails("Score Details");

  const { score, totalScore, activityType, difficulty } = useLocalSearchParams<{
    score: string;
    totalScore: string;
    activityType: string;
    difficulty: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [evaluationsScore, setEvaluationsScore] = useState<EvalEntry[]>([]);

  useEffect(() => {
    const s = Number(score ?? 0);
    const t = Number(totalScore ?? 0);
    setOverallScore(s);
    setTotal(t);
    setLoading(false);
  }, [score, totalScore]);

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

        <View style={[globalStyles.cardContainer, { rowGap: 10 }]}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <View style={styles.feedbackRow}>
            <Image
              source={require("@/assets/images/face/red.png")}
              style={
                percentage < 40
                  ? styles.feedbackIconSelectedStyle
                  : styles.feedbackIconStyle
              }
            />
            <Image
              source={require("@/assets/images/face/yellow.png")}
              style={
                percentage >= 40 && percentage < 60
                  ? styles.feedbackIconSelectedStyle
                  : styles.feedbackIconStyle
              }
            />
            <Image
              source={require("@/assets/images/face/blue.png")}
              style={
                percentage >= 60 && percentage < 85
                  ? styles.feedbackIconSelectedStyle
                  : styles.feedbackIconStyle
              }
            />
            <Image
              source={require("@/assets/images/face/green.png")}
              style={
                percentage >= 85
                  ? styles.feedbackIconSelectedStyle
                  : styles.feedbackIconStyle
              }
            />
          </View>
          <Text style={styles.feedbackText}>
            Great effort! Keep practicing and paying attention to details—you're
            getting better! Try again and see if you can improve your score.
            You're on the right track!
          </Text>
        </View>
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

export default memo(ViewScores);
