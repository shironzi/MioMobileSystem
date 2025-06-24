import React, { memo, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getScoreActivityAttempt } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { formatDayDateTimeWithAmPm } from "@/utils/DateFormat";

const ScoreAttempts = () => {
  useHeaderConfig("Score");

  const { subjectId, activityType, activityId, userId, difficulty, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      userId: string;
      difficulty: string;
      role: string;
    }>();

  const [attempts, setAttempts] = useState<
    {
      attemptId: string;
      overall_score: number;
      submitted_at: string;
    }[]
  >([]);

  const handleViewAttempt = (attemptId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/ScoreDetails",
      params: {
        subjectId: subjectId,
        activityType: activityType,
        activityId: activityId,
        userId: userId,
        attemptId: attemptId,
      },
    });
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      const res = await getScoreActivityAttempt(
        subjectId,
        activityType,
        activityId,
        userId,
      );

      console.log(res);

      if (res?.success && res.attempts) {
        const formatted = Object.entries(res.attempts).map(
          ([id, data]: any) => ({
            attemptId: id,
            overall_score: data.overall_score ?? data.score,
            submitted_at: data.submitted_at,
          }),
        );

        setAttempts(formatted);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={styles.heading}>Score Attempts</Text>

      {attempts.length === 0 ? (
        <Text style={styles.emptyText}>No attempts found.</Text>
      ) : (
        <FlatList
          data={attempts}
          keyExtractor={(item) => item.attemptId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.attemptCard}
              onPress={() => handleViewAttempt(item.attemptId)}
            >
              <Text style={styles.id}>ID: {item.attemptId}</Text>
              <Text>Overall Score: {item.overall_score}</Text>
              <Text>
                Submitted: {formatDayDateTimeWithAmPm(item.submitted_at)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  attemptCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  id: { fontWeight: "bold", marginBottom: 4 },
  emptyText: { fontStyle: "italic", color: "#888" },
});

export default memo(ScoreAttempts);
