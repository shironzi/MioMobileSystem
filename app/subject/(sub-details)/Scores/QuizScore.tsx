import { downloadAndSaveFile } from "@/app/subject/(sub-details)/Scores/DownloadFile";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getStudentQuizAttempt } from "@/utils/query";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type QuizItem = {
  quizId: string;
  answer: string | string[];
  points: number;
  question: string;
  type:
    | "essay"
    | "fill_blank"
    | "file_upload"
    | "multiple_choice"
    | "multiple_multiple";
  multiple_type: string;
  options?: string[];
  allowed_types?: string[];
  max_size?: number;
  image?: string;
};

const QuizScore = () => {
  useHeaderConfig("Score");

  const { subjectId, activityType, activityId, studentId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      studentId: string;
      role: string;
    }>();

  const [description, setDescription] = useState<string>("");
  const [quizItems, setQuizItems] = useState<QuizItem[]>();
  const [total, setTotal] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<{
    [key: string]: string | string[];
  }>({});
  const [studentScore, setStudentScore] = useState<{
    itemId: string;
    score: number;
  }>();

  useEffect(() => {
    const fetchScores = async () => {
      const res = await getStudentQuizAttempt(subjectId, activityId, studentId);

      if (res.success) {
        setDescription(res.description);
        setTotal(res.total);

        const items: QuizItem[] = Object.entries(res.quiz_data).map(
          ([key, value]: [string, any]) => ({
            quizId: key,
            answer: value.answer,
            points: value.points,
            question: value.question,
            type: value.type,
            options: value.options || [],
            allowed_types: value.allowed_types || [],
            max_size: value.max_size || 0,
            image: value.image || "",
            multiple_type: value.multiple_type ?? "",
          }),
        );

        setQuizItems(items);

        const answers: { [key: string]: string | string[] } = Object.entries(
          res.answers,
        )
          .map(([key, value]: [string, any]) => ({
            [key]: value.student_answer,
          }))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        setStudentAnswer(answers);
      }
    };

    fetchScores();
  }, [activityType, subjectId, activityId, studentId]);

  const handleDownload = (work: string) => {
    downloadAndSaveFile(work);
  };

  const handleSubmit = () => {
    console.log(studentScore);
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff", padding: 20 }}>
      <View style={{ marginBottom: 60 }}>
        <Text>Quiz Results</Text>

        <View
          style={{
            backgroundColor: "#fff",
            marginBottom: 20,
            borderWidth: 1,
            borderRadius: 20,
            minHeight: 120,
            borderColor: "#00000024",
          }}
        >
          <Text style={globalStyles.sectionHeader}>Quiz Description</Text>
          <Text style={{ padding: 20 }}>{description}</Text>
        </View>

        <View style={{ rowGap: 20 }}>
          {quizItems?.map((item, index) => (
            <View
              key={item.quizId}
              style={{
                borderRadius: 20,
                borderWidth: 1,
                minHeight: 150,
                borderColor: "#00000024",
              }}
            >
              <View>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      width: "80%",
                      justifyContent: "space-between",
                    },
                    globalStyles.sectionHeader,
                  ]}
                >
                  <Text style={globalStyles.text1}>Question {index + 1}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 5,
                    }}
                  >
                    <TextInput
                      style={[
                        globalStyles.text1,
                        {
                          lineHeight: 16,
                          borderWidth: 1,
                          width: 50,
                          paddingHorizontal: 10,
                          borderRadius: 10,
                        },
                      ]}
                      keyboardType="numeric"
                      value={
                        studentScore?.itemId === item.quizId
                          ? String(studentScore.score)
                          : ""
                      }
                      onChangeText={(value: string) => {
                        const numericValue = parseFloat(value);
                        if (!isNaN(numericValue)) {
                          setStudentScore({
                            itemId: item.quizId,
                            score: numericValue,
                          });
                        }
                      }}
                    />
                    <Text>/ {item.points}</Text>
                  </View>
                </View>
                <View style={{ padding: 20 }}>
                  <Text>{item.question}</Text>
                  <View
                    style={{ borderTopWidth: 1, borderColor: "#00000024" }}
                  />

                  {item.type === "multiple_choice" && (
                    <View>
                      {item.options?.map((option, index) => (
                        <View
                          style={[
                            {
                              flexDirection: "row",
                              padding: 15,
                              alignItems: "center",
                              borderBottomWidth: 1,
                              width: "100%",
                              borderColor: "#00000024",
                            },
                            studentAnswer[item.quizId] === option && {
                              backgroundColor: "#82828214",
                            },
                          ]}
                          key={index}
                        >
                          <Fontisto
                            name={
                              studentAnswer[item.quizId] === option
                                ? "radio-btn-active"
                                : "radio-btn-passive"
                            }
                            size={15}
                            color={
                              studentAnswer[item.quizId] === option
                                ? "#ffbf18"
                                : "#aaa"
                            }
                            style={{ marginRight: 10 }}
                          />
                          <Text>{option}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {item.type === "multiple_multiple" && (
                    <View style={{ rowGap: 10, marginTop: 20 }}>
                      {item.options?.map((option, index) => (
                        <View
                          style={{
                            flexDirection: "row",
                            columnGap: 5,
                          }}
                          key={index}
                        >
                          <Ionicons
                            name={
                              (studentAnswer[item.quizId] as string[]).includes(
                                option,
                              )
                                ? "checkbox"
                                : "checkbox-outline"
                            }
                            size={24}
                            color={
                              (studentAnswer[item.quizId] as string[]).includes(
                                option,
                              )
                                ? "#ffbf18"
                                : "#aaa"
                            }
                          />
                          <Text>{option}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {item.type === "fill_blank" && (
                    <View>
                      <TextInput
                        placeholder="Write your answer..."
                        multiline
                        value={
                          typeof studentAnswer[item.quizId] === "string"
                            ? (studentAnswer[item.quizId] as string)
                            : ""
                        }
                        editable={false}
                        style={{
                          marginTop: 10,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 5,
                          padding: 10,
                          textAlignVertical: "top",
                        }}
                      />
                    </View>
                  )}

                  {item.type === "essay" && (
                    <View>
                      <TextInput
                        placeholder="Write your answer..."
                        multiline
                        value={
                          typeof studentAnswer[item.quizId] === "string"
                            ? (studentAnswer[item.quizId] as string)
                            : ""
                        }
                        editable={false}
                        style={{
                          marginTop: 10,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 5,
                          padding: 10,
                          textAlignVertical: "top",
                          minHeight: 100,
                        }}
                      />
                    </View>
                  )}

                  {item.type === "file_upload" && (
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#FFBF18",
                          width: 150,
                          alignItems: "center",
                          padding: 10,
                          borderRadius: 20,
                          flexDirection: "row",
                          marginVertical: 20,
                          columnGap: 10,
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          const answer = studentAnswer[item.quizId];
                          if (typeof answer === "string") {
                            handleDownload(answer);
                          }
                        }}
                      >
                        <Feather name="download" size={24} color="#fff" />
                        <Text style={[globalStyles.text1, { color: "#fff" }]}>
                          Download
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#FFBF18",
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={globalStyles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default QuizScore;
