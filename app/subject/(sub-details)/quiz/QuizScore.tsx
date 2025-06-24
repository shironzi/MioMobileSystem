import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import { finalizeQuiz } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const QuizScore = () => {
  headerConfigScoreDetails("Score");

  const { subjectId, quizId, attemptId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
    attemptId: string;
  }>();

  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const submitAnswers = async () => {
      const res = await finalizeQuiz(subjectId, quizId, attemptId);

      setScore(res.score);
      setTotal(res.total_quiz_points);

      console.log(res);
    };

    submitAnswers();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={[globalStyles.container, { flex: 1 }]}>
        <Text
          style={[
            { margin: 10, fontSize: 16, marginTop: 0, fontWeight: "bold" },
          ]}
        >
          Latest Attempt
        </Text>
        <View
          style={[
            globalStyles.cardContainer,
            {
              paddingVertical: 25,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              margin: 10,
            },
          ]}
        >
          {/* <Text
						style={[
							{
								top: -10,
								fontSize: 16,
								marginTop: 0,
								marginVertical: 10,
								fontWeight: 500,
								left: -10,
							},
						]}
					>
						Score Details
					</Text> */}
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={10}
              fill={(score / total) * 100 || 0}
              tintColor="#2264DC"
              backgroundColor="#e7eaea"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <>
                  <Text style={styles.scoreText}>{score}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text style={{ left: 10 }}>Out of {total} points</Text>
          </View>
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
    textAlign: "center",
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

export default memo(QuizScore);
