import QuizFooter from "@/app/subject/(sub-details)/quiz/QuizFooter";
import QuizHeader from "@/app/subject/(sub-details)/quiz/QuizHeader";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createQuiz, getQuiz, updateQuiz } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import QuizItem from "@/app/subject/(sub-details)/quiz/QuizItem";
import { getDateFromTime } from "@/utils/DateFormat";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface QuizInfo {
  title: string;
  description: string;
  deadline: Date | null;
  publish: Date | null;
  availableFrom: Date | null;
  availableTo: Date | null;
  attempts: number;
  access_code: string;
  time_limit: string;
  show_answer: boolean;
  visibility: string;
}

interface QuizItemError {
  name: string;
  id: string;
  index?: number;
}

const AddQuiz = () => {
  useHeaderConfig("Quiz");

  const { subjectId, quizId } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
  }>();

  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    title: "",
    description: "",
    deadline: null,
    publish: new Date(),
    availableFrom: null,
    availableTo: null,
    attempts: 1,
    access_code: "",
    time_limit: "",
    show_answer: false,
    visibility: "private",
  });

  const [quizItems, setQuizItems] = useState<QuizItem[]>([
    {
      id: Date.now().toString(),
      question: "",
      question_image: null,
      choices: [""],
      answer: [""],
      questionType: "multiple_choice",
      points: 1,
    },
  ]);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<QuizItemError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePointsInput = (value: string, id: string) => {
    const parsed = parseFloat(value);
    setQuizItems((prev) =>
      prev.map((quizItem) =>
        quizItem.id === id
          ? {
              ...quizItem,
              points: isNaN(parsed) ? 0 : parsed,
            }
          : quizItem,
      ),
    );
  };

  const handleQuestionInput = (value: string, id: string) => {
    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, question: value } : item,
      ),
    );

    setInputErrors((prev) =>
      prev.filter((err) => !(err.id === id && err.name === "question")),
    );
  };

  const handleChoiceInput = (
    text: string,
    itemId: string,
    choiceIndex: number,
  ) => {
    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              choices: item.choices.map((choice, idx) =>
                idx === choiceIndex ? text : choice,
              ),
            }
          : item,
      ),
    );
  };

  const handleRemoveChoice = (itemId: string, choiceIndex: number) => {
    const item = quizItems.find((item) => item.id === itemId);

    if (!item || item.choices.length <= 1) return;

    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              choices: item.choices.filter((_, idx) => idx !== choiceIndex),
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setQuizItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddChoice = (itemId: string) => {
    setQuizItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const lastChoice = item.choices[item.choices.length - 1];

          if (!lastChoice || !lastChoice.trim()) {
            setInputErrors((prevErrors) => [
              ...prevErrors,
              {
                name: "choices",
                id: item.id,
                index: item.choices.length - 1,
              },
            ]);
            return item;
          }

          setInputErrors((prevErrors) =>
            prevErrors.filter(
              (err) =>
                !(
                  err.name === "choices" &&
                  err.id === item.id &&
                  err.index === item.choices.length - 1
                ),
            ),
          );

          return { ...item, choices: [...item.choices, ""] };
        }
        return item;
      }),
    );
  };

  const handleQuestionImage = (itemId: string, file: FileInfo[]) => {
    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              question_image: file,
            }
          : item,
      ),
    );
  };

  const handleMultipleAnswer = (itemId: string) => {
    const totalChoices =
      quizItems.find((item) => item.id === itemId)?.choices.length ?? 0;
    const totalAnswers =
      quizItems.find((item) => item.id === itemId)?.answer.length ?? 0;
    if (totalAnswers > totalChoices) {
    }

    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, answer: [...item.answer, ""] } : item,
      ),
    );
  };

  const handleQuestionType = (value: string, id: string, index: number) => {
    setQuizItems((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updatedAnswers = [...q.answer];
        updatedAnswers[index] = value;

        return {
          ...q,
          answer: updatedAnswers,
        };
      }),
    );
  };

  const handleChangeQuestionType = (
    itemId: string,
    newType: QuizItem["questionType"],
  ) => {
    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, questionType: newType } : item,
      ),
    );
  };

  const handleAnswer = (value: string, itemId: string) => {
    setQuizItems((prev) =>
      prev.map((quizItem) =>
        quizItem.id === itemId ? { ...quizItem, answer: [value] } : quizItem,
      ),
    );
  };

  const validateQuizItems = (items: QuizItem[]) => {
    const errors: { name: string; id: string; index?: number }[] = [];
    let hasError = false;

    items.forEach((item) => {
      if (!item.question.trim()) {
        hasError = true;
        errors.push({ name: "question", id: item.id });
      }

      if (!item.points || item.points < 1) {
        hasError = true;
        errors.push({ name: "points", id: item.id });
      }

      if (item.questionType === "multiple_choice") {
        if (item.choices.length < 1) {
          hasError = true;
          errors.push({ name: "choices_length", id: item.id });
        }

        item.choices.forEach((choice, index) => {
          if (!choice.trim()) {
            hasError = true;
            errors.push({ name: "choices", id: item.id, index });
          }
        });
      }

      if (item.questionType === "fill" && !item.answer[0].trim()) {
        hasError = true;
        errors.push({ name: "fill", id: item.id });
      }
    });

    return { hasError, errors };
  };

  const handleAddItem = () => {
    const { hasError, errors } = validateQuizItems(quizItems);

    if (hasError) {
      setInputErrors(errors);
      return;
    }

    setInputErrors([]);

    setQuizItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        question: "",
        question_image: null,
        choices: [""],
        answer: [""],
        questionType: "multiple_choice",
        multiple_type: "radio",
        points: 1,
      },
    ]);
  };

  const handleCreateQuiz = async () => {
    setInputErrors([]);

    const infoErrors: QuizItemError[] = [];
    if (!quizInfo.title.trim()) {
      infoErrors.push({ name: "title", id: "" });
    }

    if (infoErrors.length > 0) {
      setInputErrors((prev) => [...prev, ...infoErrors]);
      return;
    }

    const { hasError, errors } = validateQuizItems(quizItems);

    if (hasError) {
      setInputErrors(errors);
      return;
    }
    setInputErrors([]);

    setIsCreating(true);

    const res = quizId
      ? await updateQuiz(subjectId, quizId, quizInfo, quizItems)
      : await createQuiz(subjectId, quizInfo, quizItems);

    if (res.success) {
      Alert.alert(
        "Success",
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
    } else {
      Alert.alert("Message", "Something went wrong. Please try again later.");
    }

    setIsCreating(false);
  };

  useEffect(() => {
    let hasChanges = false;

    const updated = quizItems.map((item) => {
      if (item.questionType === "fill" && item.answer.length !== 1) {
        hasChanges = true;
        return { ...item, answer: [""] };
      }
      return item;
    });

    if (hasChanges) {
      setQuizItems(updated);
    }
  }, [quizItems]);

  useEffect(() => {
    if (quizId) {
      setLoading(true);
      const fetchQuiz = async () => {
        const res = await getQuiz(subjectId, quizId);

        if (res.success) {
          const items: QuizItem[] = res.items.map((item: any) => ({
            id: item.id,
            item_id: item.id,
            question: item.question,
            question_image: item.question_image || null,
            choices: item.options || [],
            answer:
              typeof item.answer === "string" ? [item.answer] : item.answer,
            questionType: item.questionType,
            multiple_type: item.multiple_type || "radio",
            points: item.points,
          }));

          const quizInfoData = {
            ...res.quiz_info,
            publish: new Date(res.quiz_info.publish),
            deadline: res.quiz_info.deadline
              ? new Date(res.quiz_info.deadline)
              : null,
            availableFrom: res.quiz_info.availableFrom
              ? getDateFromTime(res.quiz_info.availableFrom)
              : null,
            availableTo: res.quiz_info.availableTo
              ? getDateFromTime(res.quiz_info.availableTo)
              : null,
          };

          setQuizItems(items);
          setQuizInfo(quizInfoData);
        }
        setLoading(false);
      };

      fetchQuiz();
    }
  }, [quizId, subjectId]);

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
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={quizItems}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: "#fff" }}
      ListHeaderComponent={
        <QuizHeader
          handleCreateQuiz={handleCreateQuiz}
          setInfo={setQuizInfo}
          info={quizInfo}
          errors={inputErrors}
          setIsCreating={setIsCreating}
          isCreating={isCreating}
          quizId={quizId}
        />
      }
      renderItem={({ item, index }) => {
        const isFirst = index === 0;
        const isLast = index === quizItems.length - 1;

        return (
          <QuizItem
            isFirst={isFirst}
            isLast={isLast}
            index={index}
            handleRemoveItem={handleRemoveItem}
            item={item}
            inputErrors={inputErrors}
            handleQuestionInput={handleQuestionInput}
            handleQuestionImage={handleQuestionImage}
            handlePointsInput={handlePointsInput}
            handleChangeQuestionType={handleChangeQuestionType}
            handleChoiceInput={handleChoiceInput}
            handleRemoveChoice={handleRemoveChoice}
            handleAddChoice={handleAddChoice}
            handleMultipleAnswer={handleMultipleAnswer}
            handleAnswer={handleAnswer}
            handleQuestionType={handleQuestionType}
          />
        );
      }}
      ListFooterComponent={() => <QuizFooter onAddItem={handleAddItem} />}
    />
  );
};

export default AddQuiz;
