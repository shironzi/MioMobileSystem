import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { getStudentAssignmentScore } from "@/utils/query";
import LoadingCard from "@/components/loadingCard";

const AcademicScore = () => {
  headerConfigScoreDetails("Score Detail");

  const { activityType, activityId, subjectId } = useLocalSearchParams<{
    activityType: string;
    activityId: string;
    subjectId: string;
  }>();

  const [total, setTotal] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScore = async () => {
      const res = await getStudentAssignmentScore(subjectId, activityId);

      setTotal(res.total);
      setScore(res.score);
      setFeedback(res.feedback);
      setComments(res.comments);

      setLoading(false);
    };

    fetchScore();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[globalStyles.container, { rowGap: 20, flex: 1 }]}>
        <View style={[globalStyles.cardContainer, {}]}>
          <Text style={styles.sectionTitle}>Score</Text>
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={5}
              fill={(score / total) * 100}
              tintColor="#2264DC"
              backgroundColor="#fff"
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
            <Text>Out of {total} points</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          globalStyles.cardContainer,
          { margin: 20, marginTop: 0, minHeight: 150 },
        ]}
      >
        <Text style={globalStyles.text1}>Feedback</Text>
        <Text>{feedback.trim() ? feedback : "No Feedback"}</Text>
      </View>

      <View
        style={[
          globalStyles.cardContainer,
          { margin: 20, marginTop: 0, minHeight: 150 },
        ]}
      >
        <Text style={globalStyles.text1}>Comments</Text>
        <Text>{comments.trim() ? comments : "No Comments"}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 28,
    fontWeight: "500" as const,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300 as const,
    lineHeight: 28,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontWeight: 500 as const,
    fontSize: 18,
    marginVertical: 10,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 0,
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
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
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

export default memo(AcademicScore);
