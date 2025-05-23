import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import useDebouncedCallback from "@/utils/useDebounceCallback";
import { string } from "yup";

const QuizQuestion = (props: {
  questionData: {
    question: string;
    options: string[];
    answer: string;
    type: string;
  };
  questionIndex: number;
  handleAddQuestion: (
    question: string,
    options: string[],
    answer: string,
    type: string,
  ) => void;
}) => {
  const [options, setOptions] = useState<string[]>([""]);
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [emptyFilled, setEmptyFilled] = useState<boolean>(false);

  const handleAddChoice = useCallback(() => {
    if (options[options.length - 1].trim() === "") {
      setEmptyFilled(true);
      return;
    }

    setEmptyFilled(false);
    setOptions((prev) => [...prev, ""]);
  }, [options]);

  const handleChoiceChange = useCallback((index: number, text: string) => {
    setOptions((prev) => prev.map((c, i) => (i === index ? text : c)));
  }, []);

  const handleRemoveChoice = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const debouncedNotify = useDebouncedCallback(
    (question: string, choices: string[], answer: string, type: string) => {
      props.handleAddQuestion(question, choices, answer, type);
    },
    500,
  );

  useEffect(() => {
    debouncedNotify(question, options, answer, selectedType);
  }, [selectedType, question, options, answer, debouncedNotify]);

  useEffect(() => {
    if (props.questionData) {
      setQuestion(props.questionData.question || "");
      setOptions(
        props.questionData.options.length ? props.questionData.options : [""],
      );
      setAnswer(props.questionData.answer || "");
      setSelectedType(props.questionData.type || "");
    }
  }, [props.questionData]);

  return (
    <View style={{ rowGap: 15, paddingVertical: 20 }}>
      <Text>Question {props.questionIndex + 1}</Text>
      <TextInput
        value={question}
        style={{ borderBottomWidth: 1 }}
        placeholder="Your question… Description"
        onChangeText={setQuestion}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Text>Quiz Type</Text>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          dropdownIconColor="#333"
          placeholder={"Select Quiz Type"}
          mode="dropdown"
          style={{ width: "80%", justifyContent: "flex-end" }}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Multiple choice" value="multiple_choice" />
          <Picker.Item label="True or False" value="true_false" />
          <Picker.Item label="Identification" value="identification" />
        </Picker>
      </View>

      {selectedType === "multiple_choice" ? (
        <>
          <View>
            {options.map((choice, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 15,
                }}
              >
                <TextInput
                  style={[
                    styles.choiceInput,
                    emptyFilled ? { borderColor: "red" } : {},
                  ]}
                  placeholder={`Choice ${index + 1}`}
                  value={choice}
                  onChangeText={(text) => handleChoiceChange(index, text)}
                />
                {options.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveChoice(index)}>
                    <AntDesign name="close" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddChoice}
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <FontAwesome6 name="add" size={20} color="black" />
              <Text>Add Choice</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : selectedType === "identification" ? (
        <View>
          <TextInput
            placeholder={"answer"}
            style={{ borderWidth: 1 }}
            value={answer}
            onChangeText={setAnswer}
          />
        </View>
      ) : null}

      {selectedType.trim() !== "" ? (
        selectedType === "true_false" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Answer: </Text>
            <Picker
              selectedValue={answer}
              onValueChange={(itemValue) => setAnswer(itemValue)}
              dropdownIconColor="#333"
              placeholder={"Select Answer"}
              mode="dropdown"
              style={{ width: "80%", justifyContent: "flex-end" }}
            >
              <Picker.Item label={"True"} value={"true"} />
              <Picker.Item label={"False"} value={"false"} />
            </Picker>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Answer: </Text>
            <Picker
              selectedValue={answer}
              onValueChange={(itemValue) => setAnswer(itemValue)}
              dropdownIconColor="#333"
              placeholder={"Select Answer"}
              mode="dropdown"
              style={{ width: "80%", justifyContent: "flex-end" }}
            >
              {options.map((choice, index) => (
                <Picker.Item label={choice} value={choice} key={index} />
              ))}
            </Picker>
          </View>
        )
      ) : null}
    </View>
  );
};

export default memo(QuizQuestion);

const styles = StyleSheet.create({
  questionContainer: {
    top: 25,
    marginTop: -35,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    flex: 1,
    elevation: 5,
    borderWidth: 0,
    borderColor: "none",
    shadowColor: "none",
  },
  questionLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: -5,
  },
  descriptionInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2c240",
    fontStyle: "italic",
    color: "#aaa",
    marginVertical: 10,
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 5,
    width: 290,
  },
  choiceInput: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
    borderWidth: 1,
    borderRadius: 15,
  },
  removeIcon: {
    color: "#808080",
    fontSize: 18,
    paddingLeft: 10,
    left: 35,
  },
  addChoiceText: {
    color: "#ffbf18",
    marginTop: 10,
    textDecorationLine: "underline",
    left: 5,
  },
  questionSeparator: {
    height: 3,
    backgroundColor: "#f0f0f0",
    width: "113%",
    left: -20,
    top: 5,
    marginTop: 20,
  },
  blankAnswerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 5,
  },
  blankAnswerInput: {
    color: "#aaa",
  },
});
