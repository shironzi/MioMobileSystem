import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

const modules = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Modules",
      headerStyle: {
        backgroundColor: "#2264DC",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);
  return (
    <View>
      <Text>modules</Text>
    </View>
  );
};

export default modules;
