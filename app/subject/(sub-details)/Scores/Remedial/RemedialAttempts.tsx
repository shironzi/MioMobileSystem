import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getRemedialAttempts } from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { formatDayDateTimeWithAmPm } from "@/utils/DateFormat";

interface Attempt {
  id: string;
  score: number;
  submitted_at: string;
}

const RemedialAttempts = () => {
  useHeaderConfig("Scores");

  const { subjectId, studentId, activityType, remedialId, phoneme, role } =
    useLocalSearchParams<{
      subjectId: string;
      studentId: string;
      activityType: string;
      remedialId: string;
      phoneme: string;
      role: string;
    }>();

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const handleRemedialRoute = (id: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/Remedial/RemedialResult",
      params: {
        subjectId: subjectId,
        remedialId: remedialId,
        phoneme: phoneme,
        activityType: activityType,
        role: role,
        studentId: studentId,
        attemptId: id,
      },
    });
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      const res = await getRemedialAttempts(
        subjectId,
        studentId,
        activityType,
        remedialId,
        phoneme,
      );

      if (res.success) {
        setAttempts(res.attempts);
      } else {
        Alert.alert(
          "Activity Attempts not found",
          res.message,
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
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
              onPress={() => handleRemedialRoute(item.id)}
            >
              <Text style={styles.id}>ID: {item.id}</Text>
              <Text>Overall Score: {item.score}</Text>
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

export default RemedialAttempts;
