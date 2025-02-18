import { View, Text } from "react-native";
import React, { memo, useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";

const speechTrainingExercises = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Course Details",
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
    <View>
      <Text>speechTrainingExercies</Text>
    </View>
  );
};

export default memo(speechTrainingExercises);
