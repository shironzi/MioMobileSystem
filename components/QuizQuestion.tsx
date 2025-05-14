import React, {memo, useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import { FontAwesome } from "@expo/vector-icons";


interface Question {
  type: string;
  description: string;
  choices: string[];
}

interface QuizQuestionProps {
  question: Question;
  qIndex: number;
  updateQuestionDescription: (index: number, text: string) => void;
  handleChoiceChange: (qIndex: number, cIndex: number, text: string) => void;
  addChoice: (qIndex: number) => void;
  removeChoice: (qIndex: number, cIndex: number) => void;
  deleteQuestion: (index: number) => void;
  totalQuestions: number;
}

const [questions, setQuestions] = useState<any[]>([]);

const addNewQuestion = (type:any) => {
  const newQuestion = {
    type,
    description: "",
    choices: type === "fillInTheBlank" ? [] : [""],
  };
  setQuestions([...questions, newQuestion]);
};

const QuizQuestion = ({
  question,
  qIndex,
  updateQuestionDescription,
  handleChoiceChange,
  addChoice,
  removeChoice,
  deleteQuestion,
  totalQuestions,
}: QuizQuestionProps) => {
  return (
    <View style={styles.questionContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.questionLabel}>Question {qIndex + 1}</Text>
        <TouchableOpacity onPress={() => deleteQuestion(qIndex)}>
          <FontAwesome name="times" size={15} color="#aaa" style={{ top: 3 }} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.descriptionInput}
        placeholder="Description"
        placeholderTextColor="#aaa"
        value={question.description}
        onChangeText={(text) => updateQuestionDescription(qIndex, text)}
      />

      {question.type === "multipleChoice" && (
        <>
          {question.choices.map((choice, cIndex) => (
            <View key={cIndex} style={styles.choiceRow}>
              <TextInput
                style={styles.choiceInput}
                placeholder={`Choice ${cIndex + 1}`}
                placeholderTextColor="#aaa"
                value={choice}
                onChangeText={(text) =>
                  handleChoiceChange(qIndex, cIndex, text)
                }
              />
              <TouchableOpacity onPress={() => removeChoice(qIndex, cIndex)}>
                <FontAwesome
                  name="times"
                  size={20}
                  color="#aaa"
                  style={styles.removeIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addChoice(qIndex)}>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome
                name="plus"
                size={12}
                color="#ffbf18"
                style={{ top: 13, left: 0 }}
              />
              <Text style={styles.addChoiceText}>Add Choice</Text>
            </View>
            {qIndex < totalQuestions - 1 && (
              <View style={styles.questionSeparator}></View>
            )}
          </TouchableOpacity>
        </>
      )}

      {question.type === "trueFalse" && (
        <>
          {["True", "False"].map((option, tfIndex) => (
            <View key={tfIndex} style={styles.blankAnswerContainer}>
              <TextInput
                style={{ color: "#aaa" }}
                value={option}
                editable={false}
              />
            </View>
          ))}
          {qIndex < totalQuestions - 1 && (
            <View style={styles.questionSeparator}></View>
          )}
        </>
      )}

      {question.type === "fillInTheBlank" && (
        <View style={styles.blankAnswerContainer}>
          <TextInput
            style={styles.blankAnswerInput}
            placeholder="Written answer"
            placeholderTextColor="#aaa"
            editable={false}
          />
        </View>
      )}
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
    marginTop: 10,
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
  buttonRow: {
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
 },
  button: {
    backgroundColor:"#ffbf18",
    padding:14,
    borderRadius:50,
    elevation:5,
    margin:20,
    top:-20
 },
 buttonText: {
    color:"#fff",
    fontWeight:"bold",
    fontSize:16,
    left:5
 },
});
