import FileUpload from "@/components/FileUpload";
import globalStyles from "@/styles/globalStyles";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  item_no: number;
  question: string;
  type:
    | "multiple_choice"
    | "essay"
    | "file_upload"
    | "fill"
    | "dropdown"
    | "multiple_multiple";
  multiple_type?: "radio" | "checkbox";
  answer?: Answer;
  options: { id: string; label: string }[];
  onAnswerChange: (answer: string | string[], file?: FileInfo[]) => void;
}

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Answer {
  itemId: string;
  answer: string | string[];
  file: FileInfo[] | null;
}

const QuestionCard = ({
  item_no,
  question,
  type,
  options,
  onAnswerChange,
  answer,
}: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string>("");
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [dropdownAnswer, setDropdownAnswer] = useState<string | null>(null);
  const [fileAnswer, setFileAnswer] = useState<FileInfo[]>([]);

  useEffect(() => {
    if (type === "multiple_choice") {
      onAnswerChange(selectedAnswers);
    } else if (type === "essay") {
      onAnswerChange(essayAnswer);
    } else if (type === "fill") {
      onAnswerChange(fillAnswer);
    } else if (type === "dropdown") {
      onAnswerChange(dropdownAnswer ?? "");
    } else if (type === "file_upload") {
      onAnswerChange("", fileAnswer);
    } else if (type === "multiple_multiple") {
      onAnswerChange(multipleAnswers);
    }
  }, [
    selectedAnswer,
    selectedAnswers,
    essayAnswer,
    fillAnswer,
    dropdownAnswer,
    fileAnswer,
  ]);

  useEffect(() => {
    if (!answer) return;

    const ans = answer.answer;

    if (type === "multiple_choice" && typeof ans === "string") {
      setSelectedAnswers(ans);
    } else if (type === "essay" && typeof ans === "string") {
      setEssayAnswer(ans);
    } else if (type === "fill" && typeof ans === "string") {
      setFillAnswer(ans);
    } else if (type === "dropdown" && typeof ans === "string") {
      setDropdownAnswer(ans);
    } else if (type === "multiple_multiple" && Array.isArray(ans)) {
      setMultipleAnswers(ans);
    }

    if (answer.file) {
      setFileAnswer(answer.file);
    }
  }, []);

  return (
    <View
      style={[
        globalStyles.cardContainer1,
        { padding: 0, marginVertical: 10, rowGap: 0 },
      ]}
    >
      <View
        style={{
          backgroundColor: "#AAC8FF45",
          paddingHorizontal: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 44,
        }}
      >
        <Text style={[{ marginVertical: "auto" }, globalStyles.text1]}>
          Question {item_no}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ lineHeight: 20 }}>{question}</Text>

        <View
          style={[
            globalStyles.divider,
            { marginHorizontal: -20, marginVertical: 15 },
          ]}
        />
        <View style={{ paddingHorizontal: 10 }}>
          {type === "multiple_choice" && (
            <View style={{ rowGap: 10 }}>
              {options.map((choice) => (
                <TouchableOpacity
                  key={choice.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={() => {
                    setSelectedAnswer(choice.label);
                  }}
                >
                  <Fontisto
                    name={
                      selectedAnswer === choice.label
                        ? "radio-btn-active"
                        : "radio-btn-passive"
                    }
                    size={15}
                    color={selectedAnswer === choice.label ? "#ffbf18" : "#aaa"}
                    style={{ marginRight: 10 }}
                  />
                  <Text>{choice.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {type === "multiple_multiple" && (
            <View style={{ rowGap: 10 }}>
              {options.map((choice) => (
                <TouchableOpacity
                  key={choice.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={() => {
                    setMultipleAnswers((prev) => {
                      if (prev.includes(choice.label)) {
                        return prev.filter((answer) => answer !== choice.label);
                      } else {
                        return [...prev, choice.label];
                      }
                    });
                  }}
                >
                  <Ionicons
                    name={
                      multipleAnswers.includes(choice.label)
                        ? "checkbox"
                        : "checkbox-outline"
                    }
                    size={15}
                    color={
                      multipleAnswers.includes(choice.label)
                        ? "#ffbf18"
                        : "#aaa"
                    }
                  />
                  <Text>{choice.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {type === "essay" && (
            <TextInput
              placeholder="Write your answer..."
              multiline
              value={essayAnswer}
              onChangeText={setEssayAnswer}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                textAlignVertical: "top",
                minHeight: 100,
              }}
            />
          )}

          {type === "fill" && (
            <TextInput
              placeholder="Enter your answer..."
              value={fillAnswer}
              onChangeText={setFillAnswer}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
              }}
            />
          )}

          {type === "file_upload" && (
            <FileUpload
              handleFiles={(file: FileInfo[]) => {
                setFileAnswer(file);
              }}
            />
          )}

          {type === "dropdown" && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <Picker
                selectedValue={dropdownAnswer}
                onValueChange={(itemValue) => setDropdownAnswer(itemValue)}
              >
                <Picker.Item label="Select an option..." value={null} />
                {options?.map((choice, index) => (
                  <Picker.Item
                    key={index}
                    label={choice.label}
                    value={choice.label}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default QuestionCard;
