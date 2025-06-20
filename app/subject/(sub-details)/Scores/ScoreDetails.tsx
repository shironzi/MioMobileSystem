import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import { getAttempt } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const AuditoryScores = () => {
  headerConfigScoreDetails("Score Details");

  const {
    subjectId,
    activityType,
    activityId,
    userId,
    attemptId,
    difficulty,
    role,
  } = useLocalSearchParams<{
    subjectId: string;
    activityType: string;
    activityId: string;
    userId: string;
    attemptId: string;
    difficulty: string;
    role: string;
  }>();

  const [overallScore, setOverallScore] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<
    { id: string; feedback: string }[]
  >([]);

  const getTitle = (type: string) => {
    switch (type) {
      case "picture":
        return "Picture Flashcards";
      case "pronunciation":
        return "ReadMe: Pronunciation Challenge";
      case "phrases":
        return "Phrase Flashcards";
      case "question":
        return "Question Flashcards";
      case "bingo":
        return "Bingo Cards";
      case "matching":
        return "Matching Cards";
      default:
        return "Activity Score";
    }
  };

  useEffect(() => {
    const fetchAttempt = async () => {
      const res = await getAttempt(
        subjectId,
        activityType,
        activityId,
        userId,
        attemptId,
      );

      if (res?.success) {
        setOverallScore(res.overall_score ?? 0);
        const formatted = Object.entries(res.feedbacks).map(
          ([id, data]: any) => ({
            id,
            feedback: data.feedback,
          }),
        );
        setFeedbacks(formatted);

        console.log(feedbacks);
      }
    };

    fetchAttempt();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:50, flex:1}}>
      <View style={[globalStyles.container, { rowGap: 20, flex:1, margin:20, }]}>
        <View>
          <Text style={styles.title}>{getTitle(activityType)}</Text>
          <Text style={styles.subtitle}>{difficulty}</Text>
        </View>

        {overallScore !== null && (
          <View style={[globalStyles.cardContainer, { paddingVertical: 25 }]}>
            <Text style={styles.sectionTitle}>Score</Text>
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
        )}

        {/*{role === "teacher" && (*/}
        <View style={globalStyles.cardContainer}>
          <Text style={styles.sectionTitle}>Teacher Feedback</Text>
          {feedbacks.length === 0 ? (
            <Text style={styles.feedbackText}>No feedback provided.</Text>
          ) : (
            feedbacks.map((item, index) => (
              <View key={item.id} style={{ marginBottom: 20 }}>
                <Text style={styles.wordTitle}>Flashcard {index + 1}</Text>
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>
            ))
          )}
        </View>
        {/*)}*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#1F1F1F",
    lineHeight: 28,
    fontWeight: "500",
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 28,
    textTransform:"capitalize"
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
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
  feedbackText: {
    paddingHorizontal: 10,
    textAlign: "left",
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 24,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default memo(AuditoryScores);
