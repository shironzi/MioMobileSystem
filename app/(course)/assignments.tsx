import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

const assignments = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Assignments",
      headerStyle: {
        backgroundColor: "#2264DC",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);
  return (
    <View>
      <Text>assignments</Text>
    </View>
  );
};

export default assignments;
