import React, { useCallback, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const SpeechTrainingExercise = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Language Training Exercises",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  return (
    <View style={styles.courseContainer}>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(speech)/level")}
          >
            <Image
              source={require("@/assets/icons/Speaker_Notes.png")}
              style={styles.icon}
            />
            <Text>ReadMe Flashcard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(speech)/level")}
          >
            <Image
              source={require("@/assets/icons/Technology_Lifestyle.png")}
              style={styles.icon}
            />
            <Text>Talk2Me: Responding Questions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(speech)/level")}
          >
            <Image
              source={require("@/assets/icons/homonyms.png")}
              style={styles.icon}
            />
            <Text>Homonyms</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 20,
  },
  dropdownContainer: {
    width: 200,
  },
  dropdown: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  selectedTextStyle: {
    color: "#FFBF18",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
  iconStyle: {
    fontSize: 20,
    color: "#FFBF18",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 20,
  },
  gridItem: {
    width: "48%",
    justifyContent: "center",
    marginBottom: 16,
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    height: 140,
    padding: 16,
    fontSize: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
});

export default memo(SpeechTrainingExercise);
