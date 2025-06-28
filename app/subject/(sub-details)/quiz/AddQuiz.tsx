import QuizFooter from "@/app/subject/(sub-details)/quiz/QuizFooter";
import QuizHeader from "@/app/subject/(sub-details)/quiz/QuizHeader";
import FileUpload from "@/components/FileUpload";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createQuiz, getQuiz, updateQuiz } from "@/utils/query";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface QuizInfo {
  title: string;
  description: string;
  deadline: string;
  availableFrom: string;
  availableTo: string;
  attempts: number;
  access_code: string;
  time_limit: string;
  show_answer: boolean;
}

interface QuizItem {
  id: string;
  item_id?: string;
  question: string;
  question_image: FileInfo[] | null;
  choices: string[];
  answer: string[];
  questionType:
    | "multiple_choice"
    | "multiple_multiple"
    | "essay"
    | "file_upload"
    | "fill"
    | "dropdown";
  points: number;
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
    deadline: "",
    availableFrom: "",
    availableTo: "",
    attempts: 1,
    access_code: "",
    time_limit: "",
    show_answer: false,
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

      if (
        item.questionType === "multiple_choice" ||
        item.questionType === "dropdown"
      ) {
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

    if (!quizInfo.description.trim()) {
      infoErrors.push({ name: "description", id: "" });
    }

    if (quizInfo.deadline.trim()) {
      console.log(quizInfo.deadline);
      console.log("Tjos ");
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const deadline = quizInfo.deadline.trim()
        ? new Date(quizInfo.deadline)
        : null;
      const availableFrom = quizInfo.availableFrom.trim()
        ? new Date(quizInfo.availableFrom)
        : null;
      const availableTo = quizInfo.availableTo.trim()
        ? new Date(quizInfo.availableTo)
        : null;

      if (deadline && !isNaN(deadline.getTime()) && deadline < now) {
        infoErrors.push({
          name: "deadline",
          id: "",
        });
      }

      if (availableFrom && !isNaN(availableFrom.getTime())) {
        if (availableTo && availableFrom > availableTo) {
          infoErrors.push({
            name: "availableFrom",
            id: "",
          });
        }
      } else {
        infoErrors.push({
          name: "availableFrom",
          id: "",
        });
      }

      if (availableTo && !isNaN(availableTo.getTime())) {
        if (availableFrom && availableTo < availableFrom) {
          infoErrors.push({
            name: "availableTo",
            id: "",
          });
        }
      } else {
        infoErrors.push({
          name: "availableTo",
          id: "",
        });
      }
    }

    if (infoErrors.length > 0) {
      console.log(infoErrors);
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
      Alert.alert("Error", "Something went wrong. Please try again.");
    }

    setIsCreating(false);
  };

