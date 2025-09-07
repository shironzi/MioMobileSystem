import { StyleSheet, Text, TextInput, View } from "react-native";
import FileUpload from "@/components/FileUpload";
import { FileInfo } from "@/app/subject/(exercises)/(language)/ManageActivity/AddLanguageActivity";

interface Props {
  title: string;
  score?: string;
  setScore?: (score: string) => void;
  totalScore?: string;
  question?: string;
  hasScore?: boolean;
  answerType?: string;
  studentAnswer?: string | FileInfo[];
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
        {title === "Description" && <Text>{question}</Text>}

        {answerType === "text" && typeof studentAnswer === "string" && (
          <TextInput
            style={styles.textAnswer}
            multiline={true}
            placeholder="Answer"
            textAlignVertical="top"
            value={studentAnswer}
          />
        )}

        {answerType === "file" && (
          <FileUpload handleFiles={(file: FileInfo[]) => {}} />
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
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    width: "85%",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 2.5,
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
  },
  questionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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
