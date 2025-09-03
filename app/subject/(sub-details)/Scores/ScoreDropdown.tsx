import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { memo, useState } from "react";
import {
  SpecializedActivity,
  Student,
} from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import ItemCard from "@/app/subject/(sub-details)/Scores/ItemCard";
import { router } from "expo-router";

interface Props {
  title: string;
  sActivity: SpecializedActivity[];
  students: Student[];
  role: string;
  subjectId: string;
  activityType: string;
}

const ScoreDropdown = ({
  title,
  sActivity = [],
  students = [],
  role,
  subjectId,
  activityType,
}: Props) => {
  const [isVisible, setVisible] = useState(false);

  const handleRoute = (difficulty: string) => {
    const selectedDifficulty = sActivity.find(
      (act) => act.difficulty === difficulty,
    );

    console.log(selectedDifficulty);

    router.push({
      pathname: "/subject/Scores/SelectActivity",
      params: {
        sActivity: JSON.stringify(selectedDifficulty?.activities),
        students: JSON.stringify(students),
        role,
        subjectId,
        activityType,
      },
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(!isVisible)}
        style={styles.button}
      >
        <Text style={styles.title}>{title}</Text>
        <AntDesign
          name={isVisible ? "up" : "down"}
          size={22}
          color="#FFBF18"
          style={{ top: 5 }}
        />
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.difficulties}>
          <Text>Select Difficulty</Text>
          <ItemCard
            handleRoute={() => handleRoute("easy")}
            placeholder={"Easy"}
          />
          <ItemCard
            handleRoute={() => handleRoute("average")}
            placeholder={"Average"}
          />
          <ItemCard
            handleRoute={() => handleRoute("difficult")}
            placeholder={"Difficult"}
          />
          <ItemCard
            handleRoute={() => handleRoute("challenge")}
            placeholder={"Challenge"}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
  },
  difficulties: {
    rowGap: 10,
  },
  title: { fontSize: 16, lineHeight: 56, color: "#1F1F1F", fontWeight: "500" },
});

export default memo(ScoreDropdown);
