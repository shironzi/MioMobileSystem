import { ScrollView, Text, View } from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { useEffect, useState } from "react";
import { takeQuiz } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import QuestionCard from "@/components/QuestionCard";

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

const TakeQuiz = () => {
  HeaderConfigQuiz("Quiz");

  const [loading, setLoading] = useState(true);

  const { subjectId, quizId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
  }>();

  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<{ itemId: string; answer: any }[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);

  const handleNext = () => {
    if (currentItem >= quizItems.length - 1) return;

    setCurrentItem(currentItem + 1);
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

      setQuizItems(itemsArray);
      setLoading(false);
    };

    fetchQuiz();
  }, []);

  const handleAnswer = (itemId: string, answer: any) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.itemId === itemId);
      if (index > -1) {
        const updated = [...prev];
        updated[index].answer = answer;
        return updated;
      } else {
        return [...prev, { itemId, answer }];
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
    <ScrollView>
      <QuestionCard
        key={quizItems[currentItem].id}
        item_no={currentItem + 1}
        question={quizItems[currentItem].question}
        type={quizItems[currentItem].type}
        multiple_type={quizItems[currentItem].multiple_type}
        choices={quizItems[currentItem].choices ?? []}
        onAnswerChange={(answer) =>
          handleAnswer(quizItems[currentItem].id, answer)
        }
      />
    </ScrollView>
  );
};

export default TakeQuiz;
