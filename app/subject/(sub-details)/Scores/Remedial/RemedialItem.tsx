import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Remedial {
  activity_title: string;
  remedialId: string;
  activityType: string;
}

const RemedialItem = ({
  subjectId,
  remedial,
}: {
  subjectId: string;
  remedial: Remedial;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  let activityType;
  if (remedial.activityType === "question") {
    activityType = "Word";
  } else if (remedial.activityType === "phrase") {
    activityType = "Reading";
  } else {
    activityType =
      remedial.activityType.charAt(0).toUpperCase() +
      remedial.activityType.slice(1).toLowerCase();
  }

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
            {activityType + " - " + remedial.activity_title}
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

      {isVisible && <View></View>}
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
