import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getStudents } from "@/utils/query";
import useHeaderConfig from "@/utils/HeaderConfig";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome } from "@expo/vector-icons";

interface Student {
  student_id: string;
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

  const [loading, setLoading] = useState<boolean>(true);

  const handleViewActivity = (studentId: string) => {
    if (activityType === "assignments") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/ScoresAcademic",
        params: {
          subjectId: subjectId,
          activityType: activityType,
          activityId: activityId,
          studentId: studentId,
          role: role,
        },
      });
    } else if (activityType === "quizzes") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/QuizScore",
        params: {
          subjectId: subjectId,
          activityType: activityType,
          activityId: activityId,
          studentId: studentId,
          role: role,
        },
      });
    } else if (activityType === "remedial") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/Remedial/RemedialList",
        params: {
          subjectId: subjectId,
          role: role,
          studentId: studentId,
        },
      });
    } else {
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
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await getStudents(subjectId);
      if (res?.success && res?.peoples) {
        const studentList = res.peoples.map((student: any) => ({
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
        }));
        setStudents(studentList);
        console.log(studentList);
      }

      console.log(res);
      setLoading(false);
    };

    fetchStudents();
  }, [subjectId]);

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
    <ScrollView style={styles.container}>
      <Text style={[globalStyles.text1, { fontSize: 18, marginBottom: 10 }]}>
        Students
      </Text>
      <View style={{ rowGap: 10 }}>
        {students.map((student) => (
          <TouchableOpacity
            key={student.student_id}
            style={styles.studentItem}
            onPress={() => handleViewActivity(student.student_id)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.yellowBulletin}></View>
                <Text style={styles.studentName}>
                  {student.last_name}, {student.first_name}
                </Text>
              </View>
              <FontAwesome name="long-arrow-right" size={20} color="black" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  studentItem: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00000024",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  studentName: {
    fontSize: 16,
  },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginRight: 15,
    height: 30,
  },
});

export default ScoreStudentList;
