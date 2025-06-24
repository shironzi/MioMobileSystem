import { ScrollView, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getStudentQuizAttempt } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";

interface Choice {
  id: string;
  choice: string;
}
interface Items {
  quizId: string;
  answer: "string";
  answered_at: string;
  choices: Choice[];
  points: string;
  question: string;
  type: string;
}

const QuizScore = () => {
  const { subjectId, activityType, activityId, studentId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      studentId: string;
      role: string;
    }>();

  const [description, setDescription] = useState<string>("");
  const [items, setItems] = useState<Items[]>();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await getStudentQuizAttempt(subjectId, activityId, studentId);

      if (res.success) {
        console.log(res);
        setDescription(res.description);
        setTotal(res.total);

        const quizItems: Items[] = Object.entries(res.latest_attempt).map(
          ([key, value]: [string, any]) => ({
            quizId: key,
            answer: value.answer,
            answered_at: value.answered_at,
            choices: Object.entries(value.choices).map(([id, choice]) => ({
              id,
              choice: choice as string,
            })),
            points: value.points,
            question: value.question,
            type: value.type,
          }),
        );

        setItems(quizItems);
      } else {
        console.error("Failed to fetch data");
      }
    };

    fetchScores();
  }, [activityType, subjectId, activityId, studentId]);

  return (
    <ScrollView style={{ backgroundColor: "#fff", padding: 20 }}>
      <Text>Quiz Results</Text>

      <View style={{ backgroundColor: "#fff", marginBottom: 20 }}>
        <Text style={globalStyles.sectionHeader}>Quiz Description</Text>
        <Text>{description}</Text>
      </View>

      {items?.map((item, index) => (
        <View>
          <View>
            <Text>Question {index + 1}</Text>
            <View>
              <TextInput
                style={[
                  globalStyles.text1,
                  {
                    lineHeight: 16,
                    borderWidth: 1,
                    width: 50,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    // borderColor: scoreError ? "#DA4848" : "#00000024",
                  },
                ]}
                // value={student_answer?.score}
                keyboardType="numeric"
                // onChangeText={(value) => {
                //   const numericValue = value.replace(/[^0-9]/g, "");
                //   setScoreError("");
                //   setStudent_answer((prev) => ({
                //     ...prev,
                //     score: numericValue,
                //   }));
                // }}
              />
              <Text>/ {item.points}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default QuizScore;
