import { StyleSheet, Text, View } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import React from "react";

interface Props {
  options: string[];
  correct_answer: string;
  studentAnswer: string;
}

const Multiple = ({ options, correct_answer, studentAnswer }: Props) => {
  return (
    <View style={{ rowGap: 5 }}>
      {options?.map((option, index) => (
        <View
          style={[
            styles.option,
            option === correct_answer && option === studentAnswer
              ? styles.correct
              : option === studentAnswer && styles.incorrect,
          ]}
          key={index}
        >
          <Fontisto
            name={
              studentAnswer === option
                ? "radio-btn-active"
                : "radio-btn-passive"
            }
            size={15}
            color={studentAnswer === option ? "#ffbf18" : "#aaa"}
            style={{ marginRight: 10 }}
          />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  correct: {
    backgroundColor: "#d4edda",
    borderWidth: 1,
    borderColor: "#155724",
  },
  incorrect: {
    backgroundColor: "#f8d7da",
    borderWidth: 1,
    borderColor: "#721c24",
  },
  option: { flexDirection: "row", padding: 10, borderRadius: 8 },
});

export default Multiple;