  useEffect(() => {
    let hasChanges = false;

    const updated = quizItems.map((item) => {
      if (
        (item.questionType === "dropdown" || item.questionType === "fill") &&
        item.answer.length !== 1
      ) {
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
    console.log(quizId);
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
            deadline: res.quiz_info.deadline
              ? new Date(res.quiz_info.deadline).toString()
              : "",
            availableFrom: res.quiz_info.availableFrom
              ? new Date(res.quiz_info.availableFrom).toString()
              : "",
            availableTo: res.quiz_info.availableTo
              ? new Date(res.quiz_info.availableTo).toString()
              : "",
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
          setInfo={(info: QuizInfo) => setQuizInfo(info)}
          info={quizInfo}
          errors={inputErrors}
          setIsCreating={setIsCreating}
          isCreating={isCreating}
        />
      }
      renderItem={({ item, index }) => {
        const isFirst = index === 0;
        const isLast = index === quizItems.length - 1;

        return (
          <View
            style={[
              isFirst && {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderTopWidth: 1,
              },
              isLast && {
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderBottomWidth: 1,
              },
              {
                marginHorizontal: 20,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                padding: 20,
                borderColor: "#00000024",
                rowGap: 15,
              },
            ]}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={globalStyles.text1}>Question {index + 1}</Text>
                <TouchableOpacity>
                  <Ionicons
                    name="close-outline"
                    size={30}
                    color="black"
                    onPress={() => handleRemoveItem(item.id)}
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                {inputErrors.find((err) => err.id === item.id)?.name ===
                  "question" && (
                  <Text style={globalStyles.errorText}>
                    This field is required
                  </Text>
                )}
              </View>
              <TextInput
                value={item.question}
                onChangeText={(value) => handleQuestionInput(value, item.id)}
                style={[
                  { borderBottomWidth: 1, borderColor: "#FFBF18" },
                  inputErrors.find((err) => err.id === item.id)?.name ===
                  "question"
                    ? { borderColor: "red" }
                    : { borderColor: "#FFBF18" },
                ]}
                placeholder={"Enter Question"}
              />
              <View
                style={{
                  marginBottom: -100,
                  width: "90%",
                  marginHorizontal: "auto",
                }}
              >
                <FileUpload
                  handleFiles={(file: FileInfo[]) =>
                    handleQuestionImage(item.id, file)
                  }
                  fileTypes={"image/*"}
                />
              </View>
            </View>
            <View>
              <Text style={globalStyles.text1}>Points</Text>
              {inputErrors.some(
                (err) => err.id === item.id && err.name === "points",
              ) && (
                <Text style={globalStyles.errorText}>
                  Points must be at least 1.
                </Text>
              )}
              <TextInput
                value={item.points?.toString() || ""}
                onChangeText={(value) => {
                  const parsed = parseFloat(value);
                  setQuizItems((prev) =>
                    prev.map((quizItem) =>
                      quizItem.id === item.id
                        ? {
                            ...quizItem,
                            points: isNaN(parsed) ? 0 : parsed,
                          }
                        : quizItem,
                    ),
                  );
                }}
                keyboardType="numeric"
                style={[
                  globalStyles.inputContainer,
                  { width: 100 },
                  inputErrors.some(
                    (err) => err.id === item.id && err.name === "points",
                  ) && {
                    borderColor: "red",
                  },
                ]}
                placeholder={"Points"}
              />
            </View>

            <View>
              <Text style={globalStyles.text1}>Answer Type</Text>
              <View style={globalStyles.textInputContainer}>
                <Picker
                  selectedValue={item.questionType}
                  onValueChange={(value) =>
                    handleChangeQuestionType(
                      item.id,
                      value as QuizItem["questionType"],
                    )
                  }
                >
                  <Picker.Item
                    label="Multiple Choice (Radio)"
                    value="multiple_choice"
                  />
                  <Picker.Item
                    label="Multiple Choice (Checkboxes)"
                    value="multiple_multiple"
                  />
                  <Picker.Item label="Essay" value="essay" />
                  <Picker.Item label="File Upload" value="file_upload" />
                  <Picker.Item label="Fill in the Blank" value="fill" />
                  <Picker.Item label="Dropdown" value="dropdown" />
                </Picker>
              </View>
            </View>
            {(item.questionType === "multiple_choice" ||
              item.questionType === "dropdown" ||
              item.questionType === "multiple_multiple") && (
              <View>
                <Text style={globalStyles.text1}>Choices</Text>
                {item.choices.map((choice, choiceIndex) => (
                  <View
                    key={choiceIndex}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View style={{ width: "90%" }}>
                      {inputErrors.find(
                        (err) =>
                          err.id === item.id &&
                          err.name === "choices" &&
                          err.index === choiceIndex,
                      ) && (
                        <Text style={globalStyles.errorText}>
                          This field is required
                        </Text>
                      )}
                      <TextInput
                        value={choice}
                        onChangeText={(text) =>
                          handleChoiceInput(text, item.id, choiceIndex)
                        }
                        style={[
                          globalStyles.inputContainer,
                          inputErrors.find(
                            (err) =>
                              err.id === item.id &&
                              err.name === "choices" &&
                              err.index === choiceIndex,
                          )
                            ? { borderColor: "red" }
                            : { borderColor: "#FFBF18" },
                        ]}
                        placeholder={`Choice ${choiceIndex + 1}`}
                      />
                    </View>
                    <Ionicons
                      name="close-outline"
                      size={30}
                      color="black"
                      onPress={() => handleRemoveChoice(item.id, choiceIndex)}
                      style={{ marginLeft: 5 }}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => handleAddChoice(item.id)}
                >
                  <MaterialIcons name="add" size={24} color="#FFBF18" />
                  <Text style={[globalStyles.text1, { color: "#FFBF18" }]}>
                    Add Choice
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View>
              {item.questionType !== "essay" &&
                item.questionType !== "file_upload" && (
                  <Text style={globalStyles.text1}>Answer</Text>
                )}
              {(item.questionType === "multiple_choice" ||
                item.questionType === "dropdown" ||
                item.questionType === "multiple_multiple") && (
                <View style={{ rowGap: 10 }}>
                  <View
                    style={[globalStyles.textInputContainer, { rowGap: 5 }]}
                  >
                    {item.answer.map((answer, index) => (
                      <Picker
                        key={index}
                        selectedValue={answer}
                        onValueChange={(value) => {
                          setQuizItems((prev) =>
                            prev.map((q) => {
                              if (q.id !== item.id) return q;

                              const updatedAnswers = [...q.answer];
                              updatedAnswers[index] = value;

                              return {
                                ...q,
                                answer: updatedAnswers,
                              };
                            }),
                          );
                        }}
                      >
                        {item.choices.map((choice, i) => (
                          <Picker.Item label={choice} value={choice} key={i} />
                        ))}
                      </Picker>
                    ))}
                  </View>
                  {item.questionType === "multiple_multiple" && (
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center" }}
                      onPress={() => handleMultipleAnswer(item.id)}
                    >
                      <MaterialIcons name="add" size={24} color="#FFBF18" />
                      <Text style={[globalStyles.text1, { color: "#FFBF18" }]}>
                        Add Answer
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {item.questionType === "fill" && (
                <View>
                  {inputErrors.find((err) => err.id === item.id)?.name ===
                    "fill" && (
                    <Text style={globalStyles.errorText}>
                      This field is required
                    </Text>
                  )}
                  <TextInput
                    value={item.answer[0]}
                    style={[
                      { borderBottomWidth: 1 },
                      inputErrors.find(
                        (err) => err.id === item.id && err.name === "fill",
                      )
                        ? { borderColor: "red" }
                        : { borderColor: "#FFBF18" },
                    ]}
                    placeholder={"Enter Answer"}
                    onChangeText={(value: string) =>
                      handleAnswer(value, item.id)
                    }
                  />
                </View>
              )}
            </View>
            {!isLast && (
              <View
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: -20,
                  borderColor: "#00000024",
                  marginTop: 20,
                  paddingBottom: 0,
                }}
              ></View>
            )}
          </View>
        );
      }}
      ListFooterComponent={() => <QuizFooter onAddItem={handleAddItem} />}
    />
  );
};

export default AddQuiz;
