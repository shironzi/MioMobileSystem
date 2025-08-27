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
import LoadingCard from "@/components/loadingCard";
import { Attempt } from "@/app/subject/Scores/ScoresTypes";

const SelectAttempt = () => {
  useHeaderConfig("Select Attempt");

  const { subjectId, activityType, activityId, studentId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      studentId: string;
      role: string;
    }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const handleViewAttempt = (attemptId: string) => {
    console.log(attemptId);

    router.push({
      pathname: "/subject/Scores/SpecializedScore",
      params: {
        subjectId: subjectId,
        activityType: activityType,
        activityId: activityId,
        studentId: studentId,
        attemptId: attemptId,
        role: role,
      },
    });
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      const res = await getScoreActivityAttempt(
        subjectId,
        activityType,
        activityId,
        studentId,
      );

      if (res.success) {
        setAttempts(res.attempts);
        console.log(res.attempts);
      }

      setLoading(false);
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  const renderItem = (item: Attempt) => (
    <TouchableOpacity
      style={styles.attemptCard}
      onPress={() => handleViewAttempt(item.attemptId)}
    >
      <Text style={styles.id}>ID: {item.attemptId}</Text>
      <Text>Overall Score: {item.score}</Text>
      <Text>Submitted: {formatDayDateTimeWithAmPm(item.submitted_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {attempts.length === 0 ? (
        <Text style={styles.emptyText}>No attempts found.</Text>
      ) : (
        <FlatList
          data={attempts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderItem(item)}
          showsVerticalScrollIndicator={false}
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

export default memo(SelectAttempt);
