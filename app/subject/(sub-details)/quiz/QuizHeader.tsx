import React, { useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import globalStyles from "@/styles/globalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface QuizItemError {
  name: string;
  id: string;
  index?: number;
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

interface QuizItemError {
  name: string;
  id: string;
  index?: number;
}

interface Props {
  handleCreateQuiz: (info: QuizInfo) => void;
  setInfo: (info: QuizInfo) => void;
  info: QuizInfo;
  errors: QuizItemError[];
  setIsCreating: (value: boolean) => void;
  isCreating: boolean;
  quizId: string;
}

const QuizHeader = ({
  handleCreateQuiz,
  info,
  errors,
  setInfo,
  setIsCreating,
  isCreating,
  quizId,
}: Props) => {
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showAvailableFromPicker, setShowAvailableFromPicker] = useState(false);
  const [showAvailableToPicker, setShowAvailableToPicker] = useState(false);

  const [quizInfo, setQuizInfo] = useState<QuizInfo>(info);
  useEffect(() => {
    setInfo(quizInfo);
  }, [quizInfo]);

  return (
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
          {errors.find((err) => err.name === "title") && (
            <Text style={globalStyles.errorText}>This field is required</Text>
          )}
          <TextInput
            value={quizInfo.title}
            onChangeText={(value) =>
              setQuizInfo((prev) => ({ ...prev, title: value }))
            }
            style={[
              globalStyles.inputContainer,
              errors.find((err) => err.name === "description") && {
                borderColor: "red",
              },
            ]}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={[globalStyles.title, { width: "25%" }]}>Description</Text>
        <View style={{ width: "75%" }}>
          {errors.find((err) => err.name === "description") && (
            <Text style={globalStyles.errorText}>This field is required</Text>
          )}
          <TextInput
            value={quizInfo.description}
            onChangeText={(value) =>
              setQuizInfo((prev) => ({ ...prev, description: value }))
            }
            style={[
              globalStyles.inputContainer,
              errors.find((err) => err.name === "description") && {
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
        <Text style={[globalStyles.title, { width: "40%" }]}>Access Code</Text>
        <View style={{ width: "60%" }}>
          <TextInput
            value={quizInfo.access_code}
            onChangeText={(value) =>
              setQuizInfo((prev) => ({ ...prev, access_code: value }))
            }
            style={[globalStyles.inputContainer]}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={[globalStyles.title, { width: "40%" }]}>Deadline</Text>
        <View style={{ width: "60%" }}>
          {errors.find((err) => err.name === "deadline") && (
            <Text style={globalStyles.errorText}>
              Deadline cannot be in the past
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setShowDeadlinePicker(true)}
            style={[
              globalStyles.inputContainer,
              errors.find((err) => err.name === "deadline") && {
                borderColor: "red",
              },
            ]}
          >
            <Text>
              {quizInfo.deadline
                ? new Date(quizInfo.deadline).toDateString()
                : "Set Deadline"}
            </Text>
          </TouchableOpacity>
        </View>
        {showDeadlinePicker && (
          <DateTimePicker
            value={quizInfo.deadline ? new Date(quizInfo.deadline) : new Date()}
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
        <View style={{ width: "60%" }}>
          {errors.find((err) => err.name === "availableFrom") && (
            <Text style={globalStyles.errorText}>
              Available From cannot be in the past
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setShowAvailableFromPicker(true)}
            style={[
              globalStyles.inputContainer,
              errors.find((err) => err.name === "availableFrom") && {
                borderColor: "red",
              },
            ]}
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
        </View>
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
        <Text style={[globalStyles.title, { width: "40%" }]}>Available To</Text>
        <View style={{ width: "60%" }}>
          {errors.find((err) => err.name === "availableTo") && (
            <Text style={globalStyles.errorText}>
              Available To cannot be earlier than Available From
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setShowAvailableToPicker(true)}
            style={[
              globalStyles.inputContainer,
              errors.find((err) => err.name === "availableTo") && {
                borderColor: "red",
              },
            ]}
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
              quizInfo.availableTo ? new Date(quizInfo.availableTo) : new Date()
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
        <Text style={[globalStyles.title, { width: "40%" }]}>Time Limit</Text>
        <View style={{ width: "60%" }}>
          <TextInput
            value={quizInfo.time_limit}
            onChangeText={(value: string) => {
              const positiveNumberPattern = /^[+]?\d*\.?\d*$/;
              if (value === "" || positiveNumberPattern.test(value)) {
                setQuizInfo((prev) => ({
                  ...prev,
                  time_limit: value,
                }));
              }
            }}
            keyboardType="numeric"
            placeholder="in minutes"
            style={[globalStyles.inputContainer]}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[globalStyles.title]}>Show Answer</Text>
        <TouchableOpacity
          onPress={() =>
            setQuizInfo((prev) => ({ ...prev, show_answer: !prev.show_answer }))
          }
        >
          {info.show_answer ? (
            <MaterialCommunityIcons
              name="toggle-switch"
              size={45}
              color="#FFBF18"
            />
          ) : (
            <MaterialCommunityIcons
              name="toggle-switch-off"
              size={45}
              color="black"
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={[
            globalStyles.submitButton,
            {
              width: "45%",
              borderWidth: 1,
              borderColor: "#FFBF18",
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => {
            isCreating ? router.back : null;
          }}
          disabled={isCreating}
        >
          <Text style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "45%" }]}
          onPress={() => {
            setIsCreating(true);
            handleCreateQuiz(quizInfo);
          }}
          disabled={isCreating}
        >
          <Text style={globalStyles.submitButtonText}>
            {quizId
              ? isCreating
                ? "Updating"
                : "Update"
              : isCreating
                ? "Creating"
                : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuizHeader;
