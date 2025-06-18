import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import QuizFooter from "@/app/subject/(sub-details)/quiz/QuizFooter";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createQuiz } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import useDebouncedCallback from "@/utils/useDebounceCallback";

interface QuizInfo {
  title: string;
  description: string;
  deadline: string;
  availableFrom: string;
  availableTo: string;
  attempts: number;
  access_code: string;
  time_limit: string;
}

interface QuizItem {
  id: string;
  question: string;
  choices: string[];
  answer: string[];
  questionType:
    | "multiple_choice"
    | "essay"
    | "file_upload"
    | "fill"
    | "dropdown";
  multiple_type: "radio" | "checkbox";
  points: number;
}

interface QuizItemError {
  name: string;
  id: string;
  index?: number;
}

const AddQuiz = () => {
  useHeaderConfig("Quiz");

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    title: "",
    description: "",
    deadline: "",
    availableFrom: "",
    availableTo: "",
    attempts: 1,
    access_code: "",
    time_limit: "",
  });

  const [quizItems, setQuizItems] = useState<QuizItem[]>([
    {
      id: Date.now().toString(),
      question: "",
      choices: [""],
      answer: [""],
      questionType: "multiple_choice",
      multiple_type: "radio",
      points: 1,
    },
  ]);

  const [isKeyboardActive, setIsKeyboardActive] = useState<boolean>(true);

  const [inputErrors, setInputErrors] = useState<QuizItemError[]>([]);

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

  const handleMultipleAnswer = (itemId: string) => {
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

  const handleChangeMultipleType = (
    itemId: string,
    newType: QuizItem["multiple_type"],
  ) => {
    setQuizItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, multiple_type: newType } : item,
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

    if (!quizInfo.deadline.trim()) {
      infoErrors.push({ name: "deadline", id: "" });
    }

    if (!quizInfo.availableFrom.trim()) {
      infoErrors.push({ name: "availableFrom", id: "" });
    }

    if (!quizInfo.availableTo.trim()) {
      infoErrors.push({ name: "availableTo", id: "" });
    }

    const now = new Date();
    const deadline = new Date(quizInfo.deadline);
    const availableFrom = new Date(quizInfo.availableFrom);
    const availableTo = new Date(quizInfo.availableTo);

    if (!isNaN(deadline.getTime()) && deadline < now) {
      infoErrors.push({ name: "deadline", id: "" });
    }

    if (
      !isNaN(availableFrom.getTime()) &&
      !isNaN(availableTo.getTime()) &&
      availableFrom > availableTo
    ) {
      infoErrors.push({ name: "availableFrom", id: "" });
      infoErrors.push({ name: "availableTo", id: "" });
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

    const res = await createQuiz(subjectId, quizInfo, quizItems);
    console.log(res);
  };

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showAvailableFromPicker, setShowAvailableFromPicker] = useState(false);
  const [showAvailableToPicker, setShowAvailableToPicker] = useState(false);

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

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
  //     setIsKeyboardActive(true);
  //   });
  //   const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
  //     setIsKeyboardActive(false);
  //   });
  //
  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  const debouncedTitle = useDebouncedCallback(quizInfo.title, 300);

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={quizItems}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: "#fff" }}
      ListHeaderComponent={() => (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#00000024",
            margin: 20,
            padding: 20,
            borderRadius: 20,
            backgroundColor: "#fff",
            gap: 15,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "25%" }]}>Title</Text>
            <View style={{ width: "75%" }}>
              {inputErrors.find((err) => err.name === "title") && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <TextInput
                value={quizInfo.title}
                onChangeText={(value) => {
                  setQuizInfo((prev) => ({
                    ...prev,
                    title: value,
                  }));
                }}
                placeholder="Title"
                style={globalStyles.inputContainer}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "25%" }]}>
              Description
            </Text>
            <View style={{ width: "75%" }}>
              {inputErrors.find((err) => err.name === "description") && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <TextInput
                value={quizInfo.description}
                onChangeText={(value) =>
                  setQuizInfo((prev) => ({ ...prev, description: value }))
                }
                style={[
                  globalStyles.inputContainer,
                  inputErrors.find((err) => err.name === "description") && {
                    borderColor: "red",
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              marginHorizontal: -20,
              borderColor: "#00000024",
            }}
          ></View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "40%" }]}>Deadline</Text>
            <TouchableOpacity
              onPress={() => setShowDeadlinePicker(true)}
              style={[globalStyles.inputContainer, { width: "60%" }]}
            >
              <Text>
                {quizInfo.deadline
                  ? new Date(quizInfo.deadline).toDateString()
                  : "Set Deadline"}
              </Text>
            </TouchableOpacity>
            {showDeadlinePicker && (
              <DateTimePicker
                value={
                  quizInfo.deadline ? new Date(quizInfo.deadline) : new Date()
                }
                mode="date"
                display={"default"}
                onChange={(event, selectedDate) => {
                  setShowDeadlinePicker(false);
                  if (selectedDate) {
                    setQuizInfo((prev) => ({
                      ...prev,
                      deadline: selectedDate.toISOString(),
                    }));
                  }
                }}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "40%" }]}>
              Available From
            </Text>
            <TouchableOpacity
              onPress={() => setShowAvailableFromPicker(true)}
              style={[globalStyles.inputContainer, { width: "60%" }]}
            >
              <Text>
                {quizInfo.availableFrom
                  ? new Date(quizInfo.availableFrom).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Set Available To"}
              </Text>
            </TouchableOpacity>
            {showAvailableFromPicker && (
              <DateTimePicker
                value={
                  quizInfo.availableFrom
                    ? new Date(quizInfo.availableFrom)
                    : new Date()
                }
                mode="time"
                display={"default"}
                onChange={(event, selectedDate) => {
                  setShowAvailableFromPicker(false);
                  if (selectedDate) {
                    setQuizInfo((prev) => ({
                      ...prev,
                      availableFrom: selectedDate.toISOString(),
                    }));
                  }
                }}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "40%" }]}>
              Available To
            </Text>
            <View style={{ width: "60%" }}>
              <TouchableOpacity
                onPress={() => setShowAvailableToPicker(true)}
                style={[globalStyles.inputContainer]}
              >
                <Text>
                  {quizInfo.availableTo
                    ? new Date(quizInfo.availableTo).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Set Available To"}
                </Text>
              </TouchableOpacity>
            </View>
            {showAvailableToPicker && (
              <DateTimePicker
                value={
                  quizInfo.availableTo
                    ? new Date(quizInfo.availableTo)
                    : new Date()
                }
                mode="time"
                display={"default"}
                onChange={(event, selectedDate) => {
                  setShowAvailableToPicker(false);
                  if (selectedDate) {
                    setQuizInfo((prev) => ({
                      ...prev,
                      availableTo: selectedDate.toISOString(),
                    }));
                  }
                }}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "40%" }]}>Attempts</Text>
            <TextInput
              value={quizInfo.attempts.toString()}
              onChangeText={(value: string) => {
                const num = parseInt(value);
                setQuizInfo((prev) => ({
                  ...prev,
                  attempts: isNaN(num) ? 1 : num,
                }));
              }}
              keyboardType="numeric"
              style={[globalStyles.inputContainer, { width: "60%" }]}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[globalStyles.title, { width: "40%" }]}>
              Time Limit
            </Text>
            <TextInput
              value={quizInfo.time_limit}
              onChangeText={(value: string) => {
                setQuizInfo((prev) => ({
                  ...prev,
                  time_limit: value,
                }));
              }}
              keyboardType="numeric"
              placeholder="in minutes"
              style={[globalStyles.inputContainer, { width: "60%" }]}
            />
          </View>

          <View>
            <TouchableOpacity
              style={globalStyles.submitButton}
              onPress={() => handleCreateQuiz()}
            >
              <Text style={globalStyles.submitButtonText}>Create Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
                    label="Multiple Choice"
                    value="multiple_choice"
                  />
                  <Picker.Item label="Essay" value="essay" />
                  <Picker.Item label="File Upload" value="file_upload" />
                  <Picker.Item label="Fill in the Blank" value="fill" />
                  <Picker.Item label="Dropdown" value="dropdown" />
                </Picker>
              </View>
            </View>

            {item.questionType === "multiple_choice" && (
              <View>
                <Text style={globalStyles.text1}>Multiple Type</Text>
                <View style={globalStyles.textInputContainer}>
                  <Picker
                    selectedValue={item.multiple_type}
                    onValueChange={(value) =>
                      handleChangeMultipleType(
                        item.id,
                        value as QuizItem["multiple_type"],
                      )
                    }
                  >
                    <Picker.Item label="Radio" value="radio" />
                    <Picker.Item label="Checkbox" value="checkbox" />
                  </Picker>
                </View>
              </View>
            )}

            {(item.questionType === "multiple_choice" ||
              item.questionType === "dropdown") && (
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
                item.questionType === "dropdown") && (
                <View style={{ rowGap: 10 }}>
                  <View style={[globalStyles.textInputContainer]}>
                    {item.answer.map((answer, index) => (
                      <Picker
                        key={index}
                        selectedValue={item.answer[0] || ""}
                        onValueChange={(value) => {
                          setQuizItems((prev) =>
                            prev.map((q) =>
                              q.id === item.id ? { ...q, answer: [value] } : q,
                            ),
                          );
                        }}
                      >
                        {item.choices.map((choice, i) => (
                          <Picker.Item label={choice} value={choice} key={i} />
                        ))}
                      </Picker>
                    ))}
                  </View>
                  {item.multiple_type === "checkbox" && (
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
