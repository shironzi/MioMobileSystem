import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { DatePickerField } from "@/components/DatePickerField";
import globalStyles from "@/styles/globalStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuizQuestion from "@/components/QuizQuestion";
import { getQuizById } from "@/utils/query";

interface InputErrorState {
  deadline: boolean;
  availabilityFrom: boolean;
  availabilityTo: boolean;
  attempt: boolean;
  title: boolean;
  description: boolean;
}

const AddQuiz = () => {
  useHeaderConfig("Quiz");
  const router = useRouter();

  const { quizId, subjectId } = useLocalSearchParams<{
    quizId: string;
    subjectId: string;
  }>();

  const [deadline, setDeadline] = useState<Date | null>(null);
  const [availabilityFrom, setAvailabilityFrom] = useState<Date | null>(null);
  const [availabilityTo, setAvailabilityTo] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState<number>(1);
  const [points, setPoints] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descHeight, setDescHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<
    {
      questionId: string | null;
      question: string;
      options: string[];
      answer: string;
      type: string;
    }[]
  >([{ questionId: null, question: "", options: [], answer: "", type: "" }]);

  const [error, setError] = useState<InputErrorState>({
    deadline: false,
    availabilityFrom: false,
    availabilityTo: false,
    attempt: false,
    title: false,
    description: false,
  });

  const handleAddAttempt = () => {
    setAttempt(attempt + 1);
  };

  const handleMinusAttempt = () => {
    if (attempt > 1) {
      setAttempt(attempt - 1);
    }
  };

  const sanitizeAttemptInput = (raw: string, prev: number): number => {
    if (raw === "") return 1;

    const digitsOnly = raw.replace(/\D/g, "");
    if (digitsOnly === "") {
      return 1;
    }

    const n = parseInt(digitsOnly, 10);
    const clamped = n < 1 ? 1 : n;

    return clamped;
  };

  //   const [quizItems, setQuizItems] = useState<{ question: string; answer: string }[]>([]);

  const handlePreviewAssignment = async () => {
    setError({
      deadline: false,
      availabilityFrom: false,
      availabilityTo: false,
      attempt: false,
      title: false,
      description: false,
    });

    let hasError = false;

    if (!(deadline instanceof Date) || isNaN(deadline.getTime())) {
      setError((prev) => ({ ...prev, deadline: true }));
      hasError = true;
    }

    // if (
    //   !(availabilityFrom instanceof Date) ||
    //   isNaN(availabilityFrom.getTime())
    // ) {
    //   setError((prev) => ({ ...prev, availabilityFrom: true }));
    //   hasError = true;
    // }

    // if (!(availabilityTo instanceof Date) || isNaN(availabilityTo.getTime())) {
    //   setError((prev) => ({ ...prev, availabilityTo: true }));
    //   hasError = true;
    // }

    if (
      !title ||
      title.trim().length === 0 ||
      description.trim().length > 250
    ) {
      setError((prev) => ({ ...prev, title: true }));
      hasError = true;
    }

    if (
      !description ||
      description.trim().length === 0 ||
      description.trim().length > 1000
    ) {
      setError((prev) => ({ ...prev, description: true }));
      hasError = true;
    }

    if (!attempt || attempt < 1) {
      setError((prev) => ({ ...prev, attempt: true }));
      hasError = true;
    }

    if (hasError) return;

    router.push({
      pathname: "/subject/(sub-details)/assignment/AssignmentPreview",
      params: {
        subjectId,
        availabilityFrom: availabilityFrom?.toISOString() ?? null,
        availabilityTo: availabilityTo?.toISOString() ?? null,
        deadline: deadline?.toISOString() ?? null,
        title: title,
        description: description,
        attempt: attempt.toString(),
        points: points.toString(),
        quizId: quizId,
      },
    });
  };

  const handleAddQuiz = useCallback(
    (
      item: {
        questionId: string | null;
        question: string;
        options: string[];
        answer: string;
        type: string;
      },
      index: number,
    ) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[index] = item;
        return updated;
      });
    },
    [],
  );

  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      { questionId: null, question: "", options: [], answer: "", type: "" },
    ]);
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading..........</Text>
      </View>
    );
  }

  useEffect(() => {
    if (quizId !== null && subjectId !== null) {
      const fetchQuiz = async () => {
        try {
          const res = await getQuizById(subjectId, quizId);
          const data = res.quiz;

          // console.log(data);

          setTitle(data.title);
          setDescription(data.description);
          setAttempt(data.attempt ?? 1);
          setPoints(data.total ?? 1);
          setDeadline(data.deadline ? new Date(data.deadline) : null);

          // console.log(data.questions);

          const questionsArray = Object.entries(data.questions).map(
            ([questionId, q]) => ({
              questionId: questionId,
              // @ts-ignore
              question: q.question,
              // @ts-ignore
              options: q.options,
              // @ts-ignore
              answer: q.answer,
              // @ts-ignore
              type: q.type,
            }),
          );

          setQuestions(questionsArray);

          // console.log(questionsArray);
          // data.questions.map((item: Object) => {
          //   console.log(item);
          //   console.log();
          // });
          // setQuestions(
          //   data.options.map(
          //     (item: {
          //       question: string;
          //       options: string[];
          //       answer: string;
          //       type: string;
          //     }) => ({
          //       question: item.question,
          //       options: item.options,
          //       answer: item.answer,
          //       type: item.type,
          //     }),
          //   ),
          // );
        } catch (err) {
          console.error("Fetch Quiz By Id Failed:", err);
        }
      };

      fetchQuiz();
    }
  }, [quizId, subjectId]);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ rowGap: 15, paddingBottom: 15 }}>
        <View style={[globalStyles.cardContainer, { rowGap: 15 }]}>
          <View
            style={[styles.row, error.deadline ? { borderColor: "red" } : {}]}
          >
            <Text style={globalStyles.textLabel}>Deadline</Text>
            <DatePickerField
              date={deadline}
              onChange={setDeadline}
              error={error.deadline}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.row}>
            <Text style={globalStyles.textLabel}>Availability From</Text>
            <DatePickerField
              date={availabilityFrom}
              onChange={setAvailabilityFrom}
              error={error.availabilityFrom}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.row}>
            <Text style={globalStyles.textLabel}>Availability To</Text>
            <DatePickerField
              date={availabilityTo}
              onChange={setAvailabilityTo}
              error={error.availabilityTo}
              style={styles.dropdown}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={globalStyles.textLabel}>Attempts</Text>
            <View
              style={[
                {
                  width: "55%",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "#f9f9f9",
                  flexDirection: "row",
                  height: 50,
                },
                error.attempt
                  ? { borderColor: "red", borderWidth: 1 }
                  : { borderColor: "#ddd" },
              ]}
            >
              <TextInput
                style={{ width: "85%" }}
                value={attempt.toString()}
                onChangeText={(text) =>
                  setAttempt((prev: number) => sanitizeAttemptInput(text, prev))
                }
                keyboardType={"numeric"}
              />
              <View style={{ marginVertical: "auto" }}>
                <TouchableOpacity onPress={handleAddAttempt}>
                  <MaterialIcons
                    name="arrow-drop-up"
                    size={25}
                    color="#ffbf18"
                    style={{ marginTop: 0 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMinusAttempt}>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={25}
                    color="#ffbf18"
                    style={{ marginTop: -10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={globalStyles.textLabel}>Points</Text>
            <TextInput
              style={[
                styles.dropdown,
                error.title
                  ? { borderColor: "red", borderWidth: 1 }
                  : { borderColor: "#ddd" },
              ]}
              placeholder="Title"
              placeholderTextColor="#aaa"
              value={points.toString()}
              onChangeText={(text) =>
                setPoints((prev: number) => sanitizeAttemptInput(text, prev))
              }
            />
          </View>

          <View style={styles.separator}></View>

          <View style={styles.row}>
            <Text style={globalStyles.textLabel}>Title</Text>
            <TextInput
              style={[
                styles.dropdown,
                error.title
                  ? { borderColor: "red", borderWidth: 1 }
                  : { borderColor: "#ddd" },
              ]}
              placeholder="Title"
              placeholderTextColor="#aaa"
              multiline={true}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={{ rowGap: 5 }}>
            <Text style={globalStyles.textLabel}>Description</Text>
            <TextInput
              style={[
                globalStyles.inputContainer,
                { height: Math.max(150, descHeight) },
                error.description
                  ? { borderColor: "red", borderWidth: 1 }
                  : { borderColor: "#ddd" },
              ]}
              onContentSizeChange={(e) =>
                setDescHeight(e.nativeEvent.contentSize.height)
              }
              textAlignVertical="top"
              placeholder="Description"
              placeholderTextColor="#aaa"
              multiline={true}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              { flexDirection: "row", justifyContent: "center" },
            ]}
            onPress={handlePreviewAssignment}
          >
            <Text style={globalStyles.submitButtonText}>Preview</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.cardContainer}>
          <Text>Quiz Questions</Text>

          {questions.map((data, index) => (
            <QuizQuestion
              questionData={data}
              key={index}
              questionIndex={index}
              handleAddQuestion={(
                questionId: string | null,
                question,
                choices,
                answer,
                type,
              ) => {
                handleAddQuiz(
                  { questionId, question, options: choices, answer, type },
                  index,
                );
              }}
            />
          ))}
          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handleAddQuestion}
          >
            <Text style={globalStyles.submitButtonText}>Add Question</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    height: 3,
    backgroundColor: "#f0f0f0",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "55%",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    width: "55%",
  },
  dropdownList: {
    position: "absolute",
    top: 75,
    left: 161,
    width: "55%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default memo(AddQuiz);
