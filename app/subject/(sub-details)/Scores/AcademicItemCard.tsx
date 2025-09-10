import { StyleSheet, Text, TextInput, View } from "react-native";
import FilePreview from "@/components/Files/FilePreview";
import React from "react";
import Multiple from "@/components/quiz/Multiple";

interface Props {
  title: string;
  score?: string;
  setScore?: (score: string) => void;
  totalScore?: string;
  description?: string;
  question?: string;
  hasScore?: boolean;
  answerType?: string;
  studentAnswer?: string;
  options?: string[];
  correct_answer?: string;
}

const AcademicItemCard = ({
  title,
  score,
  setScore,
  totalScore,
  question = "",
  hasScore = true,
  answerType,
  studentAnswer,
  options,
  description,
  correct_answer,
}: Props) => {
  return (
    <View style={styles.cardContainer}>
      {/*  Title*/}
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
        {hasScore && (
          <View style={styles.scoreContainer}>
            <TextInput
              value={score}
              onChangeText={setScore}
              style={[styles.ScoreText, styles.ScoreInput]}
            />
            <Text style={styles.ScoreText}>/</Text>
            <Text style={styles.ScoreText}>{totalScore}</Text>
          </View>
        )}
      </View>

      {/*  Question*/}
      <View style={styles.questionContainer}>
        {description && <Text>{description}</Text>}

        <Text>{question}</Text>
        {answerType === "text" && typeof studentAnswer === "string" && (
          <TextInput
            style={styles.textAnswer}
            multiline={true}
            placeholder="Answer"
            textAlignVertical="top"
            value={studentAnswer}
            editable={false}
          />
        )}

        {answerType === "file" && studentAnswer && (
          <FilePreview url={studentAnswer} />
        )}

        {answerType === "multiple_choice" &&
          options &&
          correct_answer &&
          studentAnswer && (
            <Multiple
              options={options}
              correct_answer={correct_answer}
              studentAnswer={studentAnswer}
            />
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    rowGap: 10,
    minHeight: 125,
  },
  cardHeader: {
    backgroundColor: "#AAC8FF45",
    paddingHorizontal: 26,
    paddingVertical: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 2.5,
    width: "10%",
  },
  ScoreText: {
    fontWeight: 500,
    fontSize: 15,
  },
  ScoreInput: {
    backgroundColor: "#DBE5F7",
    textAlign: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#B5C4DF",
    borderRadius: 7.5,
    width: 40,
  },
  questionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    rowGap: 10,
  },
  textAnswer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E6E6E6",
    padding: 10,
    minHeight: 120,
  },
});

export default AcademicItemCard;
