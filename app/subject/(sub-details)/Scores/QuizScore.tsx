import { downloadAndSaveFile } from "@/app/subject/(sub-details)/Scores/DownloadFile";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getStudentQuizAttempt, updateStudentQuiz } from "@/utils/query";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingCard from "@/components/loadingCard";

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
  is_correct?: boolean;
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
  const [student_score, setStudent_score] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<{
    [key: string]: string | string[];
  }>({});
  const [studentScores, setStudentScores] = useState<{
    [key: string]: number;
  }>({});
  const [noQuiz, setNoQuiz] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await getStudentQuizAttempt(subjectId, activityId, studentId);

      console.log(res);
      if (res.success) {
        setDescription(res.description);
        setTotal(res.total);
        setStudent_score(res.student_score);

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
            is_correct: res.answers[key]?.is_correct,
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

        const initialScores: { [key: string]: number } = {};
        Object.entries(res.answers).forEach(([key, value]: [string, any]) => {
          if (value.is_correct === true) {
            initialScores[key] = value.points;
          } else if (value.is_correct === false) {
            initialScores[key] = 0;
          }
        });

        setStudentScores(initialScores);
      } else {
        setNoQuiz(true);
      }
      setLoading(false);
    };

    fetchScores();
  }, [activityType, subjectId, activityId, studentId]);

  const handleDownload = (work: string) => {
    downloadAndSaveFile(work);
  };

  const handleSubmit = async () => {
    if (!quizItems) return;

    const validationErrors: string[] = [];

    quizItems.forEach((quizItem, index) => {
      const score = studentScores[quizItem.quizId];

      if (score === undefined || score === null) {
        validationErrors.push(`Question ${index + 1}: Score is required`);
        return;
      }

      if (score > quizItem.points) {
        validationErrors.push(
          `Question ${index + 1}: Score (${score}) cannot exceed maximum points (${quizItem.points})`,
        );
      }

      if (score < 0) {
        validationErrors.push(
          `Question ${index + 1}: Score cannot be negative`,
        );
      }
    });

    if (validationErrors.length > 0) {
      return;
    }

    const transformedData = Object.entries(studentScores).map(
      ([id, score]) => ({
        itemId: id,
        score: score,
      }),
    );
    try {
      const res = await updateStudentQuiz(
        subjectId,
        activityId,
        studentId,
        transformedData,
      );

      if (res.success) {
        Alert.alert(
          "Success",
          activityId
            ? "Successfully updated the activity"
            : "Successfully created the activity",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

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
    <ScrollView style={{ backgroundColor: "#fff", padding: 20 }}>
      {noQuiz ? (
        <View>
          <Text>No Available Quiz Attempt</Text>
        </View>
      ) : (
        <View style={{ marginBottom: 60 }}>
          <View>
            <Text>Score</Text>
          </View>

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
                            backgroundColor:
                              item.is_correct === true
                                ? "#e8f5e8"
                                : item.is_correct === false
                                  ? "#ffe8e8"
                                  : "#fff",
                            color:
                              item.is_correct === true
                                ? "#666"
                                : item.is_correct === false
                                  ? "#666"
                                  : "#000",
                          },
                        ]}
                        keyboardType="numeric"
                        editable={
                          item.is_correct === undefined ||
                          item.is_correct === null
                        }
                        value={
                          studentScores[item.quizId] !== undefined
                            ? String(studentScores[item.quizId])
                            : ""
                        }
                        onChangeText={(value: string) => {
                          if (
                            item.is_correct === true ||
                            item.is_correct === false
                          )
                            return;

                          const numericValue = parseFloat(value);

                          if (!isNaN(numericValue) && value.trim() !== "") {
                            setStudentScores((prev) => ({
                              ...prev,
                              [item.quizId]: numericValue,
                            }));
                          } else if (value === "") {
                            setStudentScores((prev) => {
                              const newScores = { ...prev };
                              delete newScores[item.quizId];
                              return newScores;
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
                        {Array.isArray(item.options) &&
                        item.options.length > 0 ? (
                          item.options.map((option, index) => (
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
                                studentAnswer[item.quizId] === option &&
                                item.answer === option
                                  ? { backgroundColor: "#d4edda" }
                                  : studentAnswer[item.quizId] === option
                                    ? { backgroundColor: "#f8d7da" }
                                    : item.answer === option
                                      ? { backgroundColor: "#d4edda" }
                                      : { backgroundColor: "#fff" },
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
                          ))
                        ) : (
                          <Text></Text>
                        )}
                      </View>
                    )}

                    {item.type === "multiple_multiple" && (
                      <View style={{ marginTop: 20 }}>
                        {item.options?.map((option, index) => {
                          const isStudentSelected = (
                            studentAnswer[item.quizId] as string[]
                          )?.includes(option);
                          const isCorrectAnswer = (
                            item.answer as string[]
                          )?.includes(option);

                          return (
                            <View
                              style={[
                                {
                                  flexDirection: "row",
                                  columnGap: 5,
                                  padding: 10,
                                  borderRadius: 5,
                                  borderBottomWidth: 1,
                                  borderColor: "#00000024",
                                },
                                isStudentSelected && isCorrectAnswer
                                  ? {
                                      backgroundColor: "#d4edda",
                                    }
                                  : isStudentSelected && !isCorrectAnswer
                                    ? {
                                        backgroundColor: "#f8d7da",
                                      }
                                    : !isStudentSelected && isCorrectAnswer
                                      ? {
                                          backgroundColor: "#d4edda",
                                        }
                                      : { backgroundColor: "#fff" },
                              ]}
                              key={index}
                            >
                              <Ionicons
                                name={
                                  isStudentSelected
                                    ? "checkbox"
                                    : "checkbox-outline"
                                }
                                size={24}
                                color={isStudentSelected ? "#ffbf18" : "#aaa"}
                              />
                              <Text>{option}</Text>
                            </View>
                          );
                        })}
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
              <Text
                style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}
              >
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
      )}
    </ScrollView>
  );
};

export default QuizScore;
