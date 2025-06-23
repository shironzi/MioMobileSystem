import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const QuizzesScores = ({
  subjectId,
  role,
  quizzes,
  placeholder,
}: {
  subjectId: string;
  quizzes: { id: string; title: string }[];
  role: string;
  placeholder: string;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  const handleViewStudents = (quizId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
      params: {
        subjectId,
        quizId: quizId,
        role: role,
        activityType: placeholder.toLowerCase(),
      },
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={styles.buttonText}>{placeholder}</Text>
        <MaterialIcons
          name={isVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownContent}>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <TouchableOpacity
                key={quiz.id}
                onPress={() => handleViewStudents(quiz.id)}
              >
                <Text style={styles.item}>{quiz.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.item}>No Activities Yet</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownContent: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  item: {
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default QuizzesScores;
