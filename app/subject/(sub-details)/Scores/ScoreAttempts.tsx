import React, { memo, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getAttempts } from "@/utils/query";
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
      id: string;
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
      const res = await getAttempts(
        subjectId,
        activityType,
        activityId,
        userId,
      );

      if (res?.success && res.attempts) {
        const formatted = Object.entries(res.attempts).map(
          ([id, data]: any) => ({
            id,
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.attemptCard}
              onPress={() => handleViewAttempt(item.id)}
            >
              <Text style={styles.id}>ID: {item.id}</Text>
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
