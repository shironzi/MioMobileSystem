import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SpeechScores = ({
  placeholder,
  subjectId,
  difficulty,
  activityType,
  activityIds = [],
}: {
  subjectId: string;
  difficulty: string;
  placeholder: string;
  activityType: string;
  activityIds?: string[];
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  const handleViewStudents = (activity: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
      params: {
        subjectId,
        activityId: activity,
        activityType,
        difficulty,
      },
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={styles.buttonText}>
          {placeholder} (
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
        </Text>
        <MaterialIcons
          name={isVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownContent}>
          {activityIds.length > 0 ? (
            activityIds.map((activity, index) => (
              <TouchableOpacity
                key={activity}
                onPress={() => handleViewStudents(activity)}
              >
                <Text style={styles.item}>Level {index + 1}</Text>
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

export default SpeechScores;
