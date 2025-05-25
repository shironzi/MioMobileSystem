import ScoreDetailsCard from "@/components/ScoreDetailsCard";
import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { getActivityScore } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";

type ScoreEntry = {
  word: string;
  pronunciation_score: number;
};

const ScoreDetails = () => {
  HeaderConfig("Score");

  const { subjectId, activityId, attemptId } = useLocalSearchParams<{
    subjectId: string;
    activityId: string;
    attemptId: string;
  }>();

  const [average, setAverage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [flashcardScores, setFlashcardScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!subjectId || !activityId || !attemptId) return;

    const fetchScores = async () => {
      try {
        const res = await getActivityScore(subjectId, activityId, attemptId);

        if (res.success) {
          setAverage(res.average);
          setTotal(res.totalItems);

          const scores: ScoreEntry[] = Object.values(res.detailedScores).map(
            (entry: any) => ({
              word: entry.word,
              pronunciation_score: entry.pronunciation_score,
            }),
          );

          setFlashcardScores(scores);
        } else {
          console.error("Failed to load scores:", res);
        }
      } catch (err) {
        console.error("Fetch scores error:", err);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        {flashcardScores.length === 0 ? (
          <Text>No scores available.</Text>
        ) : (
          flashcardScores.map((fc, idx) => (
            <ScoreDetailsCard
              key={idx}
              title={fc.word}
              difficulty="" // or pass real difficulty if you have it
              actNo={`Attempt ${attemptId}`}
              attemptNo={`Card ${idx + 1}/${flashcardScores.length}`}
              score={fc.pronunciation_score}
              totalQuestion={total}
              comments={[
                {
                  id: idx,
                  word: `Pronunciation: ${fc.pronunciation_score}`,
                },
              ]}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 70,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(ScoreDetails);
