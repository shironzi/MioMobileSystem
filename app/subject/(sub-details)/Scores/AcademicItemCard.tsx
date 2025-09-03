import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  title: string;
  score: string;
  setScore: (score: string) => void;
  totalScore: string;
  question: string;
}

const AcademicItemCard = ({
  title,
  score,
  setScore,
  totalScore,
  question,
}: Props) => {
  return (
    <View style={styles.cardContainer}>
      {/*  Title*/}
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.scoreContainer}>
          <TextInput
            value={score}
            onChangeText={setScore}
            style={[styles.ScoreText, styles.ScoreInput]}
          />
          <Text style={styles.ScoreText}>/</Text>
          <Text style={styles.ScoreText}>{totalScore}</Text>
        </View>
      </View>

      {/*  Question*/}
      <View style={styles.questionContainer}>
        <Text>{question}</Text>
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
  },
});

export default AcademicItemCard;
