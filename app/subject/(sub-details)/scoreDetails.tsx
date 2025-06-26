import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { finishActivity } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import ScoreFeedback from "@/components/ScoreFeedback";

interface PhoneEntry {
  phone: string;
  quality_score: number;
  sound_most_like: string;
}

interface EvalEntry {
  id: string;
  phones: PhoneEntry[];
}

const ScoreDetails = () => {
  headerConfigScoreDetails("Score Details");

  const { subjectId, activity_type, difficulty, activityId, attemptId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      activityId: string;
      attemptId: string;
    }>();

  const [evaluationsScore, setEvaluationsScore] = useState<EvalEntry[]>([]);
  const [overallScore, setOverallScore] = useState<number>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId || !activityId || !attemptId) return;

    const fetchScores = async () => {
      setLoading(true);
      const res = await finishActivity(
        subjectId,
        activity_type,
        difficulty,
        activityId,
        attemptId,
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to load scores");
      }

      const entries: EvalEntry[] = Object.entries(res.scores || {}).map(
        ([id, data]: [string, any]) => ({
          id,
          phones: data.phones ?? [],
        }),
      );

      setTotal(100);

      setOverallScore(res.overall_score);
      setEvaluationsScore(entries);
      setLoading(false);
    };

    fetchScores();
  }, [subjectId, activityId, attemptId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (evaluationsScore.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No score data available.</Text>
      </View>
    );
  }

  const percentage =
    total > 0
      ? Math.min(Math.max(((overallScore ?? 0) / total) * 100, 0), 100)
      : 0;

  return (
    <ScrollView>
      <View style={[globalStyles.container, { rowGap: 20 }]}>
        <View>
          <Text
            style={{
              color: "#1F1F1F",
              lineHeight: 28,
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            {activity_type === "picture" && "Picture Flashcards"}

            {activity_type === "pronunciation" &&
              "ReadMe: Pronunciation Challenge"}

            {activity_type === "phrases" && "Phrase Flashcards"}

            {activity_type === "question" && "Question Flashcards"}
          </Text>

          <View>
            <Text style={{ fontSize: 16, fontWeight: 500, lineHeight: 28 }}>
              {difficulty}
            </Text>
          </View>
        </View>

        <View style={[globalStyles.cardContainer, { paddingVertical: 25 }]}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Score</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 20,
            }}
          >
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
                  <Text style={{ fontSize: 24, color: "#1F1F1F" }}>
                    {overallScore ?? 0}
                  </Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of {total} points</Text>
          </View>
        </View>

        <ScoreFeedback percentage={percentage} />

        {/*

        FOR TEACHER ONLY

        */}

        {/*{evaluationsScore.map((entry, idx) => (*/}
        {/*  <View key={entry.id} style={styles.cardContainer}>*/}
        {/*    <Text style={styles.wordTitle}>Flashcard {idx + 1}</Text>*/}
        {/*    {entry.phones.map((phoneEntry, i) => {*/}
        {/*      const { phone, sound_most_like } = phoneEntry;*/}
        {/*      const isCorrect = phone === sound_most_like;*/}
        {/*      return (*/}
        {/*        <Text*/}
        {/*          key={i}*/}
        {/*          style={isCorrect ? styles.correctText : styles.incorrectText}*/}
        {/*        >*/}
        {/*          {isCorrect*/}
        {/*            ? `Great! You pronounced “${phone}” correctly.`*/}
        {/*            : `Almost! That sounded like “${sound_most_like}” instead of “${phone}.”`}*/}
        {/*        </Text>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*  </View>*/}
        {/*))}*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
});

export default memo(ScoreDetails);
