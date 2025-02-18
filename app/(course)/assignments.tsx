import { View, Text } from "react-native";
import React, { memo, useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";

const assignments = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Assignments",
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
      <Text>assignments</Text>
    </View>
  );
};

export default memo(assignments);
