import globalStyles from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FileUpload from "@/components/FileUpload";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
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

interface Props {
  isFirst: boolean;
  isLast: boolean;
  index: number;
  handleRemoveItem: (id: string) => void;
  item: QuizItem;
  inputErrors: QuizItemError[];
  handleQuestionInput: (value: string, id: string) => void;
  handleQuestionImage: (id: string, file: FileInfo[]) => void;
  handlePointsInput: (value: string, id: string) => void;
  handleChangeQuestionType: (
    id: string,
    value: QuizItem["questionType"],
  ) => void;
  handleChoiceInput: (text: string, id: string, choiceIndex: number) => void;
  handleRemoveChoice: (id: string, choiceIndex: number) => void;
  handleAddChoice: (id: string) => void;
  handleMultipleAnswer: (id: string) => void;
  handleAnswer: (value: string, id: string) => void;
  handleQuestionType: (value: string, id: string, index: number) => void;
}

const QuizItem = ({
  isFirst,
  isLast,
  index,
  handleRemoveItem,
  item,
  inputErrors,
  handleQuestionInput,
  handleQuestionImage,
  handlePointsInput,
  handleChangeQuestionType,
  handleChoiceInput,
  handleRemoveChoice,
  handleAddChoice,
  handleMultipleAnswer,
  handleAnswer,
  handleQuestionType,
}: Props) => {
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
            <Text style={globalStyles.errorText}>This field is required</Text>
          )}
        </View>
        <TextInput
          value={item.question}
          onChangeText={(value) => handleQuestionInput(value, item.id)}
          style={[
            { borderBottomWidth: 1, borderColor: "#FFBF18" },
            inputErrors.find((err) => err.id === item.id)?.name === "question"
              ? { borderColor: "red" }
              : { borderColor: "#FFBF18" },
          ]}
          placeholder={"Enter Question"}
        />
        <View
          style={{
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
          <Text style={globalStyles.errorText}>Points must be at least 1.</Text>
        )}
        <TextInput
          value={item.points?.toString() || ""}
          onChangeText={(value) => {
            handlePointsInput(value, item.id);
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
            <View style={[globalStyles.textInputContainer, { rowGap: 5 }]}>
              {item.answer.map((answer, index) => (
                <Picker
                  key={index}
                  selectedValue={answer}
                  onValueChange={(value) =>
                    handleQuestionType(value, item.id, index)
                  }
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
            {inputErrors.find((err) => err.id === item.id)?.name === "fill" && (
              <Text style={globalStyles.errorText}>This field is required</Text>
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
              onChangeText={(value: string) => handleAnswer(value, item.id)}
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
};

export default QuizItem;
