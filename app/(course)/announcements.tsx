import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

const announcements = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Announcments",
      headerStyle: {
        backgroundColor: "#2264DC",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  return (
    <View>
      <Text>announcements</Text>
    </View>
  );
};

export default announcements;
