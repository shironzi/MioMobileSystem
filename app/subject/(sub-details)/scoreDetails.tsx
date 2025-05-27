import HeaderConfig from "@/utils/HeaderConfig";
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
  HeaderConfig("Score");

  const { subjectId, activityType, difficulty, activityId, attemptId } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      difficulty: string;
      activityId: string;
      attemptId: string;
    }>();

  const [evaluationsScore, setEvaluationsScore] = useState<EvalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId || !activityId || !attemptId) return;

    const fetchScores = async () => {
      setLoading(true);
      try {
        const res = await finishActivity(
          subjectId,
          activityType,
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

        console.log(entries);

        setEvaluationsScore(entries);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
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

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        {evaluationsScore.map((entry, idx) => (
          <View key={entry.id} style={styles.cardContainer}>
            {/* You might want to show the word itself here, if you have it */}
            <Text style={styles.wordTitle}>Flashcard {idx + 1}</Text>
            {entry.phones.map((phoneEntry, i) => {
              const { phone, sound_most_like } = phoneEntry;
              const isCorrect = phone === sound_most_like;
              return (
                <Text
                  key={i}
                  style={isCorrect ? styles.correctText : styles.incorrectText}
                >
                  {isCorrect
                    ? `Great! You pronounced “${phone}” correctly.`
                    : `Almost! That sounded like “${sound_most_like}” instead of “${phone}.”`}
                </Text>
              );
            })}
          </View>
        ))}
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
    // ...any other card styling
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
