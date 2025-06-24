import LoadingCard from "@/components/loadingCard";
import QuestionCard from "@/components/QuestionCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { continueQuiz, submitAnswer, takeQuiz } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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

  const { subjectId, quizId, prevAttemptId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
    prevAttemptId: string;
  }>();

  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<
    {
      itemId: string;
      answer: string | string[];
      file: FileInfo[] | null;
      hasChanged: boolean;
    }[]
  >([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>("");

  const handleNext = async () => {
    const currentAnswer = answers[currentItem];

    if (currentAnswer && currentAnswer.hasChanged) {
      const { itemId, answer, file } = currentAnswer;

      if (answer !== null || (file && file.length > 0)) {
        try {
          await submitAnswer(
            subjectId,
            quizId,
            attemptId,
            itemId,
            answer,
            file,
          );

          setAnswers((prev) =>
            prev.map((a) =>
              a.itemId === itemId ? { ...a, hasChanged: false } : a,
            ),
          );
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
      const res = prevAttemptId.length
        ? await continueQuiz(subjectId, quizId, prevAttemptId)
        : await takeQuiz(subjectId, quizId);

      console.log(res);

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
      if (Array.isArray(res.answers) && res.answers.length > 0) {
        setAnswers(
          res.answers.map((a: any) => ({
            ...a,
            hasChanged: false,
          })),
        );
      } else {
        setAnswers([]);
      }

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
      const existing = index > -1 ? prev[index] : null;

      const isSameAnswer =
        JSON.stringify(existing?.answer ?? "") === JSON.stringify(answer);
      const isSameFile =
        JSON.stringify(existing?.file ?? []) === JSON.stringify(file ?? []);

      const isEmptyAnswer =
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0);
      const isEmptyFile = !file || file.length === 0;

      if (isEmptyAnswer && isEmptyFile) {
        return prev;
      }

      if (existing && isSameAnswer && isSameFile) {
        return prev;
      }

      const updatedAnswer = { itemId, answer, file, hasChanged: true };

      if (existing) {
        const updated = [...prev];
        updated[index] = updatedAnswer;
        return updated;
      }

      return [...prev, updatedAnswer];
    });
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
    <ScrollView style={{ paddingTop: 20, backgroundColor: "#fff" }}>
      <QuestionCard
        key={quizItems[currentItem].id}
        item_no={currentItem + 1}
        question={quizItems[currentItem].question}
        type={quizItems[currentItem].type}
        multiple_type={quizItems[currentItem].multiple_type}
        choices={quizItems[currentItem].choices ?? []}
        answer={answers.find(
          (answer) => answer.itemId === quizItems[currentItem].id,
        )}
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
            // currentItem === 0
            globalStyles.inactivityButton,
            // : globalStyles.submitButton,
            { width: "48%", alignItems: "center" },
          ]}
          onPress={handlePrev}
        >
          <Text
            style={[
              // currentItem === 0
              globalStyles.inactivityButtonText,
              // : globalStyles.submitButtonText,
              { fontSize: 16, fontWeight: "bold" },
            ]}
          >
            Prev
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.submitButton,
            { width: "48%", alignItems: "center" },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              // globalStyles.submitButtonText,
              {
                fontSize: 16,
                textAlign: "center",
                color: "#fff",
                top: 3,
                fontWeight: "bold",
              },
            ]}
          >
            {currentItem === quizItems.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TakeQuiz;
