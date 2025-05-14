import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import Quizard from "@/components/QuizCard";
import HeaderConfig from "@/components/HeaderConfig";
import { useRouter } from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import QuizCard from "@/components/QuizCard";

const data = [
  {
    id: 1,
    title: "Quiz 1: Sound Difference",
    date: new Date(Date.now()),
    time: "10:00 AM",
    score: 20 + " pts",
    question: 20 + " questions",
    type: "File Upload",
  },
  {
    id: 2,
    title: "Quiz 2",
    date: new Date(Date.now()),
    time: "10:00 AM",
    score: 50 + " pts",
    question: 50 + " questions",
    type: "Quiz",
  },
];

const quiz = () => {
  HeaderConfig("Quizzes");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {data.map((item) => (
            <QuizCard
              key={item.id}
              title={item.title}
              date={item.date}
              time={item.time}
              score={item.score}
              question={item.question}
              type={item.type}
              onPress={() => router.push({
                pathname: "assDetails",
                params: {
                  id: item.id.toString(),
                  type: item.type
                }
              })}
              
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("addAssignment")}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  content: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default memo(quiz);
