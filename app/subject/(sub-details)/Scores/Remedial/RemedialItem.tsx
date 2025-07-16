import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";

const RemedialItem = ({
  subjectId,
  remedial,
  remedialId,
  activityType,
  activity_title,
  role,
  studentId,
}: {
  subjectId: string;
  remedial: string[];
  remedialId: string;
  activityType: string;
  activity_title: string;
  role: string;
  studentId: string;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  let activityTypeText;
  if (activityType === "question") {
    activityTypeText = "Word";
  } else if (activityType === "phrase") {
    activityTypeText = "Reading";
  } else if (activityType === "picture") {
    activityTypeText = "Picture";
  } else if (activityType === "bingo") {
    activityTypeText = "Piddie Says";
  } else if (activityType === "matching") {
    activityTypeText = "Piddie Says";
  }

  const handleRoute = (phoneme: string) => {
    if (role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/Remedial/RemedialAttempts",
        params: {
          subjectId: subjectId,
          remedialId: remedialId,
          phoneme: phoneme,
          activityType: activityType,
          role: role,
          studentId: studentId,
        },
      });
      return;
    }
    router.push({
      pathname: "/subject/(sub-details)/Scores/Remedial/RemedialResult",
      params: {
        subjectId: subjectId,
        remedialId: remedialId,
        phoneme: phoneme,
        activityType: activityType,
        role: role,
        studentId: studentId,
      },
    });
  };

  return (
    <View>
      {(activityType === "picture" ||
        activityType === "phrase" ||
        activityType === "phrase") && (
        <View>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.dropdownButton}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={styles.buttonText}>
                {activityTypeText + " - " + activity_title}
              </Text>
              <AntDesign
                name={isVisible ? "up" : "down"}
                size={24}
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
            <View style={{ rowGap: 10 }}>
              {remedial.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[globalStyles.cardContainer]}
                  onPress={() => handleRoute(item)}
                >
                  <Text>/{item}/ Practice</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {(activityType === "bingo" || activityType === "matching") && (
        <View>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.dropdownButton}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={styles.buttonText}>
                {activityTypeText + " - " + activity_title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    paddingVertical: 16,
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
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginRight: 15,
    height: 30,
  },
});

export default RemedialItem;
