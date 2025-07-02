import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import { getAttempt, getAttemptStudent } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LoadingCard from "@/components/loadingCard";
import PhraseScoreDetailsDropdown from "@/app/subject/(sub-details)/Scores/PhraseScoreDetailsDropdown";

const ScoreDetailsPhrase = () => {
  headerConfigScoreDetails("Score Details");

  const { subjectId, activityType, activityId, userId, attemptId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      userId: string;
      attemptId: string;
      role: string;
    }>();

  const [overallScore, setOverallScore] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<
    {
      id: string;
      feedback: string;
      audio: string;
      words: {
        word: string;
        score: number;
        phonemes: {
          phone: string;
          quality_score: number;
          sound_most_like: string;
        }[];
      }[];
      text: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      const res = userId
        ? await getAttempt(
            subjectId,
            activityType,
            activityId,
            userId,
            attemptId,
          )
        : await getAttemptStudent(
            subjectId,
            activityType,
            activityId,
            attemptId,
          );

      if (res?.success) {
        console.log(res);
        setOverallScore(res.overall_score ?? 0);
        setFeedbacks(res.feedbacks);
      }

      console.log(res);

      setLoading(false);
    };

    fetchAttempt();
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

  console.log(feedbacks);

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View
        style={[
          globalStyles.container,
          {
            marginBottom: 50,
            rowGap: 20,
          },
        ]}
      >
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
        <View style={globalStyles.cardContainer}>
          <Text style={styles.sectionTitle}>Mio Feedbacks</Text>
          {feedbacks.length === 0 ? (
            <Text style={styles.feedbackText}>No feedback provided.</Text>
          ) : (
            feedbacks?.map((item, index) => (
              <PhraseScoreDetailsDropdown
                items={item}
                placeholder={index}
                key={item.id}
              />
            ))
          )}
        </View>
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
    textTransform: "capitalize",
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

export default memo(ScoreDetailsPhrase);
