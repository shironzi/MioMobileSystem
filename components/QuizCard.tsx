import React, { memo } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const QuizCard = (props: {
  title: string;
  total: number;
  quizId: string;
  subjectId: string;
  role: string;
}) => {
  const router = useRouter();

  const handleRoute = () => {
    if (props.role === "teacher") {
      router.push({
        pathname: "/subject/quiz/AddQuiz",
        params: { quizId: props.quizId, subjectId: props.subjectId },
      });
    } else {
      router.push({
        pathname: "/subject/quiz/QuizDetails",
        params: { quizId: props.quizId, subjectId: props.subjectId },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleRoute} style={styles.touchableOpacity}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.yellowBulletin} />
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.score}> - | {props.total}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <View style={styles.icons}>
              <TouchableOpacity></TouchableOpacity>
              <TouchableOpacity></TouchableOpacity>
            </View>
            <Entypo name="chevron-small-right" size={30} color="#aaa" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    top: 15,
  },
  cardContainer: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
    borderRadius: 16,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  yellowBulletin: {
    width: "1.5%",
    height: 55,
    backgroundColor: "#FFBF18",
    borderRadius: 3,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 13,
    color: "#888",
  },
  question: {
    fontSize: 13,
    color: "#888",
  },
  type: {
    fontSize: 13,
    color: "#888",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    textAlign: "right",
  },
  icons: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    top: -8,
  },
});

export default memo(QuizCard);
