import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { finishRemedialActivity } from "@/utils/specialized";
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

const RemedialScoreDetails = () => {
  headerConfigScoreDetails("Score Details", "", true);

  const { subjectId, activity_type, remedialId, attemptId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      remedialId: string;
      attemptId: string;
    }>();

  const [evaluationsScore, setEvaluationsScore] = useState<EvalEntry[]>([]);
  const [overallScore, setOverallScore] = useState<number>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId || !remedialId || !attemptId) return;

    const fetchScores = async () => {
      setLoading(true);
      const res = await finishRemedialActivity(
        subjectId,
        activity_type,
        remedialId,
        attemptId,
      );
      if (res.success) {
        const entries: EvalEntry[] = Object.entries(res.scores || {}).map(
          ([id, data]: [string, any]) => ({
            id,
            phones: data.phones ?? [],
          }),
        );

        setTotal(100);

        setOverallScore(res.overall_score);
        setEvaluationsScore(entries);
      }
      setLoading(false);
    };

    fetchScores();
  }, [subjectId, remedialId, attemptId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
            Remedial
          </Text>

          <View>
            <Text style={{ fontSize: 16, fontWeight: 500, lineHeight: 28 }}>
              Remedial
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

export default memo(RemedialScoreDetails);
