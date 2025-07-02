import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const SpeechScores = ({
  placeholder,
  subjectId,
  difficulty,
  activityType,
  activityIds = [],
  role,
}: {
  subjectId: string;
  difficulty: string;
  placeholder: string;
  activityType: string;
  activityIds?: string[];
  role: string;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  const handleViewStudents = (activity: string) => {
    console.log(role);
    if (role === "student" || role === "parent") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/ScoreAttempts",
        params: {
          subjectId,
          activityId: activity,
          activityType,
          difficulty,
          role: role,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
        params: {
          subjectId,
          activityId: activity,
          activityType,
          difficulty,
          role: role,
        },
      });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.buttonText}>
            {placeholder} (
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
          </Text>
          <AntDesign
            name={isVisible ? "up" : "down"}
            size={20}
            color="#FFBF18"
          />
        </View>
        <MaterialIcons
          name={isVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={{ rowGap: 5, width: "90%", marginHorizontal: "auto" }}>
          {activityIds.length > 0 ? (
            activityIds.map((activity, index) => (
              <TouchableOpacity
                key={activity}
                onPress={() => handleViewStudents(activity)}
                style={styles.dropdownContent}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.yellowBulletin}></View>
                    <Text style={[styles.item, globalStyles.text1]}>
                      Exercise {index + 1}
                    </Text>
                  </View>
                  <FontAwesome
                    name="long-arrow-right"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.dropdownContent}>
              <Text style={styles.item}>No Activities Yet</Text>
            </View>
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
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginRight: 15,
    height: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownContent: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000024",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default SpeechScores;
