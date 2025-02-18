import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

const speechTrainingExercises = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Speech Training Exercises",
      headerStyle: {
        backgroundColor: "#2264DC",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);
  return (
    <View>
      <Text>speechTrainingExercies</Text>
    </View>
  );
};

export default speechTrainingExercises;
