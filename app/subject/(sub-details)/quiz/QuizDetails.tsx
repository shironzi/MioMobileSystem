import AnswerQuizCard from "@/components/AnswerQuizCard";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getQuizById } from "@/utils/query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const QuizDetails = () => {
  useHeaderConfig("Quiz");

  const { subjectId, quizId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
  }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [deadline, setDeadline] = useState<string>();
  const [points, setPoints] = useState<number>();
  const [availability, setAvailability] = useState<string>();
  const [attempts, setAttempts] = useState<number>();
  const [description, setDescription] = useState<string>();
  const [questions, setQuestions] =
    useState<
      { question: string; options: string[]; answer: string; type: string }[]
    >();

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

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await getQuizById(subjectId, quizId);
      const data = res.quiz;
      setTitle(data.title);
      setDeadline(data.deadline);
      setPoints(data.total);
      setAttempts(data.attempts);
      setDescription(data.description);

      setQuestions(
        data.questions.map(
          (item: {
            question: string;
            options: string[];
            answer: string;
            type: string;
          }) => ({
            question: item.question,
            options: item.options,
            answer: item.answer,
            type: item.type,
          }),
        ),
      );
    };

    fetchQuiz();
  });

  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ rowGap: 15 }}>
        <View style={globalStyles.cardContainer}>
          <Text>title {title}</Text>
          <View>
            <Text>Deadline {deadline}</Text>
            <Text>Points {points}</Text>
          </View>
          <Text>Availability {availability}</Text>
          <Text>Attempts {attempts}</Text>
        </View>

        <View style={globalStyles.cardContainer}>
          <Text>Quiz Description</Text>
          <Text>{description}</Text>
        </View>

        <View>
          {questions?.map((item, index) => (
            <View style={globalStyles.cardContainer}>
              <AnswerQuizCard
                key={index}
                question={item.question}
                choices={item.options}
                type={item.type}
                questionNum={index}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(QuizDetails);
