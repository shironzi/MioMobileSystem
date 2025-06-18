import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { useEffect, useState } from "react";
import { submitAnswer, takeQuiz } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import QuestionCard from "@/components/QuestionCard";
import globalStyles from "@/styles/globalStyles";

export interface QuizItem {
  id: string;
  answer: string;
  answered_at: string;
  type: "multiple_choice" | "essay" | "file_upload" | "fill" | "dropdown";
  question: string;
  choices: { id: string; label: string }[];
  points: number;
  multiple_type?: "radio" | "checkbox";
}

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const TakeQuiz = () => {
  HeaderConfigQuiz("Quiz");

  const [loading, setLoading] = useState(true);

  const { subjectId, quizId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
  }>();

  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<
    { itemId: string | string[]; answer: any; file: FileInfo[] | null }[]
  >([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>("");

  const handleNext = async () => {
    const currentAnswer = answers[currentItem];

    if (currentAnswer) {
      const { itemId, answer, file } = currentAnswer;

      if (answer !== null || (file && file.length > 0)) {
        try {
          const res = await submitAnswer(
            subjectId,
            quizId,
            attemptId,
            typeof itemId === "string" ? itemId : itemId[0], // handle array fallback
            answer,
            file,
          );

          console.log("Submitted:", res);
        } catch (err) {
          console.error("Submission error:", err);
          return;
        }
      }
    }

    if (currentItem < quizItems.length - 1) {
      setCurrentItem((prev) => prev + 1);
    }

    if (currentItem === quizItems.length - 1) {
      router.push({
        pathname: "/subject/(sub-details)/quiz/QuizScore",
        params: { subjectId: subjectId, quizId: quizId, attemptId: attemptId },
      });
    }
  };

  const handlePrev = () => {
    if (currentItem < 1) return;

    setCurrentItem(currentItem - 1);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await takeQuiz(subjectId, quizId);

      const itemsArray: QuizItem[] = Object.entries(res.items).map(
        ([id, item]: [string, any]) => ({
          id,
          ...item,
          choices: item.choices
            ? Object.entries(item.choices).map(([key, value]) => ({
                id: key,
                label: value,
              }))
            : [],
        }),
      );

      setAttemptId(res.attemptId);
      setQuizItems(itemsArray);
      setLoading(false);
    };

    fetchQuiz();
  }, []);

  const handleAnswer = (
    itemId: string,
    answer: string | string[],
    file: FileInfo[] | null,
  ) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.itemId === itemId);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          answer,
          file,
        };
        return updated;
      } else {
        return [...prev, { itemId, answer, file }];
      }
    });
  };

  if (loading) {
    return (
      <View>
        <Text>Loading..........</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ paddingTop: 20 }}>
      <QuestionCard
        key={quizItems[currentItem].id}
        item_no={currentItem + 1}
        question={quizItems[currentItem].question}
        type={quizItems[currentItem].type}
        multiple_type={quizItems[currentItem].multiple_type}
        choices={quizItems[currentItem].choices ?? []}
        onAnswerChange={(answer, file) =>
          handleAnswer(quizItems[currentItem].id, answer, file ?? null)
        }
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          style={[
            currentItem === 0
              ? globalStyles.inactivityButton
              : globalStyles.submitButton,
            { width: "30%", alignItems: "center" },
          ]}
          onPress={handlePrev}
        >
          <Text
            style={[
              currentItem === 0
                ? globalStyles.inactivityButtonText
                : globalStyles.submitButtonText,
              { fontSize: 14 },
            ]}
          >
            Prev
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.submitButton,
            { width: "30%", alignItems: "center" },
          ]}
          onPress={handleNext}
        >
          <Text style={[globalStyles.submitButtonText, { fontSize: 14 }]}>
            {currentItem === quizItems.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TakeQuiz;
