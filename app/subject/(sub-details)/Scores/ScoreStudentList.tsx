import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getStudents } from "@/utils/query";
import useHeaderConfig from "@/utils/HeaderConfig";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

const ScoreStudentList = () => {
  useHeaderConfig("Scores");

  const [students, setStudents] = useState<Student[]>([]);
  const { subjectId, difficulty, activityId, activityType, role } =
    useLocalSearchParams<{
      subjectId: string;
      difficulty: string;
      activityId: string;
      activityType: string;
      role: string;
    }>();

  const handleViewActivity = (studentId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/ScoreAttempts",
      params: {
        subjectId: subjectId,
        activityType: activityType,
        activityId: activityId,
        userId: studentId,
        difficulty: difficulty,
        role: role,
      },
    });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await getStudents(subjectId);
      if (res?.success && res?.peoples) {
        const studentList = Object.entries(res.peoples).map(
          ([id, student]: any) => ({
            id,
            ...student,
          }),
        );
        setStudents(studentList);
      }
    };

    fetchStudents();
  }, [subjectId]);

  return (
    <ScrollView style={styles.container}>
      {students.map((student) => (
        <TouchableOpacity
          key={student.id}
          style={styles.studentItem}
          onPress={() => handleViewActivity(student.id)}
        >
          <Text style={styles.studentName}>
            {student.last_name}, {student.first_name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  studentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  studentName: {
    fontSize: 16,
  },
});

export default ScoreStudentList;
