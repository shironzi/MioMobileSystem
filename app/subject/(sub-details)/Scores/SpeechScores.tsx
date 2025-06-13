import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivities } from "@/utils/specialized";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SpeechScores = ({
  placeholder,
  subjectId,
  difficulty,
  activityType,
}: {
  subjectId: string;
  difficulty: string;
  placeholder: string;
  activityType: string;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const [pictureEasy, setPictureEasy] = useState<string[]>([]);
  const toggleDropdown = () => setIsVisible(!isVisible);

  const handleViewStudents = (activity: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
      params: {
        subjectId: subjectId,
        activityId: activity,
        activityType: activityType,
        difficulty: difficulty,
      },
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities(subjectId, activityType, difficulty);
      if (data.success) {
        setPictureEasy(data.activities);
      }
    };
    fetchActivities();
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <Text>
          {placeholder} (
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
        </Text>
        {isVisible ? (
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        ) : (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        )}
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.dropdownContent}>
          {pictureEasy.length ? (
            pictureEasy.map((activity, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleViewStudents(activity)}
              >
                <Text style={styles.item}>Level {index + 1}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No Activities Yet</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdownButton: {
    backgroundColor: "#4682B4",
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownContent: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    flexDirection: "column",
    borderWidth: 1,
  },
  item: {
    paddingVertical: 6,
    fontSize: 14,
  },
});

export default SpeechScores;
