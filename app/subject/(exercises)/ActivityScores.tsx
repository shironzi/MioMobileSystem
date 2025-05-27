import React, { memo, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { finishActivity } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";

const ActivityScores = () => {
  const { subjectId, activityType, difficulty, activityId, attemptId } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      difficulty: string;
      activityId: string;
      attemptId: string;
    }>();

  const [averagePhonemeScore, setAveragePhonemeScore] = useState<number | null>(
    null,
  );
  const [averageQualityScore, setAverageQualityScore] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !subjectId ||
      !activityType ||
      !difficulty ||
      !activityId ||
      !attemptId
    ) {
      return;
    }

    const fetchScores = async () => {
      try {
        setLoading(true);
        const res = await finishActivity(
          subjectId,
          activityType,
          difficulty,
          activityId,
          attemptId,
        );

        if (!res.success) {
          throw new Error(res.error || "Failed to fetch scores");
        }

        const scoresObj = res.scores || {};
        const entries = Object.values(scoresObj) as Array<{
          overall_quality_score: number;
          average_phoneme_score: number;
        }>;

        if (entries.length === 0) {
          setError("No score data available.");
          return;
        }

        // compute average of overall_quality_score
        const totalQuality = entries.reduce(
          (sum, e) => sum + (e.overall_quality_score ?? 0),
          0,
        );
        setAverageQualityScore(
          parseFloat((totalQuality / entries.length).toFixed(2)),
        );

        // compute average of average_phoneme_score
        const totalPhoneme = entries.reduce(
          (sum, e) => sum + (e.average_phoneme_score ?? 0),
          0,
        );
        setAveragePhonemeScore(
          parseFloat((totalPhoneme / entries.length).toFixed(2)),
        );
      } catch (err: any) {
        console.error("Error fetching scores:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [subjectId, activityType, difficulty, activityId, attemptId]);

  return (
    <View>
      <Text>Scores</Text>
    </View>
  );
};

export default memo(ActivityScores);
