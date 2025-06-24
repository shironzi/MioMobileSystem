import React, { memo, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getScoreActivityAttempt,
  getScoreActivityAttemptStudent,
} from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { formatDayDateTimeWithAmPm } from "@/utils/DateFormat";
import LoadingCard from "@/components/loadingCard";

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

  const [loading, setLoading] = useState<boolean>(true);

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
        role: role,
      },
    });
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      const res = userId
        ? await getScoreActivityAttempt(
            subjectId,
            activityType,
            activityId,
            userId,
          )
        : await getScoreActivityAttemptStudent(
            subjectId,
            activityType,
            activityId,
          );

      console.log(res);
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

      setLoading(false);
    };

    fetchAttempts();
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
    borderColor: "#00000024",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  id: { fontWeight: "bold", marginBottom: 4 },
  emptyText: { fontStyle: "italic", color: "#888" },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginLeft: -15,
    marginRight: 15,
    height: 30,
  },
});

export default memo(ScoreAttempts);
