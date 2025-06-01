import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const level = () => {
  const router = useRouter();

  const { activity_type, category, subjectId, role } = useLocalSearchParams<{
    activity_type: string;
    category: string;
    subjectId: string;
    role: string;
  }>();

  HeaderConfig("Levels");

  const handleEasyRoute = () =>
    router.push({
      pathname: "/subject/(exercises)/play",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: "easy",
        category: category,
        role: role,
      },
    });

  const handleAverageRoute = () =>
    router.push({
      pathname: "/subject/(exercises)/play",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: "Average",
        category: category,
        role: role,
      },
    });

  const handleDifficultRoute = () =>
    router.push({
      pathname: "/subject/(exercises)/play",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: "Difficult",
        category: category,
        role: role,
      },
    });

  const handleChallengeRoute = () =>
    router.push({
      pathname: "/subject/(exercises)/play",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: "Challenge",
        category: category,
        role: role,
      },
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Difficulty Level</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={handleEasyRoute}>
          <MaterialIcons
            name="star"
            size={50}
            color="#009c41"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#009c41" }]}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleAverageRoute}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FFda03"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FFda03" }]}>Average</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleDifficultRoute}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FFa700"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FFa700" }]}>Difficult</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleChallengeRoute}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FF0000"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FF0000" }]}>Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    // alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    left: 0,
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    // flexWrap: "wrap",
    gap: 20,
  },
  card: {
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    // marginTop: 10,
    left: 80,
    marginTop: -35,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  icon: {
    left: 15,
    marginTop: 20,
  },
});

export default memo(level);
